import { del, get, set } from 'idb-keyval';
import { arrayDiff, chunk, idToIdx, idxToId } from './Utils';
import { board, loadErrorCallback, moves, notes, showLoadErrorModal } from "../stores";
import { LogController } from "./LogController";

/**
 * Calculates the "cross product" of two vectors.
 * @param A The first vector.
 * @param B The second vector.
 * @returns The "cross product".
 */
function cross(A: string[], B: string[]): string[] {
  let C = [];
  for (let a in A) {
    for (let b in B) {
      C.push(A[a] + B[b]);
    }
  }
  return C;
}

const DIGITS: string = '123456789';
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const COLUMNS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

const SQUARES = cross(ROWS, COLUMNS);
const UNITS_LIST: string[][] = [];
for (let column of COLUMNS) {
  UNITS_LIST.push(cross(ROWS, [column]));
}
for (let row of ROWS) {
  UNITS_LIST.push(cross([row], COLUMNS));
}

const ROW_MATRIX = [
  ['A', 'B', 'C'],
  ['D', 'E', 'F'],
  ['G', 'H', 'I']
];
const COLUMN_MATRIX = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9']
];
for (const row of ROW_MATRIX) {
  for (const column of COLUMN_MATRIX) {
    UNITS_LIST.push(cross(row, column));
  }
}

type Units = {
  [square: string]: [
    string[], //* Column this unit is in.
    string[], //* Row this unit is in.
    string[] //* Cell this unit is in
  ]
}

const UNITS = {};
for (const square of SQUARES) {
  UNITS[square] = [];

  for (const unit of UNITS_LIST) {
    if (unit.includes(square)) {
      UNITS[square].push(unit);
    }
  }
}

type Peers = {
  [square: string]: string[]
}

