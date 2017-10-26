console.log("opened profile.js")
// First thing: ask the back end for json with all animals
$.getJSON("/pantry", function(data) {
    // Call our function to generate a table body
    displayResults(data);
  });

function displayResults(pantry) {
// First, empty the table
$("#pantryTable").empty();

// Then, for each entry of that json...
pantry.forEach(function(item) {
    // Append each of the item's properties to the table
    $("#pantryTable").append("<tr><td>" + item.item + "</td>" +
                        "<td>" + item.quantity + "</td></tr>");
});
}