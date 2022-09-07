[...document.getElementsByClassName("editImage")].forEach(e => {
    e.addEventListener("click", event => {
        let index = event.target.getAttribute('data-index')
        document.getElementById(`player${index}`).focus();
    })
});

let players = (name, symbol) => {
    let _marks = [0,0,0,0,0,0,0,0,0]
    const _name = name
    const _symbol = symbol
    const _wins = 0

    const getName = () => _name;
    const getMarks = () => _marks;
    const getSymbol = () => _symbol;
    const resetMarks = () => _marks = [0,0,0,0,0,0,0,0,0];
    const getWins = () => _wins;

    const addMark = (opponent, position) => {
        if(!opponent.getMarks()[position]){
            _marks[position] = 1
            return true
        }
        else{
            console.log(_marks, opponent.getMarks()[position])
            console.log('Something already exists here!')
            return false
        }
    }
    return {getName,getMarks, addMark, getSymbol, resetMarks, getWins}
}

let player1 = players('Player 1', 'x')
let player2 = players('Player 2', 'circle')

let displayController = (function(){
    let _gameState = false
    let _currentPlayer = player1
    let _opponentPlayer = player2

    const getGameState = () => _gameState;
    const getCurrentPlayer = () => _currentPlayer;
    const getOpponentPlayer = () => _opponentPlayer;

    const changeState = () => {
        _gameState = !_gameState
        let header = document.getElementById('header')
        let gameButton = document.getElementById('gameButton')
        if(_gameState){
            header.innerText = `${player1.getWins()} - ${player2.getWins()}`
            gameButton.innerText = "Reset Game"
            document.getElementById("board").classList.add('x')
        }
        else{
            header.innerText = "Click on the start button to continue"
            gameButton.innerText = "Start Game"
            gameBoard.resetBoard()
        }
    }

    const changeplayer = () => {
        [_currentPlayer, _opponentPlayer] = [_opponentPlayer , _currentPlayer] 
        
        let board = document.getElementById("board")
        if(board.classList[1] == 'circle'){
            board.classList.remove('circle')
            board.classList.add('x')
        }
        else{
            board.classList.remove('x')
            board.classList.add('circle')
        }
    }
    return {
        changeState,
        getGameState,
        getCurrentPlayer,
        changeplayer,
        getOpponentPlayer
    }
})();


[...document.getElementsByClassName("cell")].forEach((e,i) => {
    e.addEventListener("click", () => {
        if(displayController.getGameState() && displayController.getCurrentPlayer().addMark(displayController.getOpponentPlayer(),i)){
            e.classList.add(displayController.getCurrentPlayer().getSymbol())
            displayController.changeplayer()
        }
    })
});

const gameBoard = (function() {
    let _board = [0,0,0,0,0,0,0,0,0]
    const changeBoard = (position, mark) => {
        _board[position] = mark
        let board = document.querySelectorAll('.cell')
        board[position].classList.add(mark)
    }
    const resetBoard = () => {
        _board = [0,0,0,0,0,0,0,0,0] 
        let board = document.querySelectorAll('.cell')
        board.forEach(cell => cell.className = 'cell')
        player1.resetMarks()
        player2.resetMarks()
        document.getElementById('board').className = 'board'
    }
    return{
        changeBoard,
        resetBoard
    }
})()

function changeGameState(){
    displayController.changeState()
}




