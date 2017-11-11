console.log("opened recipeNow.js");

// Dependencies

var path = window.location.pathname;
var pathArr = path.split('/');
var recipeID = pathArr[2];

// console.log("Recipe ID is :", recipeID);

// getRecipe();

// console.log(data);

// function injectDataOnView() {

//     console.log(data);
//     // var recipe = !{ JSON.stringify(recipe) }; // <====
//     // var divElement = document.getElementById('recipe');
//     // divElement.innerHTML = recipe[1]['id']; // <=== just a test, so no for loop
// }

// injectDataOnView();


// $.ajax({
//     url: "/api/recipe/" + recipeID,
//     type: "get",
//     dataType: 'jsonp',
//     crossDomain: true,

//     success: function (data) {
//         console.log(data)
//         var json2javascript = $.parseJSON(data);  
//     },

//     error: function (XMLHttpRequest, textStatus, errorThrown) {
//         console.log("danger Will Robinson!!");
//     }
// });