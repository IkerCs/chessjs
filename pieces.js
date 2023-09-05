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
        let actualColumn = tablero.transformNotationToPosition(this.position)[0];
        let actualRow = tablero.transformNotationToPosition(this.position)[1];

        if (actualRow == -1 || actualColumn == -1 || targetColumn == -1 || targetRow == -1) return false;

        if (this.color == 'white') {
            if (targetColumn == actualColumn) return false;
            if (targetColumn - actualColumn <= 0) return false;
            if (actualColumn == this.initialColumn && targetColumn - actualColumn > 2) return false;
            if (actualColumn != this.initialColumn && targetColumn - actualColumn > 1) return false;

            if (Math.abs(targetRow - actualRow) > 1) return false;
            
            if (Math.abs(targetRow - actualRow) == 1) {
                if (!tablero.findPiece(target)) return false;
            } else {
                if (tablero.findPiece(target)) return false;
            }

            if (actualColumn == this.initialColumn && targetColumn - actualColumn == 2) {
                if (tablero.findPiece([actualColumn + 1, actualRow])) return false;
            }
        } else {
            if (targetColumn == actualColumn) return false;
            if (targetColumn - actualColumn >= 0) return false;
            if (actualColumn == this.initialColumn && targetColumn - actualColumn < -2) return false;
            if (actualColumn != this.initialColumn && targetColumn - actualColumn < -1) return false;
            if (Math.abs(targetRow - actualRow) > 1) return false;
            if (Math.abs(targetRow - actualRow) == 1) {
                if (!tablero.findPiece(target)) return false;
            } else {
                if (tablero.findPiece(target)) return false;
            }

            if (actualColumn == this.initialColumn && targetColumn - actualColumn == -2) {
                if (tablero.findPiece([actualColumn - 1, actualRow])) return false;
            }
        }
        return true;
    }
}

class Rook extends ChessPiece {
    constructor(color, position) {
        super("Rook", color, position);
    }

    allowMove (tablero, target) {
        let targetColumn = tablero.transformNotationToPosition(target)[0];
        let targetRow = tablero.transformNotationToPosition(target)[1];
        let actualColumn = tablero.transformNotationToPosition(this.position)[0];
        let actualRow = tablero.transformNotationToPosition(this.position)[1];

        if (actualRow == -1 || actualColumn == -1 || targetColumn == -1 || targetRow == -1) return false;

        if (actualRow == targetRow && actualColumn != targetColumn) {
            for (let i = actualColumn + 1; i < targetColumn; i++) {
                if (tablero.findPiece([i, actualRow])) return false;
            }
        }
        else if (actualRow != targetRow && actualColumn == targetColumn) {
            for (let i = actualRow + 1; i < targetRow; i++) {
                if (tablero.findPiece([actualColumn, i])) return false;
            }
        }
        else return false;
        return true;
    }
}

class Knight extends ChessPiece {
    constructor(color, position) {
        super("Knight", color, position);
    }

    allowMove (tablero, target) {
        let targetColumn = tablero.transformNotationToPosition(target)[0];
        let targetRow = tablero.transformNotationToPosition(target)[1];
        let actualColumn = tablero.transformNotationToPosition(this.position)[0];
        let actualRow = tablero.transformNotationToPosition(this.position)[1];

        if (actualRow == -1 || actualColumn == -1 || targetColumn == -1 || targetRow == -1) return false;

        if (Math.abs(targetColumn - actualColumn) == 2 && Math.abs(targetRow - actualRow) == 1) {
            return true;
        } else if (Math.abs(targetColumn - actualColumn) == 1 && Math.abs(targetRow - actualRow) == 2) {
            return true;
        } else {
            return false;
        }
    }
}

class Bishop extends ChessPiece {
    constructor(color, position) {
        super("Bishop", color, position);
    }

