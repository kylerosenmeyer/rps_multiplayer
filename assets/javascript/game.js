//RPS Multiplayer

//Initial Pseudo Code

//Setting the game up
//When player selects "Play Game", ask for a userName. 
//Generate a child with the user name and three boolean properties, rock: paper: scissors: (all set to false)
//Then show the user a list of other user names to play against.
//The user list comes from sorting all nodes in the database in ascending order, displaying the username property value.

//Playing the Game
//After the user selects an opponent, the app will use the unique child keys of each database node to execute the game.
//Once both child keys are known, each user will be displayed with three icons to choose from: rock, paper, or scissors.
//Choosing an icon will update their database node with the appropriate boolean property.
//The app will listen for a "child change" on the two unique keys, and once both are changed,
//it will compare the inputs and display the results to user.

//After the game
//The user will then be shown two buttons: "Play Again" or "Select New Opponent"
//Selecting "Play Again" will reset the booleans for that player and redisplay the icons (if the other player has clicked as well). Game repeats.
//Selecting "Select New Opponet" will move the player back to the inital screen with the opponets list displayed.


var config = {
    apiKey: "AIzaSyBXY5RL7rbaS0achp2tpFw85yN7tcVk9uk",
    authDomain: "rps-multiplayer-b7dae.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-b7dae.firebaseio.com",
    projectId: "rps-multiplayer-b7dae",
    storageBucket: "rps-multiplayer-b7dae.appspot.com",
    messagingSenderId: "856828164304"
  };

  firebase.initializeApp(config);

  var database = firebase.database(),
      userName = "",
      rpsChoice = ""

  //When a user name is entered, create a directory for that user with the property RPS Choice.

  $("#nameInput").keyup( function() {
    
    if ( event.keyCode === 13 ) {

      userName = $("#nameInput").val().trim()
    
      //This is the user Creation
      database.ref("users/" + userName).set({
        userName: userName,
        rpsChoice: rpsChoice
      })

      database.ref("users/").once("value", function(snap) {

        snap.forEach(function(child) {
          var opponent = child.val().userName,
              oppAdd = opponent + "<br>"

          console.log("username: " + opponent)
          $("#opponentList").prepend(oppAdd)

        })
      })

      database.ref("users/" + userName).once("value", function(snap) {

        $("#yourPlayer").prepend(snap.val().userName)

      })
    
            
        
      


    }
  })