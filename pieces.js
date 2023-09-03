class ChessPiece {
    constructor(name, color, position) {
        this.name = name;
        this.color = color;
        this.position = position;
    }

    #notation = {
        'pawn': 'p',
        'rook': 'r',
        'knight': 'n',
        'bishop': 'b',
        'queen': 'q',
        'king': 'k',
    };

    display () {
        return this.color == 'white' ? this.#notation[this.name.toLowerCase()] : this.#notation[this.name.toLowerCase()].toUpperCase();
    }

    // create a method to destroy the instance class
    destroy () {
        this.name = 'Empty';
        this.color = 'none';
        this.position = 'none';
    }
}

class Pawn extends ChessPiece {
    constructor(color, position) {
        super("Pawn", color, position);
    }

    initialColumn = this.color == 'white' ? 1 : 6;

    allowMove(tablero, target) {
        let targetColumn = tablero.transformNotationToPosition(target)[0];
        let targetRow = tablero.transformNotationToPosition(target)[1];
        console.log(targetColumn, targetRow);
        let actualColumn = tablero.transformNotationToPosition(this.position)[0];
        let actualRow = tablero.transformNotationToPosition(this.position)[1];

        console.log(actualColumn, actualRow, targetColumn, targetRow)
        if (actualRow == -1 || actualColumn == -1 || targetColumn == -1 || targetRow == -1) {
            console.log('Invalid position');
            return false;
        }
        
        if (this.initialColumn == actualColumn && targetColumn - actualColumn > 2) {
            console.log('Initial move may not be greater than 2')
            return false;
        }
        if (this.initialColumn != actualColumn && targetColumn - actualColumn > 1) {
            console.log('After move may not be greater than 2')
            return false;
        }

        if (tablero.findPiece(target)) {
            if (tablero.findPiece(target).color == this.color) return false;
            const piece = tablero.findPiece(target);
            let pieceColumn = tablero.transformNotationToPosition(piece.position)[0];
            let pieceRow = tablero.transformNotationToPosition(piece.position)[1];
            if (pieceColumn - actualColumn != 1) return false;
            if (Math.abs(pieceRow - actualRow) != 1) return false;
        } else {
            if (targetRow - actualRow != 0) {
                console.log('Row must not change if there is no piece in the target position')
                return false;
            }
        }
        return true;
    }
}

class Rook extends ChessPiece {
    constructor(color, position) {
        super("Rook", color, position);
    }
}

class Knight extends ChessPiece {
    constructor(color, position) {
        super("Knight", color, position);
    }
}

class Bishop extends ChessPiece {
    constructor(color, position) {
        super("Bishop", color, position);
    }
}

class Queen extends ChessPiece {
    constructor(color, position) {
        super("Queen", color, position);
    }
}

class King extends ChessPiece {
    constructor(color, position) {
        super("King", color, position);
    }
}

class Empty extends ChessPiece {
    constructor(color, position) {
        super("Empty", color, position);
    }
}

module.exports = {
    Pawn,
    Rook,
    Knight,
    Bishop,
    Queen,
    King,
    Empty
}