console.log("opened recipeNow.js");

function init() {
    console.log("Init running");
    $.getJSON("/recipenow/data", function (data) {
        console.log("The new data is:", data);
        // Call our function to generate a table body
        displayRecipes(data);
    });// end getJSON()
}// end init()



function displayRecipes(recipe) {
    // First, empty the table
    $("#recipeNowDiv").empty();

    recipe.forEach(function (item, idx) {
        $("#recipeNowDiv").append("<div>Recipe</div>");
    });
}


$(function () {
    console.log("should run init");
    init();
});