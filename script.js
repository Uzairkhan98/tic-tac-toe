[...document.getElementsByClassName("editImage")].forEach(e => {
    e.addEventListener("click", event => {
        let index = event.target.getAttribute('data-index')
        document.getElementById(`player${index}`).focus();
    })
});

let players = (name, symbol) => {
    let _marks = [0,0,0,0,0,0,0,0,0]
    let _name = name
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
    const resetWins = () => {
        _wins = 0
    }
    const getWins = () => _wins;
    const addWins = () => _wins++

    const addMark = (opponent, position) => {
        if((!opponent.getMarks()[position]) && (!_marks[position])){
            _marks[position] = 1
            for(let i = 0 ; i < 3 ; i ++){
                if(_marks[2-i] && (2 - i) == position)
                    _winningSequence[0]++
                if(_marks[5-i] && (5-i) == position)
                    _winningSequence[1]++
                if(_marks[8-i] && (8-i) == position)
                    _winningSequence[2]++
                if(_marks[(3*i)] && (3*i) == position)
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

    const setName = (name = _name) => {
        return _name = name
    }

    return {getName,getMarks, addMark, getSymbol, resetMarks, getWins, checkWin, setName, resetWins, addWins}
}

let player1 = players('Player 1', 'x')
let player2 = players('Player 2', 'circle')

let displayController = (function(){
    let _gameState = 0
    let _currentPlayer = player1
    let _opponentPlayer = player2

    const getGameState = () => _gameState;
    const getCurrentPlayer = () => _currentPlayer;
    const getOpponentPlayer = () => _opponentPlayer;

    const _resetGame = (header, gameButton, nameField, editImage) => {
        document.getElementById('playAgainButton').setAttribute('style', 'visibility:hidden')
        console.log('enetering here 2')

        header.innerText = "Click on the start button to continue"
        gameButton.innerText = "Start Game"
        nameField.forEach(
            e => {
                e.removeAttribute('disabled');
                e.setAttribute('enabled', 'enabled')
            }
        )
        editImage.forEach(e => e.setAttribute('style', 'visibility:visible'))
        gameBoard.resetBoard()
        player1.resetWins()
        player2.resetWins()
    }

    const _startGame = (header, gameButton, nameField, editImage) => {
        document.getElementById('playAgainButton').setAttribute('style', 'visibility:hidden')
        gameBoard.resetBoard()
        console.log('enetering here')
        nameField.forEach(
            e =>  {
                e.removeAttribute('enabled');
                e.setAttribute('disabled', 'disabled')
            }
        )
        nameField[0].value.length > 2 ? player1.setName(nameField[0].value) : player1.setName()
        nameField[1].value.length > 2 ? player2.setName(nameField[1].value) : player2.setName()
        header.innerText = `${player1.getWins()} - ${player2.getWins()}`
        
        gameButton.innerText = "Reset Game"
        document.getElementById("board").classList.add('x')
        
        editImage.forEach(e => e.setAttribute('style', 'visibility:hidden'))
    }

    const _finishGame = (header, nameField, editImage) => {
        
        nameField[0].value.length > 2 ? player1.setName(nameField[0].value) : player1.setName()
        nameField[1].value.length > 2 ? player2.setName(nameField[1].value) : player2.setName()
        header.innerText = `${player1.getWins()} - ${player2.getWins()}`
        nameField.forEach(
            e => {
                e.removeAttribute('disabled');
                e.setAttribute('enabled', 'enabled')
            }
        )
        editImage.forEach(
            e => e.setAttribute('style', 'visibility:visible')
        )
    }

    const changeState = (reset) => {
        console.log('reset:', reset,'gamestate:', _gameState)
        let header = document.getElementById('header')
        let gameButton = document.getElementById('gameButton')
        let nameField = document.querySelectorAll('textarea');
        let editImage = document.querySelectorAll('.editImage')

        if(reset == 0)
           _resetGame(header, gameButton, nameField, editImage)
        else if((_gameState == 0 || _gameState == 2) && reset == 1)
            _startGame(header, gameButton, nameField, editImage)
        else if(_gameState == 1 && reset == 2)
            _finishGame(header, nameField, editImage)
        
        _gameState = reset

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
        if((displayController.getGameState() == 1) && displayController.getCurrentPlayer().addMark(displayController.getOpponentPlayer(),i)){
            e.classList.add(displayController.getCurrentPlayer().getSymbol())
            if(displayController.getCurrentPlayer().checkWin() >= 0){
                document.getElementById('congratulations').innerText = `Congratulations ${displayController.getCurrentPlayer().getName()}`
                document.getElementById('congratsMessage').setAttribute('style', 'visibility: visible');
                setTimeout(() => {document.getElementById('congratsMessage').setAttribute('style', 'visibility: hidden')}, 2000)
                displayController.getCurrentPlayer().addWins()
                gameBoard.setWinningSequence(displayController.getCurrentPlayer().checkWin())
                document.getElementById('playAgainButton').setAttribute('style', 'visibility:visible')
                displayController.changeState(2);
            }
            else{
                displayController.changeplayer()
                let emptyCell = [] 
                document.querySelectorAll('.cell').forEach(cell => {if(cell.classList.length == 1) emptyCell.push(cell)})
                if(emptyCell.length < 1){
                    document.getElementById('congratulations').innerText = `The game is a Draw`
                    document.getElementById('congratsMessage').setAttribute('style', 'visibility: visible');
                    setTimeout(() => {document.getElementById('congratsMessage').setAttribute('style', 'visibility: hidden')}, 2000)
                    document.getElementById('playAgainButton').setAttribute('style', 'visibility:visible')
                    displayController.changeState(2);
                }
            }
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
        document.querySelectorAll('#line').forEach(e => e.className='')
    }
    const setWinningSequence = pattern => {
        const sequences = {
            0: [[0,1,2],'linex'],
            1: [[3,4,5],'linex'],
            2: [[6,7,8],'linex'],
            3: [[0,3,6],'liney'],
            4: [[1,4,7],'liney'],
            5: [[2,5,8],'liney'],
            6: [[0,4,8],'linexy'],
            7: [[2,4,6],'lineyx'],
        }
        let board = document.querySelectorAll('#line')
        sequences[pattern][0].map(
            e => board[e].className = sequences[pattern][1]
        )
        document.querySelectorAll('.cell').forEach(cell => cell.classList.add('active'))

    }
    return{
        changeBoard,
        resetBoard,
        setWinningSequence
    }
})()

function changeGameState(reset){
    if(displayController.getGameState() == 0 && reset == 0)
        displayController.changeState(1)
    else if (reset ==0)
        displayController.changeState(0)
    else
        displayController.changeState(reset)
}




