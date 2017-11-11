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
        console.log("item:", item);
        console.log("idx:", idx);
        $("#recipeNowDiv").append("<div class='recipeDiv'><img id='makeRecipe' src="+ item.image_url + " alt=" + item.title + "><div id='itemTitle'><a href=#>" + item.title + "</a></div></div>");
    });
}


$(function () {
    console.log("should run init");
    init();
});