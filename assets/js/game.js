var deckID = '';
var playerNameGlobalVar = '';
var gameRounds = 0;
getDeckOfCards();
function getDeckOfCards(){
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(function(response){
        if (response.ok) {
            response.json()
            .then(function(data){
                 console.log(data);
                deckID = data.deck_id;
             })
        }
    })
    .catch(function(error){

    })
}


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
                        console.log(data);
                        loadCardToPlayerPanel(data,selectedIndexEl);
                       // loadCardToComputerPanel(data,selectedIndexEl);
                    })
                }
            })
            .catch(function(error){
            })
        }
        else{

        }
        
    }
    
})
function resetAllVariables(){
    gameRounds = 0;
    playerNameGlobalVar = '';
    getDeckOfCards();
}
var play = function(event) {
    resetAllVariables()
    $("#main").text('');
    $('#playerName-modal').modal('show');
    $('#GoModalButtonEl').on("click", savePlayersInfoToLocalStorage);
    generateGameCanvas();
};

$("#playGame").on("click", play);

function generateGameCanvas(){
    $("#main").text('');

    if(gameRounds < 5){

    
    var gameDiv = $("<div>");

    var playerDiv = $("<div>").addClass("playerDiv");
    var playerDivHeadingEl = $("<h4>").addClass("ui yellow header");
    playerDiv.attr("id","playerDiv");
    
    playerDivHeadingEl.attr("id","playerDivHeadingEl");
    playerDivHeadingEl.text(playerNameGlobalVar);
    playerDiv.append(playerDivHeadingEl);
    
    var computerDiv = $("<div>").addClass("computerDiv");
    var computerDivHeadingEl = $("<h4>").addClass("ui yellow header");;
    computerDiv.attr("id","computerDiv");
    computerDivHeadingEl.text("Computer");
    computerDiv.append(computerDivHeadingEl)
   
    for(var i=1;i<=5;i++){
        var imgPlayerEl = $("<img>").addClass("five wide column");
        imgPlayerEl.attr("id","P"+i);
        imgPlayerEl.attr("index",i);
        imgPlayerEl.attr("imageFound",false);
        imgPlayerEl.addClass("image");
        imgPlayerEl.attr("width","180px")
        imgPlayerEl.attr("height","270px")

        var imgComputerEl = $("<img>").addClass("five wide column");
        imgComputerEl.attr("id","C"+i);
        imgComputerEl.attr("index",i);
        imgComputerEl.attr("imageFound",false);
        imgComputerEl.addClass("image");
        imgComputerEl.attr("width","180px")
        imgComputerEl.attr("height","270px")

        playerDiv.append(imgPlayerEl);
        computerDiv.append(imgComputerEl);
    }
    gameDiv.append(playerDiv);
    gameDiv.append(computerDiv);


    $("#main").append(gameDiv);
    }
    else{
        finalResultAfterGameComplete();
    }
}
function savePlayersInfoToLocalStorage(){
    var playersList = JSON.parse(localStorage.getItem("playersList")) || [];
        var playerName = $("#playerName").val().trim();
        playerNameGlobalVar = playerName;
        $("#playerDivHeadingEl").text(playerName);
        var isPlayerExist = false;
        if(playerName!=""){
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
                
               // $("#playerName").val('');
                
            }
        }
}
function loadCardToPlayerPanel(data,selectedImageEl){
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
    
    if((checkWinner("player") && checkWinner("computer")))
    {
        $(".image").prop("disabled",true);
        loadLooserDiv($("#playerDivHeadingEl").text(),true,"draw");
        updatePlayersResultToLocalStorage($("#playerDivHeadingEl").text(),"draw",false);
    }
    else if(checkWinner("player"))
    {
        $(".image").prop("disabled",true);
        loadWinnerDiv($("#playerDivHeadingEl").text());
        updatePlayersResultToLocalStorage($("#playerDivHeadingEl").text(),"win",true);
    }
    else if(checkWinner("computer"))
    {
        $(".image").prop("disabled",true);
        loadLooserDiv($("#playerDivHeadingEl").text(),false,"loose");
        updatePlayersResultToLocalStorage($("#playerDivHeadingEl").text(),"loose",false);
    }
    if(checkForStalemate("player","computer"))
    {
        $(".image").prop("disabled",true);
        loadLooserDiv($("#playerDivHeadingEl").text(),true,"stalemate");
        updatePlayersResultToLocalStorage($("#playerDivHeadingEl").text(),"stalemate",false);
    }

}

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
            //If Player has any card more than 3 than he might be winner
            if(clubs >=3 || diamonds >=3 || hearts >=3 || spades>=3 ){
                isPlayerWon= true;
            }
            else{
                isPlayerWon= false;
            }
            //Computer panel card images
            var clubs=0;
            var diamonds=0;
            var hearts=0;
            var spades=0;
            for(var i=0;i<imageComputerControls.length ;i++){
                var suit = $(imageComputerControls[i]).attr("cardSuit").toLowerCase();
                if(suit === "clubs"){clubs++;}
                if(suit === "diamonds"){diamonds++;}
                if(suit === "hearts"){hearts++;}
                if(suit === "spades"){spades++;}
        }
        //If Computer has any card more than 3 than he might be winner
        if(clubs >=3 || diamonds >=3 || hearts >=3 || spades>=3 ){
            isComputerWon = true;
        }
        else{
            isComputerWon = false;
        }
        if(!isPlayerWon && !isComputerWon){
            return true
        }
        return false;
    }
}
function loadWinnerDiv(winner){
    $(".result").remove();
    
    var winnerDivEl = $("<div>").addClass("result");
    var winnerName = $("<h4>").addClass("ui yellow header");
    
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
    winnerDivEl.append(nextRound);
    winImageDiv.append(winImage);
    winnerDivEl.append(winImageDiv);
    $("#main").append(winnerDivEl);
}

function loadLooserDiv(looser,isGameDraw,gameResult){
    $(".result").remove();
    var looserDivEl = $("<div>").addClass("result");
    var looserName = $("<h4>").addClass("ui yellow header");
    
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
        looserName.text("Awww! " + looser + "  Better luck next time!!")
    }
    
    looserDivEl.append(looserName);
    looserDivEl.append(nextRound);
    $("#main").append(looserDivEl);
}

$(document).on("click","#nextRoundButtonClick",function(event){ 
    gameRounds++;
    generateGameCanvas();
});


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
                
            $("#playerName").val('');
        }
}

$('#gameRules').on("click", function(event) {
    $('#rules-modal').modal('show');
    $('#playGameModal').on("click", ruleButton_Click);
});

function ruleButton_Click(){
    if($("#playerDivHeadingEl").text().trim()===""){
      play();
    }
    else {
        $('#rules-modal').modal('hide');
    }
}

function finalResultAfterGameComplete(){
    var finalResultIUICardDiv = $("<div>").addClass("ui cards");
    var cardDivEl =  $("<div>").addClass("card");
    var cardContentDivEl =  $("<div>").addClass("content");
    var cardHeaderDivEl =  $("<div>").addClass("header");
    var cardDescriptionDivEl =  $("<div>").addClass("description");

    var playersList = JSON.parse(localStorage.getItem("playersList"));

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
        $("#main").append(finalResultIUICardDiv);
}