import { get, set } from 'idb-keyval';
import { arrayDiff, chunk, idToIdx, idxToId } from './Utils';

function cross(A:string[], B:string[]) {
    let C = [];
    for (let a in A) {
        for (let b in B) {
            C.push(A[a] + B[b]);
        }
    }
    return C;
}

const digits:string = '123456789';
const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const cols = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

const squares = cross(rows, cols);
let unitlist = [];
for (let c in cols) unitlist.push(cross(rows, [cols[c]]));
for (let r in rows) unitlist.push(cross([rows[r]], cols));

let rrows = [['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']];
let ccols = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']];
for (let rs in rrows) for (let cs in ccols) unitlist.push(cross(rrows[rs], ccols[cs]));

let units = {};
for (let s in squares) {
    units[squares[s]] = [];
    for (let u in unitlist) {
        if (unitlist[u].includes(squares[s])) {
            units[squares[s]].push(unitlist[u]);
        }
    }
}

let peers = {};
for (let s in squares) {
    peers[squares[s]] = {};
    for (let u in units[squares[s]]) {
        let ul = units[squares[s]][u];
        for (let s2 in ul) {
            if (ul[s2] != squares[s]) {
                peers[squares[s]][ul[s2]] = true;
            }
        }
    }
}

const difficulties = {
    "easy": {
        "max": 36,
        "min": 32
    },
    "medium": {
        "max": 31,
        "min": 27
    },
    "hard": {
        "max": 26,
        "min": 22
    },
    "crazy": {
        "max": 21,
        "min": 17
    }
}

function shuffle(arr:any[]) {
    const array = [...arr];

    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  
    return array;
}

function dup(obj: { [x: string]: any; }) {
    let d = {};
    for (let f in obj) {
        d[f] = obj[f];
    }
    return d;
}

function center(s: string | any[], w: number) {
    let excess = w - s.length;
    while (excess > 0) {
        if (excess % 2) s += " "; else s = " " + s;
        excess -= 1;
    }
    return s;
}

export function display(values: { [x: string]: any; }) { // Used for debugging
    let width = 0;
    for (let s in squares) {
        if (values[squares[s]].length > width) width = values[squares[s]].length;
    }

    width += 1;
    let seg = "";
    for (let i = 0; i < width; i++) seg += "---";

    let line = "\n" + [seg, seg, seg].join("+");
    let board = "";

    // @ts-ignore
    for (let r in rows) {
        // @ts-ignore
        for (let c in cols) {
            board += center(values[rows[r] + cols[c]], width);
            if (c == '2' || c == '5') board += "|";
        }

        if (r == '2' || r == '5') board += line;
        board += "\n";
    }

    board += "\n";
    return board;
}

type move = { firmId:string, newVal:string, oldVal:string, cNotes:{[firmId:string]: number[]} }

export class Solver {
    iBoard:string; // initial Board
    cBoard:string; // current Board
    sBoard:string; // solved Board
    curDif:string;
    moves:move[];
    notes:{ [firmId:string]: string[] }

    constructor() {}

    #checkSquares(board:string[][]): boolean {
        const squares:string[][] = [];

        for (let i = 0; i < 9; i++) {
            const iVals = [];

            for (let j = 0; j < 3; j++) {
                const sIdx = (i % 3) * 3;
                iVals.push(...(board[j + Math.floor(i / 3) * 3].slice(sIdx, sIdx + 3)));
            }

            squares.push(iVals);
        }

