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
        $("#recipeNowDiv").append("<a href='/recipe/" + item._id + "'><div class='recipeDiv'><img src="+ item.image_url + " alt=" + item.title + "><div>" + item.title + "</div></div></a>");
    });
}

$(function () {
    console.log("should run init");
    init();
});