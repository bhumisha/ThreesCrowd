//Global Variables
var deckID = '';
var playerNameGlobalVar = '';
var gameRounds = 0;

$("#playGame").on("click", playGameMenuItemClick);

//Get the Deck of Card and with its DeckId
function getDeckOfCards(){
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(function(response){
        if (response.ok) {
            response.json()
            .then(function(data){
                //  console.log(data);
                deckID = data.deck_id;
             })
        }
    })
    .catch(function(error){

    })
}
//It is card images clicks and api call for fetch any two cards from selected deck id.
$(document).on("click",".image",function(event){
    event.preventDefault();
    if(deckID!="")
    {
        var selectedIndexEl =  $(this).attr("index");
        if($(this).attr("imageFound")==="false"){
            fetch("https://deckofcardsapi.com/api/deck/"+deckID+"/draw/?count=2")
            .then(function(response){
                if (response.ok) {
                    response.json()
                    .then(function(data){
                        // console.log(data);
                        //Load Card to player and computer panel for selected index..
                        loadCardToPlayerAndComputerPanel(data,selectedIndexEl);
                    })
                }
            })
            .catch(function(error){
            })
        }        
    }
    
})
//This is all global variable , get reset when user click on play game.
function resetAllVariables(){
    gameRounds = 0;
    playerNameGlobalVar = '';
    getDeckOfCards();
}

//Play Menu Button Click
function playGameMenuItemClick(){
    //Reset all global variable.
    resetAllVariables()
    //Get the playerName information.
    $('#playerName-modal').modal('show');
    $('#goModalButtonEl').on("click", storePlayersInfoToLocalStorage);
    generateGameCanvas();
}

//Generate Game canvas will create card panel for both player and computer.
function generateGameCanvas(){
    $("#main").text('');
    //Till Game Rounds 5 Image panel will be there .. else final result.
    if(gameRounds < 5){

        var gameDiv = $("<div>")

        var playerDiv = $("<div>").addClass("playerDiv");
        playerDiv.attr("id","playerDiv");

        var playerDivHeadingEl = $("<h3>").addClass("ui left aligned yellow header");
        playerDivHeadingEl.attr("id","playerDivHeadingEl");
        playerDivHeadingEl.text(playerNameGlobalVar);
        playerDiv.append(playerDivHeadingEl);
        
        var computerDiv = $("<div>").addClass("computerDiv");
        computerDiv.attr("id","computerDiv");
        
        var computerDivHeadingEl = $("<h3>").addClass("ui left aligned yellow header");;
        computerDivHeadingEl.text("Computer");
        computerDiv.append(computerDivHeadingEl)
    
        for(var i=1;i<=5;i++){
            var imgPlayerEl = $("<img>")
            imgPlayerEl.attr("id","P"+i);
            imgPlayerEl.attr("index",i);
            imgPlayerEl.attr("imageFound",false);
            imgPlayerEl.addClass("image");
           

            var imgComputerEl = $("<img>");
            imgComputerEl.attr("id","C"+i);
            imgComputerEl.attr("index",i);
            imgComputerEl.attr("imageFound",false);
            imgComputerEl.addClass("image");
           
            playerDiv.append(imgPlayerEl);
            computerDiv.append(imgComputerEl);
        }
        gameDiv.append(playerDiv);
        gameDiv.append(computerDiv);
        $("#main").append(gameDiv);
    }
    else{//After 5 round , Current players detail will get display

        finalResultAfterGameComplete();
    }
}

