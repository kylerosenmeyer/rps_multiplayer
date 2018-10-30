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
    enemyScore = 0,
    playerChoice = "",
    enemyChoice = "",
    playerReady = false,
    enemyReady = false

//When a user name is entered, create a directory for that user with the property RPS Choice.

$("#nameInput").keyup( function() {
  
  if ( event.keyCode === 13 ) {

    userName = $("#nameInput").val().trim()
  
    //This is the user Creation
    database.ref("users/" + userName).set({
      userName: userName,
      rpsChoice: rpsChoice,
      playerReady: playerReady
    })

    database.ref("users/" + userName).once("value", function(snap) {

      $("#yourPlayer").prepend(snap.val().userName)
      var refreshBtn = "<button class=\"refresh\">Refresh List</button>"
      $("#opponentList").prepend(refreshBtn)

    })

    getOpponents()
  }
})

$("body").on("click", ".refresh", function() {
  getOpponents()
})

function getOpponents() {

  $(".chooseOpponent").detach()
  
  database.ref("users/").once("value", function(snap) {

    snap.forEach(function(child) {
      
      var opponent = child.val().userName,
          oppAdd = "<button class=\"chooseOpponent\" data-name=\"" + opponent + "\">" + opponent + "</button>"

      if ( opponent !== userName) {
        console.log("list of opponents: ", opponent)
        $("#opponentList").append(oppAdd)
      }
    })
  })
}



$("body").on("click", ".chooseOpponent", function() {

  enemyPlayer = $(this).attr("data-name")
  console.log("enemyPlayer: ", enemyPlayer)

  $(".chooseOpponent").off()

  $("#player1box").prepend("<button class=\"chooseRPS\" data-name=\"Rock\" id=\"rock\"> Rock </button>")
  $("#player1box").prepend("<button class=\"chooseRPS\" data-name=\"Paper\"  id=\"rock\"> Paper </button>")
  $("#player1box").prepend("<button class=\"chooseRPS\" data-name=\"Scissors\"  id=\"rock\"> Scissors </button>")
  $("#player2box").prepend("<button class=\"playRPS\" data-name=\"Submit\"  id=\"submitRPS\"> Submit Your Choice </button>")
  $("#player2box").prepend("<button class=\"playRPS\" data-name=\"Play\"  id=\"play\"> Play! </button>")

  playRPS()

})

function resetChoice() {
  database.ref("users/" + userName).update({
    rpsChoice: "",
    playerReady: false

  })

  playerChoice = ""
  playerReady = ""
  console.log("player reset complete")
  console.log("ready for next round")
}

