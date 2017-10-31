console.log("opened profile.js")
// First thing: ask the back end for json with all animals
$.getJSON("/pantry", function (data) {
  // console.log(data);
  // Call our function to generate a table body
  displayResults(data);
});



var instructions = ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5", "Step 6", "Step 7"];
var count = 0;
var completed = false;

/*
  readNextInstruction will first check to see if the instructions of therecipe has been completed.
  
  If they have not been completed then the voice will read out your next instruction and then 
  increase count by one. It will then run the function to check and see if the instructions are 
  yet complete.
  
  If the instructions are completed, the voice will prompt the user that they are done and to 
  enjoy eating the food that they have prepared.
*/
function readNextInstruction() {
  if (!completed) {

    responsiveVoice.speak(instructions[count]);
    count += 1;
    checkIfInstructionsCompleted();

  } else {

    responsiveVoice.speak("I am finished giving you instructions. Just enjoy eating your meal.");

  }
}// end readNextInstruction()


/*

*/
function readSameInstruction() {

  if (count < 1) {

    responsiveVoice.speak("You have not started the instructions yet. Please read the first instruction first.");
  
  } else {
  
    count -= 1;
    responsiveVoice.speak(instructions[count]);
    count += 1;

  }
}// end readSameInstruction()


function readPreviousInstruction() {
  
  if (count < 1) {
  
    responsiveVoice.speak("You have not started the instructions yet. Please read the first instruction first.");
  
  } else if (count < 2) {
  
    responsiveVoice.speak("You are still on the first instruction. There is not a previous instruction");
  
  } else {
  
    count -= 2;
    responsiveVoice.speak(instructions[count]);
    count += 1;
    
  }
}// end readPreviousInstruction()

function checkIfInstructionsCompleted() {
  if (count < instructions.length) {
    console.log("Still not done");
  } else {
    completed = true;
  }
}

// Reset the count to 0 so that the instructions will start back from the beginning
function restartInstructions() {
  count = 0;
  readNextInstruction();
}// end restartInstructions()

function displayResults(pantry) {
  // First, empty the table
  $("#pantryTable").empty();

  pantry.forEach(function (item) {
    // Append each of the item's properties to the table
    // $("#pantryTable").append("<tr><td>" + item.item + "</td>" +
    //   "<td>" + item.quantity + "</td></tr>");

    $("#pantryDiv").append("<ul style='list-style: none;'><li><input id='item1' type='checkbox'></input><label for='item1'></label>" + item.item + "</li></ul>")
    $("#pantryDiv").append("<div class='column small-6'><h6 class='text-center'>" + 'Unit(s)' + "</h6> <div class='input-group input-number-group'> <div class='input-group-button'><span class='input-number-decrement'>-</span></div><input class='input-number' type='number' value='1' min='0' max='1000'><div class='input-group-button'><span class='input-number-increment'>+</span></div></div></div>");

  });
}