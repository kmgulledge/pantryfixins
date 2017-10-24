console.log("||\u2713  Opened File [./app/models/stock.js]");

// load the things we need
var mongoose = require('mongoose');

// define the schema for our Pantry model
var pantrySchema = mongoose.Schema({
    user: String,
    item: String,
    quantity: Number
});// end stockSchema

pantrySchema.methods.findAll = function(user) {
    Pantry.find({ "user": user }), function (err, data) {
        console.log("Ran findAll()");

        if (err) {
            console.log(err);
        }

        if (data) {
            console.log(data);
        }

    };// end Pantry.find()
}

module.exports = mongoose.model('Pantry', pantrySchema);