// draw api result will load card to player and computer image placeholders.
function loadCardToPlayerAndComputerPanel(data,selectedImageEl){
    if(data){
        var playerClickedImageEl = $("#P"+selectedImageEl);
        playerClickedImageEl.attr("src",data.cards[0].image)
        playerClickedImageEl.attr("imageFound",true);
        playerClickedImageEl.attr("cardCode",data.cards[0].code);
        playerClickedImageEl.attr("cardSuit",data.cards[0].suit);
        playerClickedImageEl.attr("cardValue",data.cards[0].value);
        
        var computerImageEl = $("#C"+selectedImageEl);
        computerImageEl.attr("src",data.cards[1].image);
        computerImageEl.attr("imageFound",true);
        computerImageEl.attr("cardCode",data.cards[1].code);
        computerImageEl.attr("cardSuit",data.cards[1].suit);
        computerImageEl.attr("cardValue",data.cards[1].value);
    }
    

    //Every card , checkWinner will compare card suit and check for winner.
    //Draw between Computer and player.
    if((checkWinner("player") && checkWinner("computer")))
    {
        $(".image").prop("disabled",true);
        loadLooserDiv(playerNameGlobalVar,true,"draw");
        updatePlayersResultToLocalStorage(playerNameGlobalVar,"draw",false);
    }
    //Player Won
    else if(checkWinner("player"))
    {
        $(".image").prop("disabled",true);
        loadWinnerDiv(playerNameGlobalVar);
        updatePlayersResultToLocalStorage(playerNameGlobalVar,"win",true);
    }
    //Computer Won
    else if(checkWinner("computer"))
    {
        $(".image").prop("disabled",true);
        loadLooserDiv(playerNameGlobalVar,false,"loose");
        updatePlayersResultToLocalStorage(playerNameGlobalVar,"loose",false);
    }
    //Stalemate will check for both and none get 3 same suit than its stalemate condition.
    if(checkForStalemate("player","computer"))
    {
        $(".image").prop("disabled",true);
        loadLooserDiv(playerNameGlobalVar,true,"stalemate");
        updatePlayersResultToLocalStorage(playerNameGlobalVar,"stalemate",false);
    }

}


//Check winner get all loaded card and count for same suits. if >=3 than winner and return true.
function checkWinner(checkWinnerFor){
    var imageControls = $( "#"+checkWinnerFor + "Div").find( "[imageFound=true]"  );
    if(imageControls && imageControls.length > 2 ){
            var clubs=0;
            var diamonds=0;
            var hearts=0;
            var spades=0;
            for(var i=0;i<imageControls.length ;i++){
                    var suit = $(imageControls[i]).attr("cardSuit").toLowerCase();
                    if(suit === "clubs"){clubs++;}
                    if(suit === "diamonds"){diamonds++;}
                    if(suit === "hearts"){hearts++;}
                    if(suit === "spades"){spades++;}
            }
            if(clubs >=3 || diamonds >=3 || hearts >=3 || spades>=3 ){
                return true;
            }
            else{
                return false;
            }
    }
}
//Check wether game is draw or stalemate
function checkForStalemate(playerDiv, computerDiv){
    var imageControls = $( "#"+playerDiv + "Div").find( "[imageFound=true]"  );
    var imageComputerControls = $( "#"+computerDiv + "Div").find( "[imageFound=true]"  );
    var isPlayerWon = false;
    var isComputerWon = false;
    //Get all image controls of Player or computer
    if(imageControls && imageControls.length === 5 && imageComputerControls && imageComputerControls.length ===5 ){
            isPlayerWon = checkWinner(playerDiv);
            isComputerWon =  checkWinner(computerDiv);
            
        if(!isPlayerWon && !isComputerWon){
            return true;
        }
        return false;
    }
}


//If user won, Load Winner div with gift gif images.
function loadWinnerDiv(winner){
    $(".result").remove();
    
    var winnerDivEl = $("<div>").addClass("result middle aligned three wide column");
    var winnerName = $("<h3>").addClass("ui yellow header");
    
    var nextRound = $("<button>");
    nextRound.addClass("ui button green");
    if(gameRounds===4){
        nextRound.text("Final Result");
    }else{
        nextRound.text("Next Round");
    }
    
    nextRound.attr("id","nextRoundButtonClick");

    var winImage = $("<img>");
    winImage.attr("src","https://s3.amazonaws.com/course_creation_production/v2_yes_no_quiz_questions/follow_up_images/000/002/084/original/Owl1.gif?1436567941");
    var winImageDiv =$("<div>")
    winnerName.text("Yay! " + winner + "  Won!!")
    winnerDivEl.append(winnerName);
    winImageDiv.append(winImage);
    winnerDivEl.append(nextRound);
    
    winnerDivEl.append(winImageDiv);
    $("#main").append(winnerDivEl);
}

