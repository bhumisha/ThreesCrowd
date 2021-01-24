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
        debugger;
        var selectedImageEl = $(this);
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

$("#playGame").on("click",function(event){
    event.preventDefault();
    var gameDiv = $("<div>");
    var playerDiv = $("<div>").addClass("playerDiv");
    var computerDiv = $("<div>").addClass("computerDiv");
    computerDiv.attr("id","computerDiv");

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
})



function loadCardToPlayerPanel(data,selectedImageEl){
    if(data){
        debugger;  
        var playerClickedImageEl = $("#P"+selectedImageEl);
        playerClickedImageEl.attr("src",data.cards[0].image)
        playerClickedImageEl.attr("imageFound",true);
    }

}

function loadCardToComputerPanel(data,selectedImageEl){
    if(data){
        debugger;
        var computerDiv = $("#computerDiv");    
        var computerImageEl = $("#C"+selectedImageEl);
        computerImageEl.attr("src",data.cards[1].image);
        computerImageEl.attr("imageFound",true);
    }

}

function storeResultToLocalStorage(){

}

function loadResultFromLocalStorage(){
    
}