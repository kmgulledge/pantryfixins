console.log("Opened up recipe.js")

getIngredients();

// Variables that will hold the recipe attributes
var title = document.getElementById("recipeName").value;
var cuisine = document.getElementById("recipeCuisine").value;
var image_url = document.getElementById("recipeImage").value;

// Recipe Object Template
var recipeObject = {
    title: title,
    cuisine: cuisine,
    image_url: image_url,
    ingredients: [],
    instructions: []
};

// Array that will hold all of the ingredients for the recipe
// var ingredientArray = [];


$("#ingredientSubmitBtn").click(function () {
    event.preventDefault();

    // Ingredient Object Template
    var newIngredient = {
        quantity: 0,
        ingredient: ""
    }

    // Get ingredient values and quantities from the HTML page
    var ingredient = document.getElementById("ingredientsForRecipe").value;
    var quantity = document.getElementById("ingredientQuantity").value;
    
    // Set object properties equal to HTML values
    newIngredient.ingredient = ingredient;
    newIngredient.quantity = quantity;

    // Push object into recipe array
    recipeObject.ingredients.push(newIngredient);

    // This appends to the div below so that the user can see what ingredients they've entered. 
    document.getElementById("ingredientsDiv").append(quantity + " " + ingredient + " ");

    // This is resetting the values of the inputs to 0
    document.getElementById("ingredientQuantity").value = "";
    document.getElementById("ingredientsForRecipe").value = "";
    // console.log(recipeObject);
});


$("#instructionsSubmitBtn").click(function () {
    event.preventDefault();
    var instruction = document.getElementById("instructionsInput").value;
    recipeObject.instructions.push(instruction)
    document.getElementById("ingredientsDiv").append(instruction)
    document.getElementById("instructionsInput").value = ""
});

$("#finalizeRecipe").click(function () {
    event.preventDefault();
    console.log(recipeObject);
    // ingredientArray.push(recipeObject);
    // console.log(ingredientArray);

    var uri = "/recipe";
    $.ajax({
        dateType: "json",
        contentType: "application/json",
        method: "POST",
        url: uri,
        data: JSON.stringify(recipeObject),
        success: function (result) {
            // alert(result);
        },
        error: function () {
            alert("fuck");
        }
    });
});

var title = document.getElementById("recipeName").value;
var cuisine = document.getElementById("recipeCuisine").value;
var image_url = document.getElementById("recipeImage").value;

// Recipe Object Template
var recipeObject = {
  // title: "",
  // cuisine: "",
  // image_url: "",
  ingredients: [],
  instructions: []
};

var ingredientArray = [];


$("#ingredientSubmitBtn").click(function () {
  event.preventDefault();
  var newIngredient = {
    quantity: 0,
    ingredient: ""
  }
  // var title = document.getElementById("recipeName").value;
  // var cuisine = document.getElementById("recipeCuisine").value;
  // var image_url = document.getElementById("recipeImage").value;
  var ingredient = document.getElementById("ingredientsForRecipe").value;
  newIngredient.ingredient = ingredient;
  var quantity = document.getElementById("ingredientQuantity").value;
  newIngredient.quantity = quantity;

  recipeObject.ingredients.push(newIngredient);

  // This appends to the div below so that the user can see what ingredients they've entered. 
  document.getElementById("ingredientsDiv").append(quantity + " " + ingredient + " ");

  // This is resetting the values of the inputs to 0
  document.getElementById("ingredientQuantity").value = "";
  document.getElementById("ingredientsForRecipe").value = "";
  console.log(recipeObject);
});


$("#instructionSubmitBtn").click(function () {
  event.preventDefault();
  var instruction = document.getElementById("instructionInput").value;
  recipeObject.instructions.push(instruction)
  document.getElementById("ingredientsDiv").append(instruction)
  document.getElementById("instructionInput").value = "";
});

$("#finalizeRecipe").click(function () {
  event.preventDefault();

  var title = document.getElementById("recipeName").value;
  var cuisine = document.getElementById("recipeCuisine").value;
  var image_url = document.getElementById("recipeImage").value;

  recipeObject.title = title;
  recipeObject.cuisine = cuisine;
  recipeObject.image_url = image_url;
  console.log(recipeObject);
  ingredientArray.push(recipeObject);
  console.log(ingredientArray);


  var uri = "/recipe";
  $.ajax({
    dateType: "json",
    contentType: "application/json",
    method: "POST",
    url: uri,
    data: JSON.stringify(recipeObject),
    success: function (result) {
      // alert(result);
    },
    error: function () {
      alert("fuck");
    }
  })
});




$(function () {
  $("#tags").autocomplete({
    source: availableTags
  });
});







var availableTags = [];

function getIngredients() {
  console.log("Starting getIngredients");
  $.ajax({
    async: true,
    url: 'data/ingredients.json',
    data: "",
    accepts: 'application/json',
    dataType: 'json',
    success: function (data) {
      console.log("getIngredients was a success");
      try{
        for (var i = 0; i < data.length; i++) {
          availableTags.push(data[i].ingredient);
          // address.push( data[i].address );
          // city.push( data[i].city );
        }
      } catch (err) {}
      console.log("inner tags:", availableTags);
    }
  });
}

// getIngredients();

$(function () {

  // console.log("tags:", availableTags);
  getIngredients();

  $("#ingredientsDD").autocomplete({
    source: availableTags
  });
});