function gameLogic() {
  
  console.log("Round: " + gameCount)
  console.log("enemyWeapon: ", enemyChoice)
  console.log("playerWeapon: ", playerChoice)

  if ( ( playerChoice === "Rock" ) && ( enemyChoice === "Paper" ) ) {
    enemyScore++
    console.log("enemyScore: ", enemyScore)
    console.log("playerScore: ", playerScore)
    resetChoice()
    $("#notification").text(enemyPlayer + "\'s Paper beats " + userName + "\'s Rock!")
    $("#gameScore").html(userName + "\'s Score: " + playerScore + "<br>" + enemyPlayer + "\'s Score: " + enemyScore)
  } else if ( ( playerChoice === "Rock" ) && ( enemyChoice === "Scissors") ) {
    playerScore++
    console.log("enemyScore: ", enemyScore)
    console.log("playerScore: ", playerScore)
    resetChoice()
    $("#notification").text(userName + "\'s Rock beats " + enemyPlayer + "\'s Scissors!")
    $("#gameScore").html(userName + "\'s Score: " + playerScore + "<br>" + enemyPlayer + "\'s Score: " + enemyScore)
  } else if ( ( playerChoice === "Paper" ) && ( enemyChoice === "Rock" ) ) {
    playerScore++
    console.log("enemyScore: ", enemyScore)
    console.log("playerScore: ", playerScore)
    resetChoice()
    $("#notification").text(userName + "\'s Paper beats " + enemyPlayer + "\'s Rock!")
    $("#gameScore").html(userName + "\'s Score: " + playerScore + "<br>" + enemyPlayer + "\'s Score: " + enemyScore)
  } else if ( ( playerChoice === "Paper" ) && ( enemyChoice === "Scissors") ) {
    enemyScore++
    console.log("enemyScore: ", enemyScore)
    console.log("playerScore: ", playerScore)
    resetChoice()
    $("#notification").text(enemyPlayer + "\'s Scissors beats " + userName + "\'s Paper!")
    $("#gameScore").html(userName + "\'s Score: " + playerScore + "<br>" + enemyPlayer + "\'s Score: " + enemyScore)
  } else if ( ( playerChoice === "Scissors" ) && ( enemyChoice === "Rock" ) ) {
    enemyScore++
    console.log("enemyScore: ", enemyScore)
    console.log("playerScore: ", playerScore)
    resetChoice()
    $("#notification").text(enemyPlayer + "\'s Rock beats " + userName + "\'s Scissors!")
    $("#gameScore").html(userName + "\'s Score: " + playerScore + "<br>" + enemyPlayer + "\'s Score: " + enemyScore)
  } else if ( ( playerChoice === "Scissors" ) && ( enemyChoice === "Paper" ) ) {
    playerScore++
    console.log("enemyScore: ", enemyScore)
    console.log("playerScore: ", playerScore)
    resetChoice()
    $("#notification").text(userName + "\'s Scissors beats " + enemyPlayer + "\'s Paper!")
    $("#gameScore").html(userName + "\'s Score: " + playerScore + "<br>" + enemyPlayer + "\'s Score: " + enemyScore)
  } else if ( playerChoice === enemyChoice ) {
    console.log("Draw!")
    console.log("enemyScore: ", enemyScore)
    console.log("playerScore: ", playerScore)
    $("#notification").text(userName + "\'s " + playerChoice + " matches " + enemyPlayer + "\'s " + enemyChoice + "!")
    $("#gameScore").html(userName + "\'s Score: " + playerScore + "<br>" + enemyPlayer + "\'s Score: " + enemyScore)
    resetChoice()
  } else {
    console.log("houston it didn't work right")
    resetChoice()
    $("#gameScore").html(userName + "\'s Score: " + playerScore + "<br>" + enemyPlayer + "\'s Score: " + enemyScore)
  }
}
  
function playRPS() {

  console.log("lets play!")
    
  $(".chooseRPS").click( function() {

    playerChoice = $(this).attr("data-name")
    console.log("playerChoice: ", playerChoice)
    database.ref("users/" + userName).update({
      rpsChoice: playerChoice
    })
  })
}

$("body").on("click", "#submitRPS", function() {

  database.ref("users/" + userName).once("value", function(snap) {

    var playerCheck = snap.val().playerReady
    console.log("playerCheck: ", playerCheck)

    if ( ( playerCheck == false ) && ( playerChoice !== "" ) ) {

      database.ref("users/" + userName).update({
        playerReady: true
      })
    }
  }).then( function() {

    database.ref("users/" + userName).once("value", function(snap) {

      playerReady = snap.val().playerReady
      console.log("playerReady? ", playerReady)
  
    })
  })
})

$("body").on("click", "#play", function() {

  database.ref("users/" + enemyPlayer).once("value", function(snap) {

    enemyReady = snap.val().playerReady
    enemyChoice = snap.val().rpsChoice
    console.log("enemyReady? ", enemyReady)
    console.log("enemychoiceGrab: ", enemyChoice)
  }).then( function() {

    if ( gameCount < 6 ) {

      console.log("run player condition: ")
      console.log("playcheck playerChoice: ", playerChoice)
      console.log("playcheck enemyChoice: ", enemyChoice)
      console.log("playcheck playerReady: ", playerReady)
      console.log("playcheck enemyReady: ", enemyReady)
  
    
      if ( ( playerReady == true ) && ( enemyReady == true ) ) {
  
        gameCount++
        gameLogic()
  
      } else if ( ( playerReady == false ) && ( enemyReady == true ) ) {
        console.log("game not ready")
        $("#notification").text(enemyPlayer + " is waiting on you to select Rock, Paper, or Scissors.")
      } else if ( ( enemyReady == false ) && ( playerReady == true ) ) {
        console.log("game not ready")
        $("#notification").text("Waiting on " + enemyPlayer + ".")
      } else {
        console.log("game not ready")
        $("#notification").text("Select Rock, Paper, or Scissors.")
      }
      
    } else {
      console.log("game over!")
    }
  })
})

  









