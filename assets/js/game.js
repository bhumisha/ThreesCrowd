var deckID = '';
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
                        loadCardToComputerPanel(data,selectedIndexEl);
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

var play = function(event) {
    $("#main").text('');
    $('#playerName-modal').modal('show');
    $('#GoModalButtonEl').on("click", savePlayersInfoToLocalStorage);
    event.preventDefault();
    var gameDiv = $("<div>");

    var playerDiv = $("<div>").addClass("playerDiv");
    var playerDivHeadingEl = $("<h4>").addClass("ui yellow header");
    playerDiv.attr("id","playerDiv");
    
    playerDivHeadingEl.attr("id","playerDivHeadingEl");
    playerDiv.append(playerDivHeadingEl);

    var computerDiv = $("<div>").addClass("computerDiv");
    var computerDivHeadingEl = $("<h4>").addClass("ui yellow header");;
    computerDiv.attr("id","computerDiv");
    computerDivHeadingEl.text("Computer");
    computerDiv.append(computerDivHeadingEl)
   
    for(var i=1;i<=5;i++){
        var imgPlayerEl = $("<img>");
        imgPlayerEl.attr("id","P"+i);
        imgPlayerEl.attr("index",i);
        imgPlayerEl.attr("imageFound",false);
        imgPlayerEl.addClass("image");
        imgPlayerEl.attr("width","200px")
        imgPlayerEl.attr("height","300px")

        var imgComputerEl = $("<img>");
        imgComputerEl.attr("id","C"+i);
        imgComputerEl.attr("index",i);
        imgComputerEl.attr("imageFound",false);
        imgComputerEl.addClass("image");
        imgComputerEl.attr("width","200px")
        imgComputerEl.attr("height","300px")

        playerDiv.append(imgPlayerEl);
        computerDiv.append(imgComputerEl);
    }
    gameDiv.append(playerDiv);
    gameDiv.append(computerDiv);

    $("#main").append(gameDiv).addClass("gameDiv");
};

$("#playGame").on("click", play);


function savePlayersInfoToLocalStorage(){
    debugger;
    var playersList = JSON.parse(localStorage.getItem("playersList")) || [];
        var playerName = $("#playerName").val().trim();
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
                               game : 1}
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
        
    }
    if(checkWinner("player")){
        loadWinnerDiv($("#playerDivHeadingEl").text());
        updatePlayersResultToLocalStorage($("#playerDivHeadingEl").text());
    }

}

function loadCardToComputerPanel(data,selectedImageEl){
    if(data){
  
        var computerImageEl = $("#C"+selectedImageEl);
        computerImageEl.attr("src",data.cards[1].image);
        computerImageEl.attr("imageFound",true);
        computerImageEl.attr("cardCode",data.cards[1].code);
        computerImageEl.attr("cardSuit",data.cards[1].suit);
        computerImageEl.attr("cardValue",data.cards[1].value);
             
    }
    if(checkWinner("computer")){
        loadWinnerDiv("computer")
    }

}

function checkWinner(checkWinnerFor){
    
}
function loadWinnerDiv(winner){
    
}

function updatePlayersResultToLocalStorage(winnerName){
    debugger;
    var playersList = JSON.parse(localStorage.getItem("playersList")) || [];
        
        if(winnerName!=""){
            for(var i=0;i<playersList.length;i++)
            {
                var playerDetail = playersList[i];
                if(winnerName === playerDetail.name){
                    playerDetail.win++;
                    playerDetail.game++;
                    playerDetail.loose = playerDetail.game - playerDetail.win;
                    playersList[i] = playerDetail;
                }
            }      
            localStorage.setItem('playersList',JSON.stringify(playersList));
                
            $("#playerName").val('');
        }
}

function loadResultFromLocalStorage(){
    
}
$('#gameRules').on("click", function(event) {
    $('#rules-modal').modal('show');
    $('#playGameModal').on("click", play);
});





