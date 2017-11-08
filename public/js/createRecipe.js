
var title = document.getElementById("recipeName").value;
// var cuisine = document.getElementById("recipeCuisine").value;
var image_url = document.getElementById("recipeImage").value;

// Recipe Object Template
var recipeObject = {
    title: "",
    // cuisine: "",
    image_url: "",
    ingredients: [],
    instructions: []
};

var ingredientArray = [];

$("#infoSubmitBtn").click(function () {
    event.preventDefault();
    var title = document.getElementById("recipeName").value;
    // var cuisine = document.getElementById("recipeCuisine").value;
    var image_url = document.getElementById("recipeImage").value;

    recipeObject.title = title;
    // recipeObject.cuisine = cuisine;
    recipeObject.image_url = image_url;

    $("#recipeTitle").append("<h2><em>" + title + "</em></h2>");
    $("#recipePic").append("<img src='" + image_url + "'>");
    // document.getElementById("recipeName").value = "";
    // document.getElementById("recipeImage").value = "";
});

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
    document.getElementById("recipeName").append(title);
    $("#ingredientsDiv").append("<li> <strong>" + quantity + "</strong>" + " " + " " + ingredient + "</li>");

    // This is resetting the values of the inputs to 0
    document.getElementById("ingredientQuantity").value = "";
    document.getElementById("ingredientsForRecipe").value = "";
    console.log(recipeObject);
});


$("#instructionSubmitBtn").click(function () {
    event.preventDefault();
    var instruction = document.getElementById("instructionInput").value;
    recipeObject.instructions.push(instruction)
    $("#instructions").append("<li>" + instruction + "</li>")
    document.getElementById("instructionInput").value = "";
});

$("#finalizeRecipe").click(function () {
    event.preventDefault();

    var title = document.getElementById("recipeName").value;
    // var cuisine = document.getElementById("recipeCuisine").value;
    var image_url = document.getElementById("recipeImage").value;

    // recipeObject.title = title;
    // recipeObject.cuisine = cuisine;
    // recipeObject.image_url = image_url;
    // console.log(recipeObject);
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
            // alert("fuck");
        }
    })
}); 