var deckID = '';
getDeckOfCards();
function getDeckOfCards(){
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(function(response){
        if (response.ok) {
            response.json();
        }
    }).then(function(data){
        console.log(data);
        deckID = data.deck_id;
    })
    .catch(function(error){

    })
}


$(document).on("click",".img",function(event){
    event.preventDefault();
    if(deckID!="")
    {
        fetch("https://deckofcardsapi.com/api/deck/"+deckID+"/draw/?count=2")
        .then(function(response){
            if (response.ok) {
                response.json();
            }
        }).then(function(data){
            console.log(data);
            loadCardToPlayerPanel();
            loadCardToComputerPanel()
        })
        .catch(function(error){
        })
    }
    
})

function loadCardToPlayerPanel(){

}

function loadCardToComputerPanel(){


}

function storeResultToLocalStorage(){

}

function loadResultFromLocalStorage(){
    
}