console.log("||\u2713  Opened File [./app/models/recipe.js]");

// load the things we need
var mongoose = require('mongoose');

// define the schema for our Pantry model
var recipeSchema = mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: false
    },
    image_url: {
        type: String,
        required: true,
        default: "https://placehold.it/250x250"
    },
    rating: {
        type: Number,
        required: false,
        default: 0
    },
    ingredients: {
        type: [{}],
        required: true
    },
    instructions: {
        type: [{}],
        required: true
    }
});// end pantrySchema

recipeSchema.methods.findAll = function (user) {
    Recipe.find({}), function (err, data) {
        console.log("Ran recipe.findAll()");

        if (err) {
            console.log(err);
        }

        if (data) {
            console.log(data);
        }

    };// end Pantry.find()
}// end recipeSchema.methods.findAll()

// =================================================== have function only search for recipes that you have all ingredients in stock
recipeSchema.methods.findInStock = function (user) {
    Recipe.find({}), function (err, data) {
        console.log("Ran recipe.findInStock()");

        if (err) {
            console.log(err);
        }

        if (data) {
            console.log(data);
        }

    };// end Pantry.find()
}// end recipeSchema.methods.findInStock()

module.exports = mongoose.model('Recipe', recipeSchema);