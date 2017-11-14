console.log("||\u2713  Opened File [./app/routes.js]");

// ========================================================
// =====   Dependencies   =================================
// ========================================================

var mongoose = require("mongoose");
var Pantry = require("./models/pantry.js");
var Recipe = require("./models/recipe.js");
var pantries = mongoose.model('Pantry');
var recipes = mongoose.model('Recipe');
var databaseUrl = "Pantry";
var collections = ["pantries"];
var mongojs = require("mongojs");
var path = require("path");
var db = mongoose.connection;

// ========================================================
// =====   Exports   ======================================
// ========================================================

module.exports = function (app, passport) {

  // ======================================================
  // =====   Home Page   ==================================
  // ======================================================

  // Show the home page
  app.get('/', function (req, res) {
    res.render('index.pug');
  });// end app.get('/')

  // ======================================================
  // =====   Login   ======================================
  // ======================================================

  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.pug');
  });// end app.get('/login')

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login' // redirect back to the signup page if there is an err
  }));// end app.post('/login')

  // ======================================================
  // =====   Signup   =====================================
  // ======================================================

  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.pug');
  });// end app.get('/signup')

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup' // redirect back to the signup page if there is an err
  }));// end app.post('/signup')

  // ======================================================
  // =====   Profile   ====================================
  // ======================================================

  // Once the user signs in bring them to thier profile
  app.get('/profile', isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/user.html"));
  });// end app.get('/profile')

  // ======================================================
  // =====   Recipes   ====================================
  // ======================================================

  // When a user clicks the Prepare a Recipe link, it will search for all recipes
  // that they can make right now with the current ingredients in stock.
  app.get('/recipenow', isLoggedIn, function (req, res) {
    // Grab everything and put them in an array to use to search against
    Pantry.find({ "user": req.user.local.username }, function (err, pantryData) {
      // Log any errors if the server encounters one
      if (err) {
        console.log(err);
      }
      // Otherwise, send the result of this query to the browser
      else {
        Recipe.find({}, function (err, recipeData) {
          // Log any errors if the server encounters one
          if (err) {
            console.log(err);
          }// end if()
          // Else, assign data to allRecipes Variable
          else {
            var wtf = recipeData.filter((obj, val) => {
              let temp = [];
              obj.ingredients.forEach(recEl => {
                pantryData.forEach(panEl => {
                  if (recEl.ingredient == panEl.item) {
                    temp.push(recEl);
                  }// end if()
                });// end pantry.forEach()
              });// end obj.ingredients.forEach()
              if (temp.length == obj.ingredients.length) {
                return obj;
              }// end if()
              // res.json(wtf);
            });// end recipeData.filter
            res.sendFile(path.join(__dirname, "../public/recipeNow.html"));
          }// end else()
        });// end Recipe.find()
      }// end else()
    });// end Pantry.find()
  });// end app.get('/recipenow')

  // When a user clicks on a specific recipe, show them that recipe
  app.get("/recipe/:id", isLoggedIn, function (req, res) {
    var idPath = req.params.id;
    var pathArr = idPath.split('?');
    var recipeID = pathArr[0];
    var recipe = {};
    Recipe.find({ _id: recipeID }, function (err, recipeData) {
      // Log any errors if the server encounters one
      if (err) {
        console.log(err);
      }// end if()
      // Else, assign data to allRecipes Variable
      else {
        recipe = recipeData[0];
        res.render('recipe.pug', recipe);
      }// end else()
    });// end Recipe.find()
  });

  // need to add isLoggedIn middleware into app.post('/recipe')
  app.post('/recipe', function (req, res) {
    newRecipe = new Recipe();
    newRecipe.author = req.user.local.username;
    newRecipe.title = req.body.title;
    newRecipe.cuisine = req.body.cuisine;
    newRecipe.image_url = req.body.image_url;
    newRecipe.ingredients = req.body.ingredients;
    newRecipe.instructions = req.body.instructions;
    // Add newRecipe to DB
    newRecipe.save(function (err) {
      if (err)
        throw err;
      return (null, newRecipe);
    });// end newRecipe.save()
  });// end app.post('/recipe')  

  // ======================================================
  // =====   Pantry   =====================================
  // ======================================================

  app.get("/pantry", function (req, res) {
    // Run API Function to pull my Pantry
    getMyPantry(req, res);
  });// end app.post('/pantry')

  app.post('/pantry', function (req, res) {
    // Run API function to add to my Pantry
    addToPantry(req, res);
  });// end app.post('/pantry')

  app.post('/pantry/delete', function (req, res) {
    // Grab ID of item to delete
    var ingredientID = req.body.id;
    // Run MiddleWare function to add to my Pantry
    removeFromPantry(req, res, ingredientID);
  });// end app.post('/pantry')

  // ======================================================
  // =====   Logout   =====================================
  // ======================================================

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });// end app.get('/logout')

  // ======================================================
  // =====   API Routes   =================================
  // ======================================================

  app.get('/recipenow/data', isLoggedIn, function (req, res) {
    getNowRecipes(req, res);
  });// end app.get('/recipenow/data')

  app.get("/pantry", function (req, res) {
    // Run API Function to pull my Pantry
    getMyPantry(req, res);
  });// end app.post('/pantry')

};// end module.exports()



