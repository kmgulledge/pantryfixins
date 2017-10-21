console.log("||\u274c  Opened File [./config/passport.js]");
console.log("\u26a0 == Find a way to display to user if email/username is already used, email is not found, and if password is wrong (npm flash)")

// ========================================================
// =====   Dependencies   =================================
// ========================================================
var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function (passport) {

  // ======================================================
  // =====   Passport Session Setup   =====================
  // ======================================================
  
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session
  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // ======================================================
  // =====   Local Signup   ===============================
  // ======================================================

  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    function (req, email, password, done) {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email': email }, function (err, user) {
        // if there are any errors, return the error
        if (err)
          return done(err);
        // check to see if theres already a user with that email
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
          // save the user
          newUser.save(function (err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    }));

  // ======================================================
  // =====   Local Login   ================================
  // ======================================================

  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    function (req, email, password, done) { // callback with email and password from our form
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email': email }, function (err, user) {
        // if there are any errors, return the error before anything else
        if (err)
          return done(err);
        // if no user is found, return the message
        if (!user)
          return done(null, false);
        // if the user is found but the password is wrong
        if (!user.validPassword(password))
          return done(null, false);
        // all is well, return successful user
        return done(null, user);
      });

    }));

};
