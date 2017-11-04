console.log("||\u274c  Opened File [./app/routes.js]");
console.log("\u26a0 == Finish Converting templage from EJS to Pug and have extend a Main.pug to keep code DRY");

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



var myPantry = [];
// var myIngredients = [];
var allRecipes = [];
// var nowRecipes = [];




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
    //   console.log("My Pantry currently has: ", myPantry);
    // });
    // res.render('profile.pug', {
    //   "user": req.user
    // //   "Pantry": myPantry
    // });// end res.render()
    res.sendFile(path.join(__dirname, "../public/user.html"));
  });// end app.get('/profile')













// function findMyPantry() {



// }// end findMyPantry()









Pantry.find({}), function(err, recipeArr) {

  var ingredientCheck = recipeArr.filter((obj, val)=>{
      
      console.log('New Recipe')
      console.log(obj.ingredients.length)
      console.log(val);
      let tempArray = []
      obj.ingredients.forEach(value => {
          
          pantry.forEach( pantryEl => {
  
              if (pantryEl.ingredient == value.ingredient ){
                      console.log(pantryEl)
                      tempArray.push(pantryEl)
              }
             
          })
          
      })
      console.log(tempArray.length == obj.ingredients.length)
       if ( tempArray.length == obj.ingredients.length) {
              return obj
       }
  
  }, [])
  
  console.log(ingredientCheck)
}


  //    r.forEach((element)=>{
  //         console.log('new reciepie')
  
  
  
  
  //        element.ingredients.forEach((data)=>{
  //             console.log(data.ingredient)
  //             console.log(data.quantity)
              
  //        })
  //     })
  
  
  // }

  

























  app.get('/recipenow', isLoggedIn, function(req, res) {
    
    // gather Information needed to check what recipes we can make
    var pantry = getMyPantryData(req, res);
    var recipes = getAllRecipesData();

    console.log("Pantry:", myPantry);
    console.log("Recipe:", allRecipes);

    // var wtf = recipes.filter((obj, val) => {

    //   console.log("-----New Recipe-----");
    //   console.log("Recipe Ingredient Length:", obj.ingredients.length);
    //   console.log("Value is:", val);
    //   let temp = [];

    //   obj.ingredients.forEach(recEl => {

    //     pantry.forEach(panEl => {

    //       if (recEl.ingredient == panEl.item) {
    //         console.log("Recipe Element is in stock?:", recEl);
    //         temp.push(recEl);
    //       }// end if()

    //     })// end pantry.forEach()

    //   })// end obj.ingredients.forEach()

    //   console.log("Does the recipe count match in pantry?:", temp.length == obj.ingredients.length);
    //   if (temp.length == obj.ingredients.length) {
    //     return obj;
    //   }// end if()


    // }, []);// end wtf()
  
    // console.log("Recipes Returned:", wtf);

  });// end app.get('/recipenow')

  





















  
  //   // Grab everything and put them in an array to use to search against
  //   Pantry.find({"user": req.user.local.username}, function(err, data) {
  //     // Log any errors if the server encounters one
  //     if (err) {
  //       console.log(err);
  //     }
  //     // Otherwise, send the result of this query to the browser
  //     else {
  //       // myPantry = data;
  //       // console.log("data", data);
  //       // console.log("In the Pantry you have: ", myPantry);
  //       data.forEach(value => {
  //         myPantry.push(value);
  //             Recipe.find({}, function(err, data) {
  //               // Log any errors if the server encounters one
  //               if (err) {
  //                 console.log(err);
  //               }
  //               // Else, assign data to allRecipes Variable
  //               else {
          
  //                 data.forEach(value => {
          
  //                   // console.log("Value: ", value);
          
  //                 });
          
  //                 allRecipes = data;
          
  //               }
          
  //             // console.log("All Recipes are: ", allRecipes);
          
  //             });// end Recipe.find()
          
  //             // console.log("All Pantries are: ", myPantry);
          
          
          
  //             var ingredientCheck = allRecipes.filter((a,b)=>{
                
  //               console.log('New Recipe')
  //               console.log("a.ingredients.length ", a.ingredients.length)
  //               console.log("b: ", b);
  //               let temp = []
  //               a.ingredients.forEach(value => {
                    
  //                   value.forEach( el => {
          
  //                       if (el.ingredient == value.ingredient ){
  //                               console.log("el: ", el)
  //                               temp.push(el)
  //                       }
                       
  //                   })
                    
  //               })
  //               // console.log(temp.length == a.ingredients.length)
  //                if ( temp.length == a.ingredients.length) {
  //                       return a
  //                }
  //           }, [])// end allRecipes.filter()
  //           // console.log("ingredientCheck: ", ingredientCheck)
  //         });// end data.forEach()
  //       };// end else()
  //     });// end Pantry.find()
  //   });// end app.get()



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


// app.post('/pantry/delete', function (req, res) {
//   var ingredientID = req.body.id;


//  Pantry.remove({_id: ingredientID}, function(err, results){
//    if(err) throw err;
//     res.send(results);
//  });
  
// });


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

      // console.log("from the db: ", data);
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
      console.log("Pantry Data:", data);
      // console.log("from the db: ", data);
      myPantry = data;
      console.log("My Pantry has: ", myPantry);

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









function getAllRecipes() {
  Recipe.find({}, function(err, data){
    if (err) {
      console.log(err);
    }
    else {
      console.log("Recipe Results are:", data);
    }
  })// end Recipe.find()
}// end getAllRecipes()






function getAllRecipesData() {
  // var allRecipes = [];
  Recipe.find({}, function(err, data){
    if (err) {
      console.log(err);
    }
    else {
      console.log("Recipe Data:", data);
      allRecipes = data;
    }
  })// end Recipe.find()
  // return allRecipes;
}// end getAllRecipes()



