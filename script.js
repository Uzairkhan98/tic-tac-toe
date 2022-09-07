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
    let _wins = 0
    let _winningSequence = [0,0,0,0,0,0,0,0]

    const getName = () => _name;
    const getMarks = () => _marks;
    const getSymbol = () => _symbol;
    const resetMarks = () => {
        _marks = [0,0,0,0,0,0,0,0,0]
        _winningSequence = [0,0,0,0,0,0,0,0]
    };
    const getWins = () => _wins;

    const addMark = (opponent, position) => {
        if(!opponent.getMarks()[position]){
            _marks[position] = 1
            for(let i = 0 ; i < 3 ; i ++){
                if(_marks[2-i] && (2 - i) == position)
                    _winningSequence[0]++
                if(_marks[5-i] && (5-i) == position)
                    _winningSequence[1]++
                if(_marks[8-i] && (8-i) == position)
                    _winningSequence[2]++
                if(_marks[(3*i)] && (3*1) == position)
                    _winningSequence[3]++
                if(_marks[(3*i)+1] && ((3*i)+1) == position)
                    _winningSequence[4]++
                if(_marks[(3*i)+2] && ((3*i)+2) == position)
                    _winningSequence[5]++
                if(_marks[(4*i)] && (4*i) == position)
                    _winningSequence[6]++
                if(_marks[(2*(i+1))] && (2*(i+1)) == position)
                    _winningSequence[7]++
            }

            return true
        }
        else{
            console.log(_marks, opponent.getMarks()[position])
            console.log('Something already exists here!')
            return false
        }
    }

    const checkWin = () => {
        
        return _winningSequence.findIndex(element => element > 2)
    }

    return {getName,getMarks, addMark, getSymbol, resetMarks, getWins, checkWin}
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
        board.className = `board ${_currentPlayer.getSymbol()}`
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
            console.log(displayController.getCurrentPlayer().checkWin(), displayController.getCurrentPlayer().getName())
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
        if(displayController.getCurrentPlayer().getSymbol() == 'circle')
            displayController.changeplayer()
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




