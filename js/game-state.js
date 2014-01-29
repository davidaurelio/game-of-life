define(['./string-set', './coordinates'], function(StringSet, coordinates) {
  'use strict';

  function restrict(boardSize, length) {
    length %= boardSize;
    return length < 0 ? length + boardSize : length;
  }

  function GameState(boardSize, livingCells) {
    this.boardSize = boardSize;
    this.livingCells = livingCells || new StringSet();
  }

  GameState.prototype = {
    cleanup: function() {
      var boardSize = this.boardSize, livingCells = this.livingCells;
      coordinates.fromSet(livingCells)
        .filter(function(coordinates) {
          return coordinates[0] >= boardSize || coordinates[0] >= boardSize;
        })
        .forEach(livingCells.remove, livingCells);
    },
    progress: function() {
      var boardSize = this.boardSize, livingCells = this.livingCells;
      var nextLivingCells = new StringSet();
      for (var x = 0; x < boardSize; x++) {
        for (var y = 0; y < boardSize; y++) {
          var coordinates = [x, y];
          var neighboursCount = this.numNeighbours(x, y);
          if (neighboursCount === 3 || neighboursCount === 2 && livingCells.has(coordinates)) {
            nextLivingCells.add(coordinates);
          }
        }
      }
      this.livingCells = nextLivingCells;
      return livingCells.symmetricDifference(nextLivingCells);
    },
    normalize: function(x, y) {
      var boardSize = this.boardSize;
      return [restrict(boardSize, x), restrict(boardSize, y)];
    },
    numNeighbours: function(x, y) {
      var count = 0, livingCells = this.livingCells;
      for (var i = 0; i < 9; i++) {
        var xx = x + i % 3 - 1, yy = y + (i / 3 | 0) - 1;
        if (i !== 4 && livingCells.has(this.normalize(xx, yy))) {
          count += 1;
        }
      }
      return count;
    },
    reset: function() {
      this.livingCells = new StringSet();
    }
  };

  return GameState;
});
