console.log("||\u274c  Opened File [./app/routes.js]");
console.log("\u26a0 == Finish Converting templage from EJS to Pug and have extend a Main.pug to keep code DRY");

var mongoose = require("mongoose");
var Pantry = require("./models/pantry.js");
var Recipe = require("./models/recipe.js");
var pantries = mongoose.model('Pantry');
var recipes = mongoose.model('Recipe');
var databaseUrl = "pantry";
var collections = ["pantries"];
var mongojs = require("mongojs");
var path = require("path");
var db = mongoose.connection;



var myPantry = [];
var myIngredients = [];
var allRecipes = [];
var nowRecipes = [];




module.exports = function (app, passport) {

  // ======================================================
  // =====   Home Page   ==================================
  // ======================================================
  
  app.get('/', function (req, res) {
    Pantry.find({}, function (err, data){
      // console.log("Test: ", data);
    });
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
    //   console.log("My pantry currently has: ", myPantry);
    // });
    // res.render('profile.pug', {
    //   "user": req.user
    // //   "pantry": myPantry
    // });// end res.render()
    res.sendFile(path.join(__dirname, "../public/user.html"));
  });// end app.get('/profile')






  app.get('/recipenow', isLoggedIn, function(req, res) {
    
    // Grab everything and put them in an array to use to search against
    Pantry.find({"user": req.user.local.username}, function(err, data) {
      // Log any errors if the server encounters one
      if (err) {
        console.log(err);
      }
      // Otherwise, send the result of this query to the browser
      else {
        // myPantry = data;
        console.log("data", data);
        // console.log("In the pantry you have: ", myPantry);
        data.forEach(value => {
          myPantry.push(value);
        });
      }
    });// end Pantry.find()
    
    console.log("New Data: ", myPantry);
    
    Recipe.find({}, function(err, data) {
      // Log any errors if the server encounters one
      if (err) {
        console.log(err);
      }
      // Else, assign data to allRecipes Variable
      else {
        data.forEach(value => {
          console.log("Value: ", value);
        });
        
        //   a.ingredients.forEach(value => {
          
          //     pantry.forEach( el => {
            
            //         if (el.ingredient == value.ingredient ){
              //                 console.log(el)
              //                 temp.push(el)
              //         }
              
              //     })
          
      // })



        allRecipes = data;

      //   // This will compare each ingredient in each recipe to see if this recipe is a viable option
      //   // As soon as one ingredient, is not in stock then the recipe will be removed as an option
      //   // Loop through recipes
      //   for(var i = 0; i < allRecipes.length; i++) {
      //     var recipeValid = true;
          
      //     // console.log(allRecipes[i]);
          
      //     // myPantry.filter(function (ing) {
      //     //   if(ing.item === allRecipes[i].ingredients[j].ingredient) {
      //     //     console.log(ing);
      //     //   }
      //     // });





      //     // // Loop through ingredients
      //     for (var j = 0; j < allRecipes[i].ingredients.length; j++) {

      //       ingCheck = allRecipes[i].ingredients[j].ingredient;
      //       // console.log("Recipe is: ", allRecipes[i]);


      //                                                                 // console.log("each ingredient is: ", allRecipes[i].ingredients[j]);
      //                                                                 // myPantry.filter(function (ing) {
      //                                                                 //   console.log("Current Ing is: ", ing);
      //                                                                 // if ( ing.item === allRecipes[i].ingredients[j].ingredient ) {
      //                                                                 //   if ( ing.quantity <= allRecipes[i].ingredients[j].quantity ) {
      //                                                                 //     console.log( ing.item + " is in stock with " + ing.quantity );
      //                                                                 //   } else {
      //                                                                 //     console.log( ing.item + " is in stock but only has a stock of " + ing.quantity );
      //                                                                 //   }
      //                                                                 // } else {
      //                                                                 //   console.log(ing.item + " is not in stock");
      //                                                                 // }
      //                                                                 // });

      //     // // checkIngredientStock(myPantry, myPantry.item, allRecipes[i].ingredients[j]);
      //     // console.log(ingCheck + " has an index of: ", myPantry.indexOf(ingCheck));
          
      //     if (myPantry.indexOf(allRecipes[i].ingredients[j].ingredient) !== -1) {
      //         console.log (allRecipes[i].ingredients[j].ingredient + " is in stock. Now Check Qty.");
      //       } else {
      //         // console.log("I am searching for: ", allRecipes[i].ingredients[j].ingredient);
      //         console.log (allRecipes[i].ingredients[j].ingredient + " is not in stock. Now Remove recipe.");
      //         recipeValid = false;
      //       }
      //     }
      //   }// end for(i = recipes)

      //   // res.json(data);




      }
    console.log("All Recipes are: ", allRecipes);
    });// end Recipe.find()

    console.log("Recipes: ", allRecipes);



    var returnGood = allRecipes.filter((a,b)=>{
      
      console.log('New Recipe')
      console.log(a.ingredients.length)
      console.log(b);
      let temp = []
      a.ingredients.forEach(value => {
          
          pantry.forEach( el => {

              if (el.ingredient == value.ingredient ){
                      console.log(el)
                      temp.push(el)
              }
             
          })
          
      })
      console.log(temp.length == a.ingredients.length)
       if ( temp.length == a.ingredients.length) {
              return a
       }

  },[])

console.log(returnGood)










});


function checkIngredientStock (arr, attr, value) {
  for (var i = 0; i < arr. length; i ++) {
    if(arr[i][attr] === value) {
      console.log ("Found: ", value);  
    } else {
      console.log ("Did not find: ", value);
    }
  }
}











  // for (var i=0; i< friends.length; i++) {
  //   // Resets totalDifference back to 0
  //   totalDifference = 0;

  //   // Loop through all the scores of each friend
  //   for (var j=0; j< friends[i].scores[j]; j++){

  //     // We calculate the difference between the scores and sum them into the totalDifference
  //     totalDifference += Math.abs(parseInt(userScores[j]) - parseInt(friends[i].scores[j]));

  //     // If the sum of differences is less then the differences of the current "best match"
  //     if (totalDifference <= bestMatch.friendDifference){

  //       // Reset the bestMatch to be the new friend. 
  //       bestMatch.name = friends[i].name;
  //       bestMatch.photo = friends[i].photo;
  //       bestMatch.friendDifference = totalDifference;
  //     }
  //   }
  // }












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
    // Query: In our database, go to the animals collection, then "find" everything
    Pantry.find({"user": req.user.local.username}, function(err, data) {
      // Log any errors if the server encounters one
      if (err) {
        console.log(err);
      }
      // Otherwise, send the result of this query to the browser
      else {
        // console.log("from the db: ", data);
        res.json(data);
      }
    });
  });

  app.post('/pantry', function (req, res) {
    // console.log("Adding to pantry", req);
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
    });// end db.pantries.find()
  });// end app.post('/pantry')
  // });
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
}

function changeDBQuantity(old, add){
  var newQty = 0;
  newQty = old + add;
  return newQty;
}// end changeDBQuantity()





