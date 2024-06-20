/**
 * FACTORY FUNCTIONS
*/

// Player factory
const Player = (marker) => {
    const getMarker = () => marker;
    return { getMarker };
};

/**
 * MODULES
*/

// Module: Gameboard
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const setCell = (index, player) => {
        if (index >= 0 && index < board.length && board[index] === "") {
            board[index] = player.getMarker();
            return true;
        }
        return false;
    };

    const getBoard = () => [...board];

    const reset = () => {
        board.fill("");
    };

    const isBoardFull = () => {
        return board.every(cell => cell !== "");
    };

    return { setCell, getBoard, reset, isBoardFull };
})();

// Module: GameControl
const GameControl = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let currentPlayer = playerX;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === playerX ? playerO : playerX;
    };

    const makeMove = (cellIndex) => {
        if (Gameboard.setCell(cellIndex, currentPlayer)) {
            DisplayController.updateBoard();
            if (checkGameOver(currentPlayer)) {
                alert(`Player ${currentPlayer.getMarker()} wins!`);
                Gameboard.reset();
                DisplayController.updateBoard();
            } else if (Gameboard.isBoardFull()) {
                alert("It's a tie!");
                Gameboard.reset();
                DisplayController.updateBoard();
            } else {
                switchPlayer();
            }
        }
    };

    const checkGameOver = (player) => {
        const board = Gameboard.getBoard();
        const marker = player.getMarker();
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winConditions.some(condition =>
            condition.every(index => board[index] === marker));
    };

    return { makeMove };
})();

// Module: DisplayController
const DisplayController = (() => {
    const boardElement = document.getElementById("board");

    const updateBoard = () => {
        const board = Gameboard.getBoard();
        boardElement.innerHTML = "";
        board.forEach((cell, index) => {
            boardElement.innerHTML += `<div class="cell border-2 rounded-lg border-gray-700 h-20 w-20 flex items-center justify-center text-2xl cursor-pointer" onclick="GameControl.makeMove(${index})">${cell}</div>`;
        });
    };

    return { updateBoard };
})();

/**
 * LISTENERS
*/

document.addEventListener('DOMContentLoaded', () => {
    DisplayController.updateBoard();
});