//Load div incase of loose / draw or stalemate status.
function loadLooserDiv(looser,isGameDraw,gameResult){
    $(".result").remove();
    var looserDivEl = $("<div>").addClass("result middle aligned three wide column");
    var looserName = $("<h3>").addClass("ui yellow header");
    var nextRound = $("<button>");
    
    nextRound.addClass("ui button green");
    if(gameRounds===4){
        nextRound.text("Final Result");
    }else{
        nextRound.text("Next Round");
    }
    nextRound.attr("id","nextRoundButtonClick");

    if(isGameDraw){
        if(gameResult.includes("draw"))
         { 
            looserName.text("Its a Draw " + looser + " !!")
         }
         else
         {
            looserName.text("Its stalemate " + looser + " !!")
         }
    }
  
    else{
        looserName.text(looser + "!  Better luck next time!!")
    }
    
    looserDivEl.append(looserName);
    looserDivEl.append(nextRound);
    $("#main").append(looserDivEl);
}

//Next Round Button Click
$(document).on("click","#nextRoundButtonClick",function(event){ 
    gameRounds++;
    generateGameCanvas();
});

//Player information model will take name of player and store to localstorage.
$('.ui.form').submit(function(e){ 
    e.preventDefault(); //usually use this, but below works best here.
    storePlayersInfoToLocalStorage();
});

/***************START LOCALSTORAGE FUNCTIONS **************/
//Store Players information with initial values of game.
function storePlayersInfoToLocalStorage(){
    //Reading form field.
    
        var playerName = $('.ui.form').form('get field', "playerName").val().trim(); 
        if(playerName!=""){
            $('#playerName-modal').modal('hide');
            playerNameGlobalVar = playerName;
            $("#playerDivHeadingEl").text(playerName);
            
            var playersList = JSON.parse(localStorage.getItem("playersList")) || [];
            var isPlayerExist = false;
            for(var i=0;i<playersList.length;i++)
            {
                var playerDetail = playersList[i];
                if(playerName === playerDetail.name){
                    isPlayerExist = true;
                }
            }
            if(!isPlayerExist){
                var player = { name : playerName, 
                               win : 0,
                               loose : 0,
                               game : 0}
                playersList.push(player);
                localStorage.setItem('playersList',JSON.stringify(playersList));
            }
        }
}

//update current player score after each game
function updatePlayersResultToLocalStorage(playerName,gameResult,isWon){
    var playersList = JSON.parse(localStorage.getItem("playersList")) || [];
        
        if(playerName!=""){
            for(var i=0;i<playersList.length;i++)
            {
                var playerDetail = playersList[i];
                if(playerName === playerDetail.name){
                    if(isWon){
                        playerDetail.win++;
                    }
                    else if(gameResult.includes("loose"))
                    {
                        playerDetail.loose++;
                    }
                    playerDetail.game++;
                    playersList[i] = playerDetail;
                }
            }      
            localStorage.setItem('playersList',JSON.stringify(playersList));
        }
       
}
//Final Result panel - Used Cards to show current player details.
function finalResultAfterGameComplete(){
    var finalResultIUICardDiv = $("<div>").addClass("ui cards");
    var scoreboardButtonEl = $("<button>").attr("id","showScoreButton").addClass("ui button green");
    scoreboardButtonEl.text("Players Statisctics");
 
    var cardDivEl =  $("<div>").addClass("card");
    var cardContentDivEl =  $("<div>").addClass("content");
    var cardHeaderDivEl =  $("<div>").addClass("header");
    var cardDescriptionDivEl =  $("<div>").addClass("description");

    var playersList = JSON.parse(localStorage.getItem("playersList")) || [];

    if(playerNameGlobalVar!=""){
            for(var i=0;i<playersList.length;i++)
            {
                var playerDetail = playersList[i];
                if(playerNameGlobalVar === playerDetail.name){
                    cardHeaderDivEl.text(playerNameGlobalVar);
                    cardDescriptionDivEl.html("<p> Total Games : " + playerDetail.game + "</p><p> Total Win : " + playerDetail.win + "</p><p> Total Loose : " + playerDetail.loose + "</p>")   
                    cardContentDivEl.append(cardHeaderDivEl);
                    cardContentDivEl.append(cardDescriptionDivEl)
                    cardDivEl.append(cardContentDivEl);
                    break;
                }
            }
        }
        finalResultIUICardDiv.append(cardDivEl);
      //  $("#main").append(scoreboardButtonEl);
        finalResultIUICardDiv.append(scoreboardButtonEl);
        $("#main").append(finalResultIUICardDiv);
        
}
/***************STOP LOCALSTORAGE FUNCTIONS **************/
$('#gameRules').on("click", function(event) {
    $('#rules-modal').modal('show');
    $('#playGameModal').on("click", ruleButton_Click);
});