// ======================================================
// =====   MiddleWare Functions   =======================
// ======================================================

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/');
}// end isLoggedIn()s

function changeDBQuantity(old, add) {
  var newQty = 0;
  newQty = old + add;
  return newQty;
}// end changeDBQuantity()

function checkIngredientStock(arr, attr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][attr] === value) {
      // Do Something
    } else {
      // Do Something
    }// end if/else()
  }// end for()
}// end checkIngredientStock()

function getMyPantry(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  Pantry.find({ "user": req.user.local.username }, function (err, data) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }// end if()
    // Otherwise, send the result of this query to the browser
    else {
      data = data.sort();
      res.json(data);
    }// end else()
  });// end Pantry.find
}// end getMyPantry()

function getMyPantryData(req, res) {
  Pantry.find({ "user": req.user.local.username }, function (err, data) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }// end if()
    // Otherwise, send the result of this query to the browser
    else {
      return data;
    }// end else()
  });// end Pantry.find
  // return myPantry;
}// end getMyPantry()

function removeFromPantry(req, res, ingredientID) {
  Pantry.remove({ _id: ingredientID }, function (err, data) {
    if (err) throw err;
    res.send(data);
  });
}

function addToPantry(req, res) {
  Pantry.find({ "user": req.user.local.username, "item": req.body.item }, function (err, data) {
    if (data.length === 0) {
      newItem = new Pantry();
      newItem.user = req.user.local.username;
      newItem.item = req.body.item;
      newItem.quantity = req.body.quantity;
      newItem.save(function (err) {
        if (err)
          throw err;
        return (null, newItem);
      });// end newItem.save()
    } else {
      var qtyToAdd = parseFloat(req.body.quantity);
      var oldQty = parseFloat(data[0].quantity);
      var newQtyToAddToDB = changeDBQuantity(oldQty, qtyToAdd);
      Pantry.update(
        { item: req.body.item },
        {
          $set:
          {
            quantity: newQtyToAddToDB
          }
        },// end $set{}
        function (err, data) {
          if (err) {
            console.log(err);
          }
          res.redirect("/profile");
        }// end callback()
      );// end db.pantries.update()
    }// end if/else()
    res.redirect("/profile");
  });// end db.pantries.find()
}// end addToPantry()

function getNowRecipes(req, res) {

  // Grab everything and put them in an array to use to search against
  Pantry.find({ "user": req.user.local.username }, function (err, pantryData) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      Recipe.find({}, function (err, recipeData) {
        // Log any errors if the server encounters one
        if (err) {
          console.log(err);
        }// end if()
        // Else, assign data to allRecipes Variable
        else {
          var wtf = recipeData.filter((obj, val) => {
            let temp = [];
            obj.ingredients.forEach(recEl => {
              pantryData.forEach(panEl => {
                if (recEl.ingredient == panEl.item) {
                  temp.push(recEl);
                }// end if()
              });// end pantry.forEach()
            });// end obj.ingredients.forEach()
            if (temp.length == obj.ingredients.length) {
              return obj;
            }// end if()
          });// end recipeData.filter
          res.json(wtf);
        }// end else()
      });// end Recipe.find()
    }// else()
  });// end Pantry.find()
}// end req, res

function getAllRecipes() {
  Recipe.find({}, function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      // Do Somthing
    }
  });// end Recipe.find()
}// end getAllRecipes()



// ========================================================
// =====   Changelog   ====================================
// ========================================================

// 11/13/17 21:24 CS When user adds a new recipe, the author now becomes the user that is signed in.
// 11/14/17 06:42 CS Cleaned up Code, Categorized Routes, and commented code.
// 11/14/17 09:27 CS removed all commented and useless console.logs
// 11/14/17 09:42 CS added isLoggedIn to .get /recipe/:id