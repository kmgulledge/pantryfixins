console.log("||\u274c  Opened File [./app/routes.js]");
console.log("\u26a0 == Finish Converting templage from EJS to Pug and have extend a Main.pug to keep code DRY");

var Pantry = require("./models/pantry.js");
var databaseUrl = "pantry";
var collections = ["pantries"];
var mongojs = require("mongojs");
var path = require("path");

var db = mongojs(databaseUrl, collections);

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
    res.render('profile.pug', {
      "user": req.user
    //   "pantry": myPantry
    });// end res.render()
  });// end app.get('/profile')

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
    db.pantries.find({"user": req.user.local.username}, function(error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log(error);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }
    });
  });

  app.post('/pantry', function (req, res) {
    // console.log("adding to pantry", req)
    newItem = new Pantry();
    newItem.user = req.user.local.username;
    newItem.item = req.body.item;
    newItem.quantity = req.body.quantity;

    newItem.save(function (err) {
      if (err)
        throw err;
      return (null, newItem);
    });

  });// end app.get('/pantry')
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