//Rule Button Click, if player info is not added than Player popup will get populated after Rule
function ruleButton_Click(){
    if(playerNameGlobalVar===""){
        playGameMenuItemClick();
    }
    else {
        $('#rules-modal').modal('hide');
    }
}

//Show all users statistics data which contain sortable table. Semantic tableSort.js added and modified to sort number value.
$(document).on("click","#showScoreButton",showAllUsersResults);
function showAllUsersResults(){
    $("#main").html('');
    var allPlayersDetailDiv = $('<div>');

    var finalResultIUITable = $("<table>").addClass("ui sortable celled table");
    var playersList = JSON.parse(localStorage.getItem("playersList")) || [];

            var theadEl =  $("<thead>");
            var theadElHtml = "<tr><th>Name</th><th>Total Game Count</th><th>Win count</th><th>Lost Count</th></tr>";
            theadEl.html(theadElHtml);
            var tableBodyEl =  $("<tbody>");
           
            for(var i=0;i<playersList.length;i++)
            {
                var playerDetail = playersList[i];
    
                    var tableRowEl =  $("<tr>");
                    var nameColumnEl =  $("<td>");
                    var totalGameColumnEl =  $("<td>");
                    var totalWinColumnEl =  $("<td>");
                    var totalLostColumnEl =  $("<td>");

                    nameColumnEl.text(playerDetail.name);
                    totalGameColumnEl.text( playerDetail.game);
                    totalWinColumnEl.text(playerDetail.win);
                    totalLostColumnEl.text(playerDetail.loose);

                    tableRowEl.append(nameColumnEl);
                    tableRowEl.append(totalGameColumnEl);
                    tableRowEl.append(totalWinColumnEl);
                    tableRowEl.append(totalLostColumnEl);

                    tableBodyEl.append(tableRowEl);
                
            }
        
            finalResultIUITable.append(theadEl);
            finalResultIUITable.append(tableBodyEl);
      
            allPlayersDetailDiv.append(finalResultIUITable);

            //Bak to game button, so Player need not to enter again their name.
            var backToGameBtnEl = $("<button>").attr("id","backToGame").addClass("ui button green");
            backToGameBtnEl.text("Back To Game");
            allPlayersDetailDiv.append(backToGameBtnEl);

        $("#main").append(allPlayersDetailDiv);
        $("#main").append(allPlayersDetailDiv);
        $('table').tablesort();
}   
//Back to Game, will start from first round and create game canvas.
$(document).on("click","#backToGame",function(event){
    gameRounds=0;
    generateGameCanvas();
});

//Player Info Model form.
$(document).ready(function(){
    $('.ui.form')
    .form({ 
        fields: {
        playerName: {
            identifier: 'playerName',
            rules: 
            [
            {
                type   : 'empty',
                prompt : 'Please enter your name'
            }
            ]
        }
        }
    })
  });


  