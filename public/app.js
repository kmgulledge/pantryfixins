// $(document).on("click", "#addToPantry", function(e) {

$("#pantryForm").on("submit", function(event) {
    event.preventDefaults();
    console.log("New Pantry Form submitted");
});
//     // Grab the id associated with the article from the submit button
//     var thisId = $(this).attr("data-id");
  
//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//       method: "POST",
//       url: "/pantry",
//       data: {
//         user: data.user,
//         item: $("#titleinput").val(),
//         quantity: $("#bodyinput").val()
//       }// end data{}
//     })// end ajax
//       // With that done
//       .done(function(data) {
//         // Log the response
//         console.log(data);
//       });
//     // Also, remove the values entered in the input and textarea for note entry
//     $("#titleinput").val("");
//     $("#bodyinput").val("");
//   });
  