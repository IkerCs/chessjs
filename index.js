const { Pawn, Rook, Knight, Bishop, Queen, King } = require('./pieces.js');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

class Tablero {
    constructor() {}
    white = [
        new Pawn('white', 'a2'),
        new Pawn('white', 'b2'),
        new Pawn('white', 'c2'),
        new Pawn('white', 'd2'),
        new Pawn('white', 'e2'),
        new Pawn('white', 'f2'),
        new Pawn('white', 'g2'),
        new Pawn('white', 'h2'),
        new Rook('white', 'a1'),
        new Knight('white', 'b1'),
        new Bishop('white', 'c1'),
        new Queen('white', 'd1'),
        new King('white', 'e1'),
        new Bishop('white', 'f1'),
        new Knight('white', 'g1'),
        new Rook('white', 'h1')
    ];
    black = [
        new Pawn('black', 'a7'),
        new Pawn('black', 'b7'),
        new Pawn('black', 'c7'),
        new Pawn('black', 'd7'),
        new Pawn('black', 'e7'),
        new Pawn('black', 'f7'),
        new Pawn('black', 'g7'),
        new Pawn('black', 'h7'),
        new Rook('black', 'a8'),
        new Knight('black', 'b8'),
        new Bishop('black', 'c8'),
        new Queen('black', 'd8'),
        new King('black', 'e8'),
        new Bishop('black', 'f8'),
        new Knight('black', 'g8'),
        new Rook('black', 'h8')
    ];
    turn = 'white';

    #coordinates = {
        '0': 'a',
        '1': 'b',
        '2': 'c',
        '3': 'd',
        '4': 'e',
        '5': 'f',
        '6': 'g',
        '7': 'h',
    }

    render () {
        let table = [];
        for (let rows = 0; rows < 8; rows++) {
            table.push([]);
            for (let columns = 0; columns < 8; columns++) {
                const piece = this.findPiece(`${this.#coordinates[columns]}${rows + 1}`);
                table[rows].push(piece?.display() || ' ');
            }
        }

        console.table(table.reverse());
    }

    findPiece (location) {
        if (typeof location != 'string') location = this.transformPositionToNotation(location);
        return this.white.concat(this.black).find(piece => piece?.position == location);
    }

    destroyPiece (location) {
        const piece = this.findPiece(location);
        if (!piece) return false;
        piece.destroy();
    }

    movePiece(initial, target) {
        if (!this.moveAllowed(initial, target)) return false;
        const piece = this.findPiece(initial);
        if (!piece) return false;
        
        if (this.findPiece(target)) {
            this.destroyPiece(target);
        }

        piece.position = target;
        if (this.checkForCheck(piece.color)) {
            piece.position = initial;
            return false;
        }

        this.changeTurn();
        return true;
    }

    checkForCheck (color) {
        if (color == 'white') {
            const king = this.white.find((piece) => piece.name == 'King');
            const enemyPieces = this.black;
            for (const piece of enemyPieces) {
                if (piece.allowMove(this, king.position)) {
                    console.log('CHECK');
                    return true;
                }
            }
        } else {
            const king = this.black.find((piece) => piece.name == 'King');
            const enemyPieces = this.white;
            for (const piece of enemyPieces) {
                if (piece.allowMove(this, king.position)) {
                    console.log('CHECK');
                    return true;
                }
            }
        }
        return false;
    }

    changeTurn () {
        this.turn = this.turn == 'white' ? 'black' : 'white';
    }

    moveAllowed(initial, target) {
        const piece = this.findPiece(initial);
        if (!piece) {
            console.log('Piece doesnt exists');
            return false;
        }
        if (piece.color != this.turn) {
            console.log('Not your turn')
            return false;
        }
        
        if (this.findPiece(target)?.color == this.turn) return false;
        if (this.findPiece(target)?.name == 'King') return false;
        if (!piece.allowMove(this, target)) return false;
        return true;
    }

    transformNotationToPosition (notation) {
        const object = {
            'a': 0,
            'b': 1,
            'c': 2,
            'd': 3,
            'e': 4,
            'f': 5,
            'g': 6,
            'h': 7,
        }
        if (notation.length != 2) return [-1, -1];
        if (typeof object[notation[0]] == 'undefined') return [-2, -2];
        if (Number(notation[1]) < 1 || Number(notation[1]) > 8) return [-3, -3];
        const row = object[notation[0]];
        const column = Number(notation[1]) - 1;
        return [column, row];
    }
    transformPositionToNotation ([column, row]) {
        const object = {
            '0': 'a',
            '1': 'b',
            '2': 'c',
            '3': 'd',
            '4': 'e',
            '5': 'f',
            '6': 'g',
            '7': 'h',
        }
        if (typeof column != 'number' || typeof row != 'number') return 'none';
        if (column < 0 || column > 7) return 'none';
        if (row < 0 || row > 7) return 'none';
        return `${object[row]}${column + 1}`;
    }
}

(async () => {
     const tablero = new Tablero();
     for (;;) {
         tablero.render();
         const { initial, target } = await askMove();
         if (!tablero.movePiece(initial, target)) {
             console.log('Invalid move');
             continue;
         }
     }
 })();

 function ask(questionText) {
     return new Promise((resolve, reject) => {
       readline.question(questionText, resolve);
     });
 }

 function askMove () {
     return new Promise(async (resolve, reject) => {
         const initial = await ask('Enter the initial position: ');
         const target = await ask('Enter the target position: ');
         resolve({ initial, target });
     });
 }