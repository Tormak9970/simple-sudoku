/**
 * Copyright (C) 2023 Travis Lane (Tormak)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>
 */

type ConsoleWrapper = (...args: any[]) => void;

/**
 * Controller class that handles all logging done by the app.
 * ! Should do no logging here.
 */
export class LogController {

  /**
   * Logs a message with level [INFO] to the console.
   * @param {Mixed} [...] Values to log to the console.
   */
  static log: ConsoleWrapper = console.log.bind(
    window.console,
    `%c Simple Sudoku %c INFO %c`,
    "background: #ff3d03; color: black;",
    "background: #1abc9c; color: black;",
    "background: transparent;"
  );

  /**
   * Logs a message with level [WARNING] to the console.
   * @param {Mixed} [...] Values to log to the console.
   */
  static warn: ConsoleWrapper = console.warn.bind(
    window.console,
    `%c Simple Sudoku %c WARNING %c`,
    "background: #ff3d03; color: black;",
    "background: #e3c907; color: black;",
    "background: transparent;",
  );

  /**
   * Logs a message with level [ERROR] to the console.
   * @param {Mixed} [...] Values to log to the console.
   */
  static error: ConsoleWrapper = console.error.bind(
    window.console,
    `%c Simple Sudoku %c ERROR %c`,
    "background: #ff3d03; color: black;",
    "background: #c70808; color: black;",
    "background: transparent;"
  );
}