    allowMove (tablero, target) {
        let targetColumn = tablero.transformNotationToPosition(target)[0];
        let targetRow = tablero.transformNotationToPosition(target)[1];
        let actualColumn = tablero.transformNotationToPosition(this.position)[0];
        let actualRow = tablero.transformNotationToPosition(this.position)[1];

        if (actualRow == -1 || actualColumn == -1 || targetColumn == -1 || targetRow == -1) return false;

        if (Math.abs(targetColumn - actualColumn) != Math.abs(targetRow - actualRow)) return false;

        let i = actualColumn + 1;
        let j = actualRow + 1;
        while (i < targetColumn && j < targetRow) {
            if (tablero.findPiece([i, j])) return false;
            i++;
            j++;
        }

        i = actualColumn - 1;
        j = actualRow - 1;
        while (i > targetColumn && j > targetRow) {
            if (tablero.findPiece([i, j])) return false;
            i--;
            j--;
        }

        i = actualColumn - 1;
        j = actualRow + 1;
        while (i > targetColumn && j < targetRow) {
            if (tablero.findPiece([i, j])) return false;
            i--;
            j++;
        }

        i = actualColumn + 1;
        j = actualRow - 1;
        while (i < targetColumn && j > targetRow) {
            if (tablero.findPiece([i, j])) return false;
            i++;
            j--;
        }

        return true;
    }
}

class Queen extends ChessPiece {
    constructor(color, position) {
        super("Queen", color, position);
    }

    allowMove (tablero, target) {
        let targetColumn = tablero.transformNotationToPosition(target)[0];
        let targetRow = tablero.transformNotationToPosition(target)[1];
        let actualColumn = tablero.transformNotationToPosition(this.position)[0];
        let actualRow = tablero.transformNotationToPosition(this.position)[1];

        if (actualRow == -1 || actualColumn == -1 || targetColumn == -1 || targetRow == -1) return false;

        if (Math.abs(targetColumn - actualColumn) == Math.abs(targetRow - actualRow)) {
            let i = actualColumn + 1;
            let j = actualRow + 1;
            while (i < targetColumn && j < targetRow) {
                if (tablero.findPiece([i, j])) return false;
                i++;
                j++;
            }

            i = actualColumn - 1;
            j = actualRow - 1;
            while (i > targetColumn && j > targetRow) {
                if (tablero.findPiece([i, j])) return false;
                i--;
                j--;
            }

            i = actualColumn - 1;
            j = actualRow + 1;
            while (i > targetColumn && j < targetRow) {
                if (tablero.findPiece([i, j])) return false;
                i--;
                j++;
            }

            i = actualColumn + 1;
            j = actualRow - 1;
            while (i < targetColumn && j > targetRow) {
                if (tablero.findPiece([i, j])) return false;
                i++;
                j--;
            }
        } else if (actualRow == targetRow && actualColumn != targetColumn) {
            for (let i = actualColumn + 1; i < targetColumn; i++) {
                if (tablero.findPiece([i, actualRow])) return false;
            }
        }
        else if (actualRow != targetRow && actualColumn == targetColumn) {
            for (let i = actualRow + 1; i < targetRow; i++) {
                if (tablero.findPiece([actualColumn, i])) return false;
            }
        }
        else return false;

        return true;
    }
}

class King extends ChessPiece {
    constructor(color, position) {
        super("King", color, position);
    }

    allowMove (tablero, target) {
        let targetColumn = tablero.transformNotationToPosition(target)[0];
        let targetRow = tablero.transformNotationToPosition(target)[1];
        let actualColumn = tablero.transformNotationToPosition(this.position)[0];
        let actualRow = tablero.transformNotationToPosition(this.position)[1];

        if (actualRow == -1 || actualColumn == -1 || targetColumn == -1 || targetRow == -1) return false;

        if (Math.abs(targetColumn - actualColumn) > 1) return false;
        if (Math.abs(targetRow - actualRow) > 1) return false;

        return true;
    }
}

class Empty extends ChessPiece {
    constructor(color, position) {
        super("Empty", color, position);
    }
}  

module.exports = { ChessPiece, Pawn, Rook, Knight, Bishop, Queen, King, Empty };