        return !squares.some((s) => !s.includes('.')) && !squares.some((s) => s.every((ss) => ss == '.'));
    }

    #checkRows(board:string[][]): boolean { return !board.some((s) => !s.includes('.')); }

    #checkCols(board:string[][]): boolean {
        const cols = [];

        for (let i = 0; i < 9; i++) {
            const colVals = [];

            for (let j = 0; j < 9; j++) {
                colVals.push(board[j][i]);
            }

            cols.push(colVals);
        }

        return !cols.some((s) => !s.includes('.'));
    }

    #checkQuality(board:string): boolean {
        let bArr:string[][] = [];

        for (let i = 0; i < 9; i++) {
            bArr.push(board.substring(i*9, (i+1)*9).split(''));
        }

        return this.#checkSquares(bArr) && this.#checkRows(bArr) && this.#checkCols(bArr);
    }

    #random_puzzle(N=17) {
        /** Make a random puzzle with N or more assignments. Restart on contradictions.
         * Note the resulting puzzle is not guaranteed to be solvable, but empirically
         * about 99.8% of them are solvable. Some have multiple solutions.
         */
        const values = Object.assign({}, ...squares.map((s) => {let res = {}; res[s] = digits; return res; }));

        for (const s of shuffle(squares)) {
            if (!this.#assign(values, s, values[s][Math.floor(Math.random() * values[s].length)])) break;

            const ds = [];
            for (const s of squares) {
                if (values[s].length === 1) ds.push(values[s])
            }

            if (ds.length >= N && (new Set(ds)).size >= 8) {
                const res = squares.map((s) => {
                    return (values[s].length === 1) ? values[s] : '.';
                }).join('');

                if (this.#checkQuality(res)) {
                    return res;
                } else {
                    return this.#random_puzzle(N); // Make a better puzzle
                }
            }
        }

        return this.#random_puzzle(N); // Give up and make a new puzzle
    }

    #flip(board:string[][], dir:string): string[][] {
        function hFlip(board:string[][]): string[][] { for (let i = 0; i < board.length; i++) { board[i] = board[i].reverse(); } return board; }
        function vFlip(board:string[][]): string[][] { return board.reverse(); }

        const temp = [...board];

        switch (dir) {
            case 'h':
                return hFlip(temp);
            case 'v':
                return vFlip(temp);
            case 'b': {
                if (Math.round(Math.random()) === 1) {
                    return vFlip(hFlip(temp));
                } else {
                    return hFlip(vFlip(temp));
                }
            }
            case 'n':
                return temp;
        }
    }

    #rotate(board:string[][], rot:number) {
        let temp = [...board];

        function rotate(board:string[][]): string[][] {
            const n = board.length;
            const x = Math.floor(n/ 2);
            const y = n - 1;
            for (let i = 0; i < x; i++) {
                for (let j = i; j < y - i; j++) {
                    let k = board[i][j];
                    board[i][j] = board[y - j][i];
                    board[y - j][i] = board[y - i][y - j];
                    board[y - i][y - j] = board[j][y - i];
                    board[j][y - i] = k;
                }
            }

            return board;
        }

        for (let i = 0; i < rot; i ++) { temp = rotate(temp); }

        return temp;
    }

    #transform(board:string) {
        const flips = ['n', 'h', 'v', 'b'];

        const rot = Math.round(Math.random() * 3);
        const flp = flips[Math.round(Math.random() * 3)];

        let bArr:string[][] = [];

        for (let i = 0; i < 9; i++) {
            bArr.push(board.substring(i*9, (i+1)*9).split(''));
        }

        if (Math.round(Math.random()) === 1) {
            bArr = this.#flip(bArr, flp);
            bArr = this.#rotate(bArr, rot);
        } else {
            bArr = this.#rotate(bArr, rot);
            bArr = this.#flip(bArr, flp);
        }

        return bArr.flat().join('');
    }

    #assign(values: { [x: string]: string; }, sq: string, dig: string) { // Eliminate all the other values (except dig) from values[sq] and propagate.
        let result = true;
        let vals = values[sq];
        for (let d = 0; d < vals.length; d++) {
            if (vals.charAt(d) != dig) {
                result = result && !!this.#eliminate(values, sq, vals.charAt(d));
            }
        }
        return (result ? values : null);
    }
    
    #eliminate(values: { [x: string]: string; }, sq: string, dig: string) {
        if (!values[sq].includes(dig)) {
            return values; // already eliminated.
        }
    
        values[sq] = values[sq].replace(dig, "");
        if (values[sq].length == 0) {
            return false; // invalid input ?
        } else if (values[sq].length == 1) { // If there is only one value (values[sq]) left in square, remove it from peers
            let result = true;
            for (let s in peers[sq]) {
                result = result && !!this.#eliminate(values, s, values[sq]);
            }
    
            if (!result) return false;
        }
        for (let u in units[sq]) {
            let dplaces = [];
            for (let s in units[sq][u]) {
                let sq2 = units[sq][u][s];
                if (values[sq2].includes(dig)) {
                    dplaces.push(sq2);
                }
            }
    
            if (dplaces.length == 0) {
                return false;
            } else if (dplaces.length == 1) {
                if (!this.#assign(values, dplaces[0], dig)) {
                    return false;
                }
            }
        }
        return values;
    }

    search(values: { [x: string]: string; }) {
        if (!values) return false;

        let min = 10, max = 1, sq = null;
        for (let s in squares) {
            if (values[squares[s]].length > max) max = values[squares[s]].length;

            if (values[squares[s]].length > 1 && values[squares[s]].length < min) {
                min = values[squares[s]].length;
                sq = squares[s];
            }
        }

        if (max == 1) return values;

        for (let d = 0; d < values[sq].length; d++) {
            let res = this.search(this.#assign(dup(values), sq, values[sq].charAt(d)));

            if (res) return res;
        }
        return false;
    }

    solve(board:string) { return this.search(this.parseBoard(board)); }

    parseBoard(board:string) {
        let board2 = "";
        for (let c = 0; c < board.length; c++) {
            if ("0.-123456789".includes(board.charAt(c))) {
                board2 += board.charAt(c);
            }
        }
    
        let values = {};
        for (let s in squares) {
            values[squares[s]] = digits;
        }
        for (let s in squares) {
            if (digits.indexOf(board2.charAt(parseInt(s))) >= 0 && !this.#assign(values, squares[s], board2.charAt(parseInt(s)))) return false;
        }
        return values;
    }

    async getBoard(difficulty:string, newGame:boolean) {
        this.curDif = difficulty;

        if (!newGame && await get(`iBoard-${difficulty}`)) {
            this.iBoard = await get(`iBoard-${difficulty}`);
            this.cBoard = await get(`cBoard-${difficulty}`);
            this.sBoard = await get(`sBoard-${difficulty}`);
            this.moves = JSON.parse(await get(`moves-${difficulty}`));
            this.notes = JSON.parse(await get(`notes-${difficulty}`));

            return this.iBoard;
        }

        const df = difficulties[difficulty];
        const numEntr = Math.round(Math.random() * (df.max - df.min)) + df.min;

        this.iBoard = this.#transform(this.#random_puzzle(numEntr));
        this.cBoard = this.iBoard;
        this.sBoard = Object.values(this.solve(this.iBoard)).join('');
        this.moves = [];

        this.notes = {};
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.notes[`${i}|${j}`] = [];
            }
        }

        await this.save();

        return this.iBoard;
    }

    #notesCheckRow([rowIdx, colIdx]:number[], newVal:string) {
        const cNotes = {};

        for (let i = 0; i < 9; i++) {
            if (i != colIdx) {
                const firmId = idxToId(rowIdx, i);

                if (this.notes[firmId].includes(newVal)) {
                    const oNotes = this.#setNote(firmId, newVal);
                    cNotes[firmId] = arrayDiff(oNotes, this.notes[firmId]);
                }
            }
        }

        return cNotes;
    }

    #notesCheckCol([rowIdx, colIdx]:number[], newVal:string) {
        const cNotes = {};

        for (let i = 0; i < 9; i++) {
            if (i != rowIdx) {
                const firmId = idxToId(i, colIdx);

                if (this.notes[firmId].includes(newVal)) {
                    const oNotes = this.#setNote(firmId, newVal);
                    cNotes[firmId] = arrayDiff(oNotes, this.notes[firmId]);
                }
            }
        }

        return cNotes;
    }

    #notesCheckSqr(firmId:string, newVal:string) {
        const cNotes = {};
        const [cellId, subId] = firmId.split('|').map(v => parseInt(v));

        for (let i = 0; i < 9; i++) {
            const subFirmId = `${cellId}|${i}`;
            if (subFirmId != firmId) {
                if (this.notes[subFirmId].includes(newVal)) {
                    const oNotes = this.#setNote(subFirmId, newVal);
                    cNotes[subFirmId] = arrayDiff(oNotes, this.notes[subFirmId]);
                }
            }
        }

        return cNotes;
    }

    #checkNotes(firmId:string, newVal:string):{[cellId:string]: number[]} {
        const cNotes = {};
        const idxs = idToIdx(firmId);
        const oNotes = this.#setNote(firmId, "");

        cNotes[firmId] = arrayDiff(oNotes, this.notes[firmId]);

        Object.assign(cNotes, this.#notesCheckRow(idxs, newVal));
        Object.assign(cNotes, this.#notesCheckCol(idxs, newVal));
        Object.assign(cNotes, this.#notesCheckSqr(firmId, newVal));

        return cNotes
    }

    #setCell(firmId:string, newVal:string):string {
        let cBoardArr = this.cBoard.split("");
        const idxs = idToIdx(firmId);
        const idx = idxs[0] * 9 + idxs[1];

        const oldVal = cBoardArr.splice(idx, 1, newVal);
        this.cBoard = cBoardArr.join("");

        return oldVal[0];
    }

    async setCell(firmId:string, newVal:string): Promise<void> {
        const oldVal = this.#setCell(firmId, newVal);

        const cNotes = this.#checkNotes(firmId, newVal);

        this.moves.push({
            "firmId": firmId,
            "newVal": newVal,
            "oldVal": oldVal,
            "cNotes": cNotes
        });

        await this.save();
    }

    getCell(firmId:string): {value:string, editable:boolean} {
        if (this.cBoard) {
            const iBoardArr = this.iBoard.split("");
            const cBoardArr = this.cBoard.split("");
            const idxs = idToIdx(firmId);
            const idx = idxs[0] * 9 + idxs[1];

            if (cBoardArr[idx] != ".") {
                return { "value":cBoardArr[idx], "editable": iBoardArr[idx] == "." }
            } else {
                return { "value": "", "editable": true } 
            }
        }
    }

    getSquare(firmId:string) {
        const [cellId, subId] = firmId.split('|').map(v => parseInt(v));

        const cBoardArr = chunk(this.cBoard.split(""), 9);
        const cVals = [];

        for (let i = 0; i < 3; i++) {
            const sIdx = (cellId % 3) * 3;
            cVals.push(...(cBoardArr[i + Math.floor(cellId / 3) * 3].slice(sIdx, sIdx + 3)));
        }

        return cVals;
    }

    #setNote(firmId:string, note:string):string[] {
        const oNotes = [...this.notes[firmId]];
        if (note == "") {
            this.notes[firmId] = [];
        } else {
            if (this.notes[firmId].includes(note)) {
                this.notes[firmId].splice(this.notes[firmId].indexOf(note), 1);
            } else {
                this.notes[firmId].push(note);
                this.notes[firmId].sort((a, b) => parseInt(a) - parseInt(b));
            }
        }
        return oNotes;
    }

    async setNote(firmId:string, note:string): Promise<void> {
        const oNotes = this.#setNote(firmId, note);

        const cNotes = {}
        cNotes[firmId] = arrayDiff(oNotes, this.notes[firmId]);

        const oldVal = this.#setCell(firmId, ".");

        this.moves.push({
            "firmId": firmId,
            "newVal": ".",
            "oldVal": oldVal,
            "cNotes": cNotes
        });

        await this.save();
    }

    getNote(firmId:string): string[]|null {
        if (this.getCell(firmId).editable) {
            return this.notes[firmId];
        } else {
            return null;
        }
    }

    validate() {
        const cBoardArr = this.cBoard.split("");
        const errs = Array.from(this.sBoard.split("").entries()).filter((v:[number, string]) => cBoardArr[v[0]] != v[1] && cBoardArr[v[0]] != ".").map((v) => idxToId(Math.floor(v[0] / 9), v[0] % 9));
        return errs;
    }

    async restart() {
        this.cBoard = this.iBoard;
        this.notes = {};
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.notes[`${i}|${j}`] = [];
            }
        }
        this.moves = [];

        await this.save();
    }

    async undo() {
        if (this.moves.length > 0) {
            const lMove = this.moves.pop();

            // revert square
            this.#setCell(lMove.firmId, lMove.oldVal);

            // revert any changed notes
            const cNotes = Object.entries(lMove.cNotes);
            for (const cNote of cNotes) {
                for(const note of cNote[1]) {
                    this.#setNote(cNote[0], note.toString());
                }
            }

            await this.save();
        }
    }

    hint() {

    }

    async save() {
        await set(`iBoard-${this.curDif}`, this.iBoard);
        await set(`cBoard-${this.curDif}`, this.cBoard);
        await set(`sBoard-${this.curDif}`, this.sBoard);
        await set(`moves-${this.curDif}`, JSON.stringify(this.moves));
        await set(`notes-${this.curDif}`, JSON.stringify(this.notes));
    }
}