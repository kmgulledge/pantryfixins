console.log("||\u2713  Opened File [./app/models/recipe.js]");

// load the things we need
var mongoose = require('mongoose');

// define the schema for our Pantry model
var recipeSchema = mongoose.Schema({
    author: String,
    rating: Number,
    intredients: [Schema.Types.Mixed],
    istructions: [String]
});// end stockSchema

recipeSchema.methods.findAll = function(user) {
    Pantry.find({}), function (err, data) {
        console.log("Ran recipe.findAll()");

        if (err) {
            console.log(err);
        }

        if (data) {
            console.log(data);
        }

    };// end Pantry.find()
}

module.exports = mongoose.model('Recipe', recipeSchema);