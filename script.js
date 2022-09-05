[...document.getElementsByClassName("editImage")].forEach(e => {
    e.addEventListener("click", event => {
        let index = event.target.getAttribute('data-index')
        document.getElementById(`player${index}`).focus();
    })
});

let displayController = (function(){
    let _gameState = false
    function changeState(){
        _gameState = !_gameState
        console.log(_gameState)
        let header = document.getElementById('header')
        let gameButton = document.getElementById('gameButton')
        if(_gameState){
            header.setAttribute('style', 'visibility:hidden')
            gameButton.innerText = "Reset Game"
        }
        else{
            header.setAttribute('style', 'visibility:visible')
            gameButton.innerText = "Start Game"
        }
    }
    return {
        changeState
    }
})()

function changeGameState(){
    displayController.changeState()
}

