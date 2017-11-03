console.log("||\u274c  Opened File [./app/routes.js]");
console.log("\u26a0 == Finish Converting templage from EJS to Pug and have extend a Main.pug to keep code DRY");

var mongoose = require("mongoose");
var Pantry = require("./models/pantry.js");
var Recipe = require("./models/recipe.js");
var pantries = mongoose.model('Pantry');
var databaseUrl = "pantry";
var collections = ["pantries"];
var mongojs = require("mongojs");
var path = require("path");
var db = mongoose.connection;

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
    failureRedirect: '/login' // redirect back to the signup page if there is an error
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
    failureRedirect: '/signup' // redirect back to the signup page if there is an error
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
    //     console.log("error", err);
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



















// Get the recipe page to show the selected page
  app.get('/recipe', isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/recipe.html"));
  });

  app.post('/recipe', isLoggedIn, function (req, res) {
    console.log("Adding Recipe", req.body);
    
    var newRecipe = new Recipe();
    newRecipe.author = req.user.local.username;
    newRecipe.ingredients = req.body.ingredients;
    newRecipe.instructions = req.body.instructions;

    newRecipe.save(function (err) {
      if (err)
        throw err;
      return (null, newRecipe);
    });// end newRecipe.save()

  });// end app.post('/recipe')
  // });
  // });

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
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
    Pantry.find({"user": req.user.local.username}, function(error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log(error);
      }
      // Otherwise, send the result of this query to the browser
      else {
        // console.log("from the db: ", found);
        res.json(found);
      }
    });
  });

  app.post('/pantry/delete', function (req, res) {
    var ingredientID = req.body.id;

  
   Pantry.remove({_id: ingredientID}, function(err, results){
     if(err) throw err;
      res.send(results);
   });
    
  });
  app.post('/pantry', function (req, res) {
    // console.log("Adding to pantry", req);
    // console.log("User is: ", req.user.local.username);
    // console.log("Item is: ", req.body.item);
    Pantry.find({ "user": req.user.local.username, "item": req.body.item}, function(err, data) {
      // console.log("Checking if item is already in the Pantry, here is what we found in the database: ", data);
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
