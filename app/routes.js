console.log("||\u274c  Opened File [./app/routes.js]");
console.log("\u26a0 == Finish Converting templage from EJS to Pug and have extend a Main.pug to keep code DRY");

// ========================================================
// =====   Dependencies   =================================
// ========================================================

var mongoose = require("mongoose");
var Pantry = require("./models/Pantry.js");
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
  
  app.get('/', function (req, res) {
    res.render('index.pug'); // load the index.pug file
  });// end app.get('/')

  // ======================================================
  // =====   Login   ======================================
  // ======================================================
  
  // show the login form
  app.get('/login', function (req, res) {
    // render the page and pass in any flash data if it exists
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

  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function (req, res) {
    
    // This will be needed if using PUG
    // res.sendFile(path.join(__dirname, "../public/profile.html"));
    
    // var myPantry = [];
    // console.log("user", req.user.local.username);

    // db.pantries.find({ user: req.user.local.username}, function(err, data) {
    //   // Log any errors if the server encounters one
    //   if (err) {
    //     console.log("err", err);
    //   }
    //   // Otherwise, send the result of this query to the browser
    //   else {
    //     for (var i = 0; i < data.length; i++) {
    //       var eachItem = {
    //         item: data[i].item,
    //         quantity: data[i].quantity
    //       };
    //       myPantry.push(eachItem);
    //     }
    //   }
    //   console.log("My Pantry currently has: ", myPantry);
    // });
    // res.render('profile.pug', {
    //   "user": req.user
    // //   "Pantry": myPantry
    // });// end res.render()

    res.sendFile(path.join(__dirname, "../public/user.html"));
  });// end app.get('/profile')

  // ======================================================
  // =====   Recipes   ====================================
  // ======================================================

  app.get('/recipenow', isLoggedIn, function(req, res) {

    // Grab everything and put them in an array to use to search against
    Pantry.find({"user": req.user.local.username}, function(err, pantryData) {
      // Log any errors if the server encounters one
      if (err) {
        console.log(err);
      }
      // Otherwise, send the result of this query to the browser
      else {
        // console.log("Pantry data", pantryData);
        Recipe.find({}, function(err, recipeData) {
          // Log any errors if the server encounters one
          if (err) {
            console.log(err);
          }// end if()
          // Else, assign data to allRecipes Variable
          else {
            // console.log("Recipe Data: ", recipeData);
            // console.log("Pantry Data again: ", pantryData);

            var wtf = recipeData.filter((obj, val) => {
              console.log("-----New Recipe-----:", obj.title);
              console.log("Recipe Ingredient Length:", obj.ingredients.length);
              console.log("Value is:", val);
              let temp = [];
              obj.ingredients.forEach(recEl => {
                pantryData.forEach(panEl => {
                  if (recEl.ingredient == panEl.item) {
                    // console.log("Recipe Element is in stock?:", recEl);
                    temp.push(recEl);
                  }// end if()
                });// end pantry.forEach()
              });// end obj.ingredients.forEach()
              // console.log("Does the recipe count match in pantry?:", temp.length == obj.ingredients.length);
              if (temp.length == obj.ingredients.length) {
                return obj;
              }// end if()
              // res.json(wtf);
            });// end recipeData.filter
            // console.log("Recipes Returned:", wtf);
            res.sendFile(path.join(__dirname, "../public/recipeNow.html"));
          }// end else()
        });// end Recipe.find()
      }// end else()
    });// end Pantry.find()
  });// end app.get('/recipenow')

  app.get('/recipenow/data', isLoggedIn, function(req, res) {

    getNowRecipes(req, res);

  });// end app.get('/recipenow/data')

  app.get("/pantry", function(req, res) {
    
        // Run API Function to pull my Pantry
        getMyPantry(req, res);
      
      });// end app.post('/pantry')






  // Get the recipe page to show the selected page
  app.get('/recipe', isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/recipe.html"));
  });


  // need to add isLoggedIn middleware into app.post('/recipe')
  app.post('/recipe', function (req, res) {
    console.log("Adding Recipe", req.body);
    
    newRecipe = new Recipe();
    newRecipe.author = "me";
    newRecipe.title = req.body.title;
    newRecipe.cuisine = req.body.cuisine;
    newRecipe.image_url = req.body.image_url;
    newRecipe.ingredients = req.body.ingredients;
    newRecipe.instructions = req.body.instructions;

    newRecipe.save(function (err) {
      if (err)
        throw err;
      return (null, newRecipe);
    });// end newRecipe.save()

  });// end app.post('/recipe')  
  
  // ======================================================
  // =====   Logout   =====================================
  // ======================================================

  app.get('/logout', function (req, res) {

    req.logout();
    res.redirect('/');
    
  });// end app.get('/logout')

  // ======================================================
  // =====   Pantry   =====================================
  // ======================================================

  // API Call
  app.get("/pantry", function(req, res) {

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

    // Run API function to add to my Pantry
    removeFromPantry(req, res, ingredientID);

  });// end app.post('/pantry')
};// end module.exports()

