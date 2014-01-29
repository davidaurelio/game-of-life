define(['./coordinates'], function(coordinates) {
  'use strict';

  var ALIVE_CLASS = 'alive';

  function spread(fn) {
    return function(args) { return fn.apply(this, args); };
  }

  function DomBoard(emptyTable) {
    this._table = emptyTable;
    this._size = 0;
  }
  DomBoard.prototype = {
    resizeTo: function(gameState) {
      var currentSize = this._size, newSize = gameState.boardSize;
      if (newSize > currentSize) this._grow(newSize, gameState.livingCells);
      else if (newSize < currentSize) this._shrink(newSize);
    },

    _grow: function(toSize, livingCells) {
      var cell, x, row, y;
      var fromSize = this._size, table = this._table;
      for (y = 0; y < toSize; y++) {
        var isNewRow = y >= fromSize;
        row = isNewRow ? table.insertRow(y) : table.rows[y];
        for (x = isNewRow ? 0 : fromSize; x < toSize; x++) {
          cell = row.insertCell(x);
          cell.appendChild(document.createElement('span'));

          var coordinates = cell.dataset.coordinates = [x, y];
          if (livingCells.has(coordinates)) {
            this.enableCell(x, y);
          }
        }
      }
      this._size = toSize;
    },
    _shrink: function(toSize) {
      var fromSize = this._size, table = this._table;
      var row, y, x;
      for (y = 0; y < toSize; y++) {
        row = table.rows[y];
        for (x = fromSize - 1; x >= toSize; x--) {
          row.deleteCell(x);
        }
      }
      for (y = fromSize - 1; y >= toSize; y--) {
        table.deleteRow(y);
      }
      this._size = toSize;
    },

    _getCell: function(x, y) {
      return this._table.rows[y].cells[x];
    },
    enableCell: function(x, y) {
      this._getCell(x, y).classList.add(ALIVE_CLASS);
    },
    toggleCell: function(x, y) {
      this._getCell(x, y).classList.toggle(ALIVE_CLASS);
    },
    toggleCells: function(cellSet) {
      coordinates.fromSet(cellSet).forEach(spread(this.toggleCell), this);
    }
  };

  return DomBoard;
});