const PEERS: Peers = {};
for (const square of SQUARES) {
  PEERS[square] = [];

  for (const unitIndex in UNITS[square]) {
    let unitList = UNITS[square][unitIndex];

    for (const squareInUnit of unitList) {
      if (squareInUnit !== square) {
        PEERS[square].push(squareInUnit);
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

/**
 * Shuffles a given array.
 * @param arr The array to shuffle.
 * @returns The shuffled array.
 */
function shuffle(arr: any[]): any[] {
  const array = [...arr];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

function center(s: string | any[], w: number) {
  let excess = w - s.length;

  while (excess > 0) {
    if (excess % 2) {
      s += " ";
    } else {
      s = " " + s;
    }

    excess -= 1;
  }

  return s;
}

/**
 * ? Useful for debugging.
 * Generates a string for displaying the board in the console.
 * @param values The values to display.
 * @returns The board as a string.
 */
export function display(values: { [x: string]: any; }): string {
  let width = 0;

  for (const square of SQUARES) {
    if (values[square].length > width) width = values[square].length;
  }

  width += 1;
  let seg = "";
  for (let i = 0; i < width; i++) {
    seg += "---";
  }

  let line = "\n" + [seg, seg, seg].join("+");
  let board = "";

  for (const row of ROWS) {
    for (const column of COLUMNS) {
      board += center(values[row + column], width);
      if (column === '2' || column === '5') board += "|";
    }

    if (row === '2' || row === '5') board += line;
    board += "\n";
  }

  board += "\n";
  return board;
}

type Move = {
  firmId: string,
  newVal: string,
  oldVal: string,
  currentNotes: { [firmId: string]: number[] }
}

type Notes = { [firmId: string]: string[] }

/**
 * Class for generating and solving sudoku boards.
 */
export class Solver {
  initialBoard: string;
  _currentBoard: string;
  solvedBoard: string;
  currentDifficulty: string;
  _moves: Move[];
  _notes: Notes

  constructor() { }

  get currentBoard() {
    return this._currentBoard;
  }

  set currentBoard(newBoard: string) {
    this._currentBoard = newBoard;
    board.set(newBoard);
  }

  get moves() {
    return this._moves;
  }

  set moves(newMoves: Move[]) {
    this._moves = newMoves;
    moves.set([...newMoves]);
  }

  get notes() {
    return this._notes;
  }

  set notes(newNotes: Notes) {
    this._notes = newNotes;
    notes.set({...newNotes});
  }

  #checkSquares(board: string[][]): boolean {
    const squares: string[][] = [];

    for (let i = 0; i < 9; i++) {
      const row = [];

      for (let j = 0; j < 3; j++) {
        const columnIndx = (i % 3) * 3;
        row.push(...(board[j + Math.floor(i / 3) * 3].slice(columnIndx, columnIndx + 3)));
      }

      squares.push(row);
    }

    return !squares.some((s) => !s.includes('.')) && !squares.some((s) => s.every((ss) => ss == '.'));
  }

  #checkRows(board: string[][]): boolean { return !board.some((s) => !s.includes('.')); }

  #checkCols(board: string[][]): boolean {
    const columns = [];

    for (let i = 0; i < 9; i++) {
      const columnValues = [];

      for (let j = 0; j < 9; j++) {
        columnValues.push(board[j][i]);
      }

      columns.push(columnValues);
    }

    return !columns.some((s) => !s.includes('.'));
  }

  #checkQuality(board: string): boolean {
    let boardArray: string[][] = [];

    for (let i = 0; i < 9; i++) {
      boardArray.push(board.substring(i * 9, (i + 1) * 9).split(''));
    }

    return this.#checkSquares(boardArray) && this.#checkRows(boardArray) && this.#checkCols(boardArray);
  }

  #randomPuzzle(numberOfHints = 17) {
    /** Make a random puzzle with "numberOfHints" or more assignments. Restart on contradictions.
     * Note the resulting puzzle is not guaranteed to be solvable, but empirically
     * about 99.8% of them are solvable. Some have multiple solutions.
     */
    const values = Object.assign({}, ...SQUARES.map((square) => {
      let res = {};
      res[square] = DIGITS;
      return res;
    }));

    for (const square of shuffle(SQUARES)) {
      const assignedValues = this.#assign(values, square, values[square][Math.floor(Math.random() * values[square].length)]);
      if (!assignedValues) break;

      const singleOptions = [];
      for (const square of SQUARES) {
        if (values[square].length === 1) singleOptions.push(values[square])
      }

      if (singleOptions.length >= numberOfHints && (new Set(singleOptions)).size >= 8) {
        const res = SQUARES.map((square) => {
          return (values[square].length === 1) ? values[square] : '.';
        }).join('');

        if (this.#checkQuality(res)) {
          return res;
        } else {
          return this.#randomPuzzle(numberOfHints); // Make a better puzzle
        }
      }
    }

    return this.#randomPuzzle(numberOfHints); // Give up and make a new puzzle
  }

  #flip(board: string[][], dir: 'h' | 'v' | 'b' | 'n'): string[][] {
    function horizontalFlip(board: string[][]): string[][] {
      for (let i = 0; i < board.length; i++) {
        board[i] = board[i].reverse();
      }
      
      return board;
    }
    function verticalFlip(board: string[][]): string[][] { return board.reverse(); }

    const temp = [...board];

    switch (dir) {
      case 'h':
        return horizontalFlip(temp);
      case 'v':
        return verticalFlip(temp);
      case 'b': {
        if (Math.round(Math.random()) === 1) {
          return verticalFlip(horizontalFlip(temp));
        } else {
          return horizontalFlip(verticalFlip(temp));
        }
      }
      case 'n':
        return temp;
    }
  }

  #rotate(board: string[][], rot: number) {
    let temp = [...board];

    function rotate(board: string[][]): string[][] {
      const length = board.length;
      const x = Math.floor(length / 2);
      const y = length - 1;

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

    for (let i = 0; i < rot; i++) {
      temp = rotate(temp);
    }

    return temp;
  }

  #transform(board: string) {
    const flips: ['n', 'h', 'v', 'b'] = ['n', 'h', 'v', 'b'];

    const rotation = Math.round(Math.random() * 3);
    const flip = flips[Math.round(Math.random() * 3)];

    let boardArray: string[][] = [];

    for (let i = 0; i < 9; i++) {
      boardArray.push(board.substring(i * 9, (i + 1) * 9).split(''));
    }

    if (Math.round(Math.random()) === 1) {
      boardArray = this.#flip(boardArray, flip);
      boardArray = this.#rotate(boardArray, rotation);
    } else {
      boardArray = this.#rotate(boardArray, rotation);
      boardArray = this.#flip(boardArray, flip);
    }

    return boardArray.flat().join('');
  }

  #assign(values: { [x: string]: string; }, square: string, digit: string) { // Eliminate all the other values (except dig) from values[sq] and propagate.
    let result = true;
    let squareValues = values[square];

    for (const squareValue of squareValues.split("")) {
      if (squareValue !== digit) {
        result = result && this.#eliminate(values, square, squareValue);
      }
    }

    return (result ? values : null);
  }

  #eliminate(values: { [x: string]: string; }, square: string, digit: string) {
    if (!values[square].includes(digit)) {
      return true; // already eliminated.
    }

    values[square] = values[square].replace(digit, "");

    if (values[square].length === 0) {
      // LogController.error("Expected square", square, "to have at least one value but had 0!");
      return false;
    } else if (values[square].length === 1) {
      //* If there is only one value (values[sq]) left in square, remove it from peers
      let result = true;

      for (const peer of PEERS[square]) {
        result = result && this.#eliminate(values, peer, values[square]);
      }

      if (!result) return false;
    }

    for (const unitIndex in UNITS[square]) {
      let digitPlaces = [];

      for (const squareIndex in UNITS[square][unitIndex]) {
        let unitSquare = UNITS[square][unitIndex][squareIndex];

        if (values[unitSquare].includes(digit)) {
          digitPlaces.push(unitSquare);
        }
      }

      if (digitPlaces.length == 0) {
        return false;
      } else if (digitPlaces.length == 1) {
        if (!this.#assign(values, digitPlaces[0], digit)) {
          return false;
        }
      }
    }

    return true;
  }

  search(values: { [x: string]: string; }) {
    if (!values) return null;

    let min = 10, max = 1, targetSquare = null;
    for (let square of SQUARES) {
      if (values[square].length > max) max = values[square].length;

      if (values[square].length > 1 && values[square].length < min) {
        min = values[square].length;
        targetSquare = square;
      }
    }

    if (max === 1) return values;

    for (let i = 0; i < values[targetSquare].length; i++) {
      let res = this.search(this.#assign({...values}, targetSquare, values[targetSquare].charAt(i)));

      if (res) return res;
    }

    return null;
  }


  solve(board: string): string { return this.search(this.parseBoard(board)); }

  /**
   * Parses a board and returns the value of each square.
   * @param board The board to parse.
   * @returns An object indicating the value in every position.
   */
  parseBoard(board: string) {
    let board2 = "";
    for (let character = 0; character < board.length; character++) {
      if ("0.-123456789".includes(board.charAt(character))) {
        board2 += board.charAt(character);
      }
    }

    let values = {};
    for (let square of SQUARES) {
      values[square] = DIGITS;
    }
    
    for (let squareIndex in SQUARES) {
      if (DIGITS.indexOf(board2.charAt(parseInt(squareIndex))) >= 0 && !this.#assign(values, SQUARES[squareIndex], board2.charAt(parseInt(squareIndex)))) return false;
    }

    return values;
  }

  /**
   * Gets the board for the given difficulty.
   * @param difficulty The difficulty of the board to get.
   * @param newGame Whether this is a new game or not.
   * @returns The board.
   */
  async getBoard(difficulty: string, newGame: boolean) {
    this.currentDifficulty = difficulty;

    return new Promise(async (resolve) => {
      try {
        if (!newGame && await get(`initialBoard-${difficulty}`)) {
          this.initialBoard = await get(`initialBoard-${difficulty}`);
          this.currentBoard = await get(`currentBoard-${difficulty}`);
          this.solvedBoard = await get(`solvedBoard-${difficulty}`);
          this.moves = JSON.parse(await get(`moves-${difficulty}`));
          this.notes = JSON.parse(await get(`notes-${difficulty}`));
    
          resolve(this.initialBoard);
        } else {
          throw new Error("Triggering cache block");
        }
      } catch (e: any) {
        loadErrorCallback.set(async () => {
          await del(`initialBoard-${difficulty}`);
          await del(`currentBoard-${difficulty}`);
          await del(`solvedBoard-${difficulty}`);

          await del(`moves-${difficulty}`);
          await del(`notes-${difficulty}`);

          await del(`timer-${difficulty}`);

          const difficultyData = difficulties[difficulty];
          const numberOfHints = Math.round(Math.random() * (difficultyData.max - difficultyData.min)) + difficultyData.min;
      
          this.initialBoard = this.#transform(this.#randomPuzzle(numberOfHints));
          this.currentBoard = this.initialBoard;
          this.solvedBoard = Object.values(this.solve(this.initialBoard)).join('');
          this.moves = [];
      
          this.notes = {};
          for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
              this.notes[`${i}|${j}`] = [];
            }
          }
      
          await this.save();
      
          showLoadErrorModal.set(false);
          resolve(this.initialBoard);
        });
        
        showLoadErrorModal.set(true);
      }
    });
  }

  #notesCheckRow([rowIdx, columnIdx]: number[], newVal: string) {
    const currentNotes = {};

    for (let i = 0; i < 9; i++) {
      if (i !== columnIdx) {
        const firmId = idxToId(rowIdx, i);

        if (this.notes[firmId].includes(newVal)) {
          const oldNotes = this.#setNote(firmId, newVal);
          currentNotes[firmId] = arrayDiff(oldNotes, this.notes[firmId]);
        }
      }
    }

    return currentNotes;
  }

  #notesCheckColumn([rowIdx, colIdx]: number[], newVal: string) {
    const currentNotes = {};

    for (let i = 0; i < 9; i++) {
      if (i !== rowIdx) {
        const firmId = idxToId(i, colIdx);

        if (this.notes[firmId].includes(newVal)) {
          const oldNotes = this.#setNote(firmId, newVal);
          currentNotes[firmId] = arrayDiff(oldNotes, this.notes[firmId]);
        }
      }
    }

    return currentNotes;
  }

  #notesCheckSquare(firmId: string, newVal: string) {
    const currentNotes = {};
    const [cellId, subId] = firmId.split('|').map(v => parseInt(v));

    for (let i = 0; i < 9; i++) {
      const subFirmId = `${cellId}|${i}`;

      if (subFirmId !== firmId) {
        if (this.notes[subFirmId].includes(newVal)) {
          const oldNotes = this.#setNote(subFirmId, newVal);
          currentNotes[subFirmId] = arrayDiff(oldNotes, this.notes[subFirmId]);
        }
      }
    }

    return currentNotes;
  }

  #checkNotes(firmId: string, newVal: string): { [cellId: string]: number[] } {
    const currentNotes = {};
    const idxs = idToIdx(firmId);
    const oldNotes = this.#setNote(firmId, "");

    currentNotes[firmId] = arrayDiff(oldNotes, this.notes[firmId]);

    Object.assign(currentNotes, this.#notesCheckRow(idxs, newVal));
    Object.assign(currentNotes, this.#notesCheckColumn(idxs, newVal));
    Object.assign(currentNotes, this.#notesCheckSquare(firmId, newVal));

    return currentNotes
  }

  #setCell(firmId: string, newVal: string): string {
    let currentBoardArray = this.currentBoard.split("");
    const idxs = idToIdx(firmId);
    const idx = idxs[0] * 9 + idxs[1];

    const oldVal = currentBoardArray.splice(idx, 1, newVal);
    this.currentBoard = currentBoardArray.join("");

    return oldVal[0];
  }

  /**
   * Sets the provided cell to the given value.
   * @param firmId The id of the cell to set.
   * @param newVal The new value of the cell.
   */
  async setCell(firmId: string, newVal: string): Promise<void> {
    const oldValue = this.#setCell(firmId, newVal);

    const currentNotes = this.#checkNotes(firmId, newVal);

    this.moves.push({
      "firmId": firmId,
      "newVal": newVal,
      "oldVal": oldValue,
      "currentNotes": currentNotes
    });

    await this.save();
  }

  /**
   * Gets the data for the given cell.
   * @param firmId The id of the cell to get.
   * @returns The cell.
   */
  getCell(firmId: string): { value: string, editable: boolean } {
    if (this.currentBoard) {
      const initialBoardArray = this.initialBoard.split("");
      const currentBoardArray = this.currentBoard.split("");
      const idxs = idToIdx(firmId);
      const idx = idxs[0] * 9 + idxs[1];

      if (currentBoardArray[idx] != ".") {
        return {
          "value": currentBoardArray[idx],
          "editable": initialBoardArray[idx] == "."
        }
      } else {
        return {
          "value": "",
          "editable": true
        }
      }
    }
  }

  /**
   * Gets the values for a given square.
   * @param firmId The firm id of the square to get.
   * @returns The square's values.
   */
  getSquare(firmId: string): string[] {
    const [cellId, subId] = firmId.split('|').map(v => parseInt(v));

    const currentBoardArray = chunk(this.currentBoard.split(""), 9);
    const currentValues = [];

    for (let i = 0; i < 3; i++) {
      const subIdx = (cellId % 3) * 3;
      currentValues.push(...(currentBoardArray[i + Math.floor(cellId / 3) * 3].slice(subIdx, subIdx + 3)));
    }

    return currentValues;
  }

  #setNote(firmId: string, note: string): string[] {
    const oldNotes = [...this.notes[firmId]];

    if (note === "") {
      this.notes[firmId] = [];
    } else {
      if (this.notes[firmId].includes(note)) {
        this.notes[firmId].splice(this.notes[firmId].indexOf(note), 1);
      } else {
        this.notes[firmId].push(note);
        this.notes[firmId].sort((a, b) => parseInt(a) - parseInt(b));
      }
    }

    this.notes = {...this.notes};
    return oldNotes;
  }

  /**
   * Sets the note of a given cell.
   * @param firmId The firm id of the cell.
   * @param note The note to set.
   */
  async setNote(firmId: string, note: string): Promise<void> {
    const oldNotes = this.#setNote(firmId, note);

    const currentNotes = {}
    currentNotes[firmId] = arrayDiff(oldNotes, this.notes[firmId]);

    const oldVal = this.#setCell(firmId, ".");

    this.moves.push({
      "firmId": firmId,
      "newVal": ".",
      "oldVal": oldVal,
      "currentNotes": currentNotes
    });

    await this.save();
  }

  /**
   * Gets the notes for a cell.
   * @param firmId The firm id of the cell whoes notes should be gotten.
   * @returns The cell's notes, or null if it isn't editable.
   */
  getNote(firmId: string): string[] | null {
    if (this.getCell(firmId).editable) {
      return this.notes[firmId];
    } else {
      return [];
    }
  }

  /**
   * Validates the current board by comparing it to the solved board.
   * @returns A list of mistakes made.
   */
  validate() {
    const currentBoardArray = this.currentBoard.split("");
    const errors = Array.from(this.solvedBoard.split("").entries()).filter((v: [number, string]) => currentBoardArray[v[0]] != v[1] && currentBoardArray[v[0]] != ".").map((v) => idxToId(Math.floor(v[0] / 9), v[0] % 9));
    return errors;
  }

  /**
   * Restarts this board by resetting it to its initial state.
   */
  async restart() {
    this.currentBoard = this.initialBoard;
    this.notes = {};

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        this.notes[`${i}|${j}`] = [];
      }
    }

    this.moves = [];

    await this.save();
  }

  /**
   * Undoes that most recent action.
   */
  async undo() {
    if (this.moves.length > 0) {
      const lastMove = this.moves.pop();

      // revert square
      this.#setCell(lastMove.firmId, lastMove.oldVal);

      // revert any changed notes
      const currentNotes = Object.entries(lastMove.currentNotes);
      for (const currentNote of currentNotes) {
        for (const note of currentNote[1]) {
          this.#setNote(currentNote[0], note.toString());
        }
      }

      await this.save();
    }
  }

  hint() {

  }

  /**
   * Saves the solver state to indexDB.
   */
  async save() {
    await set(`initialBoard-${this.currentDifficulty}`, this.initialBoard);
    await set(`currentBoard-${this.currentDifficulty}`, this.currentBoard);
    await set(`solvedBoard-${this.currentDifficulty}`, this.solvedBoard);
    await set(`moves-${this.currentDifficulty}`, JSON.stringify(this.moves));
    await set(`notes-${this.currentDifficulty}`, JSON.stringify(this.notes));
  }
}