// ======================================================
// =====   API Functions   =======================
// ======================================================
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

function changeDBQuantity(old, add){
  var newQty = 0;
  newQty = old + add;
  return newQty;
}// end changeDBQuantity()


function checkIngredientStock (arr, attr, value) {
  for (var i = 0; i < arr. length; i ++) {
    if(arr[i][attr] === value) {
      console.log ("Found: ", value);  
    } else {
      console.log ("Did not find: ", value);
    }
  }
}





















function getMyPantry(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  Pantry.find({"user": req.user.local.username}, function(err, data) {

    // Log any errors if the server encounters one
    if (err) {

      console.log(err);

    }// end if()

    // Otherwise, send the result of this query to the browser
    else {
      data = data.sort();
      console.log("from the db: ", data);
      res.json(data);

    }// end else()

  });// end Pantry.find

}// end getMyPantry()



function getMyPantryData(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  // var myPantry = [];
  Pantry.find({"user": req.user.local.username}, function(err, data) {

    // Log any errors if the server encounters one
    if (err) {

      console.log(err);

    }// end if()

    // Otherwise, send the result of this query to the browser
    else {
      // console.log("Pantry Data:", data);
      // console.log("from the db: ", data);
      return data;
      // console.log("My Pantry has: ", myPantry);

    }// end else()
  });// end Pantry.find
  // return myPantry;
}// end getMyPantry()




function removeFromPantry(req, res, ingredientID) {
  
   Pantry.remove({_id: ingredientID}, function(err, data){
     if (err) throw err;
      res.send(data);
   });

}




function addToPantry(req, res) {
    // console.log("Adding to Pantry", req);
    // console.log("User is: ", req.user.local.username);
    // console.log("Item is: ", req.body.item);
    Pantry.find({ "user": req.user.local.username, "item": req.body.item}, function(err, data) {
      // console.log("Checking if item is already in the Pantry, here is what we data in the database: ", data);
      if(data.length === 0){
        // console.log("new item");

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
        // console.log("Current Item is currently in stock with: ", data[0].quantity);
        var qtyToAdd = parseFloat(req.body.quantity);
        // console.log("qtyToAdd is : ", qtyToAdd);
        var oldQty = parseFloat(data[0].quantity);
        // console.log("oldQty is : ", oldQty);
        // console.log("quantity should be: ", oldQty + qtyToAdd)
        var newQtyToAddToDB = changeDBQuantity(oldQty, qtyToAdd);
        // console.log("The db now has a qty of: ", newQtyToAddToDB);
        
        Pantry.update(
          {item: req.body.item},
            {$set:
              {
                quantity: newQtyToAddToDB
              }
            },// end $set{}
            function(err, data) {
              if(err){
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
  console.log("Did I get here");
  // Grab everything and put them in an array to use to search against
  Pantry.find({"user": req.user.local.username}, function(err, pantryData) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      console.log("getNowRecipes Pantry data", pantryData);
      Recipe.find({}, function(err, recipeData) {
        // Log any errors if the server encounters one
        if (err) {
          console.log(err);
        }// end if()
        // Else, assign data to allRecipes Variable
        else {
          // console.log("Recipe Data: ", recipeData);
          // console.log("Pantry Data again: ", pantryData);

          var wtf = recipeData.filter((obj, val) => {
            // console.log("-----New Recipe-----:", obj.title);
            // console.log("Recipe Ingredient Length:", obj.ingredients.length);
            // console.log("Value is:", val);
            let temp = [];
            obj.ingredients.forEach(recEl => {
              pantryData.forEach(panEl => {
                if (recEl.ingredient == panEl.item) {
                  // console.log("Recipe Element is in stock?:", recEl);
                  temp.push(recEl);
                }// end if()
              });// end pantry.forEach()
            });// end obj.ingredients.forEach()
            // console.log("Does the recipe count match in pantry?:", temp.length == obj.ingredients.length);
            if (temp.length == obj.ingredients.length) {
              return obj;
            }// end if()
          });// end recipeData.filter
          
          console.log("wtf is:", wtf);
          res.json(wtf);
        }// end else()
      });// end Recipe.find()
    }// else()
  });// end Pantry.find()
}// end req, res





function getAllRecipes() {
  Recipe.find({}, function(err, data){
    if (err) {
      console.log(err);
    }
    else {
      console.log("Recipe Results are:", data);
    }
  });// end Recipe.find()
}// end getAllRecipes()




// function getAllRecipesData() {
//   var allRecipes = [];
//   Recipe.find({}, function(err, data){
//     if (err) {
//       console.log(err);
//     }
//     else {
//       // data.forEach(function(recipe){
//         // foo.push(recipe);
//         allRecipes = data;
//       });

//       console.log("Foo Data:", foo);
//       // foo = data;
//       return allRecipes;
//     }
//   });// end Recipe.find()
//   // return allRecipes;
// }// end getAllRecipes()

