//*RPS Multiplayer

//*Setting the game up
//When player selects "Play Game", ask for a userName. 
//Generate a child with the user name and three boolean properties, rock: paper: scissors: (all set to false)
//Then show the user a list of other user names to play against.
//The user list comes from sorting all nodes in the database in ascending order, displaying the username property value.

//*Playing the Game
//After the user selects an opponent, the app will use the unique child keys of each database node to execute the game.
//Once both child keys are known, each user will be displayed with three icons to choose from: rock, paper, or scissors.
//Choosing an icon will update their database node with the appropriate boolean property.
//The app will listen for a "child change" on the two unique keys, and once both are changed,
//it will compare the inputs and display the results to user.

//*After the game
//The user will then be shown two buttons: "Play Again" or "Select New Opponent"
//Selecting "Play Again" will reset the booleans for that player and redisplay the icons (if the other player has clicked as well). Game repeats.
//Selecting "Select New Opponet" will move the player back to the inital screen with the opponets list displayed.


//!Firebase Setup
var config = {
    apiKey: "AIzaSyBXY5RL7rbaS0achp2tpFw85yN7tcVk9uk",
    authDomain: "rps-multiplayer-b7dae.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-b7dae.firebaseio.com",
    projectId: "rps-multiplayer-b7dae",
    storageBucket: "rps-multiplayer-b7dae.appspot.com",
    messagingSenderId: "856828164304"
  };

  firebase.initializeApp(config);

//*Initial Variable Setup
  var database = firebase.database(),
      userName = "",
      rpsChoice = "",
      gameCount = 0,
      enemyPlayer = "",
      playerScore = 0,
      enemyScore = 0

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
              oppAdd = "<button class=\"chooseOpponent\" data-name=\"" + opponent + "\">" + opponent + "</button>"

          if ( opponent !== userName) {
            console.log("list of opponents: ", opponent)
            $("#opponentList").prepend(oppAdd)
          }
          

        })
      })

      database.ref("users/" + userName).once("value", function(snap) {

        $("#yourPlayer").prepend(snap.val().userName)

      })
    }
  })



  $("body").on("click", ".chooseOpponent", function() {

    console.log(this)
    enemyPlayer = $(this).attr("data-name")
    console.log("enemyPlayer: ", enemyPlayer)

    $(".chooseOpponent").off()
    playRPS()

  })

  function playRPS() {

    if ( gameCount < 5 ) {
      
      gameCount++

      $("#player1box").prepend("<button class=\"chooseRPS\" data-name=\"Rock\" id=\"rock\"> Rock </button>")
      $("#player1box").prepend("<button class=\"chooseRPS\" data-name=\"Paper\"  id=\"rock\"> Paper </button>")
      $("#player1box").prepend("<button class=\"chooseRPS\" data-name=\"Scissors\"  id=\"rock\"> Scissors </button>")

      $(".chooseRPS").click( function() {

        $(".chooseRPS").off()
        var playerChoice = $(this).attr("data-name")
        console.log("playerChoice: ", playerChoice)
        database.ref("users/" + userName).set({
          userName: userName,
          rpsChoice: playerChoice
        })

        database.ref("users/" + enemyPlayer).once("child_changed", function(snap) {

          if ( snap.val().rpsChoice !== "" ) {
            var enemyChoice = snap.val().rpsChoice
            console.log("enemyChoice: ", enemyChoice)

            if ( ( playerChoice === "Rock" ) && ( enemyChoice === "Paper" ) ) {
              enemyScore++
              console.log("enemyScore: ", enemyScore)
              console.log("playerScore: ", playerScore)
            } else if ( ( playerChoice === "Rock" ) && ( enemyChoice === "Scissors") ) {
              playerScore++
              console.log("enemyScore: ", enemyScore)
              console.log("playerScore: ", playerScore)
            } else if ( ( playerChoice === "Paper" ) && ( enemyChoice === "Rock" ) ) {
              playerScore++
              console.log("enemyScore: ", enemyScore)
              console.log("playerScore: ", playerScore)
            } else if ( ( playerChoice === "Paper" ) && ( enemyChoice === "Scissors") ) {
              enemyScore++
              console.log("enemyScore: ", enemyScore)
              console.log("playerScore: ", playerScore)
            } else if ( ( playerChoice === "Scissors" ) && ( enemyChoice === "Rock" ) ) {
              enemyScore++
              console.log("enemyScore: ", enemyScore)
              console.log("playerScore: ", playerScore)
            } else if ( ( playerChoice === "Scissors" ) && ( enemyChoice === "Paper" ) ) {
              playerScore++
              console.log("enemyScore: ", enemyScore)
              console.log("playerScore: ", playerScore)
            } else if ( playerChoice === enemyChoice ) {
              console.log("Draw!")
              console.log("enemyScore: ", enemyScore)
              console.log("playerScore: ", playerScore)
            }
          }
        })
      })
    }
  }