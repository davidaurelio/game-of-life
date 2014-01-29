define(['./game-state', './string-set'], function(GameState, StringSet) {
  'use strict';

  function restrict(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }

  var persistance = {
    boardSize: {min: 0, max: Infinity, standard: 10},
    _restrictBoardSize: function(size) {
      var boardSize = this.boardSize;
      return size ? restrict(size, boardSize.min, boardSize.max) : boardSize.standard;
    },

    restore: function() {
      var bits = decodeURIComponent(location.hash.slice(1)).split(':');
      var size = this._restrictBoardSize(Number(bits[0]));

      var gameState = new GameState(size), livingCells = gameState.livingCells;
      var coordinates = String(bits[1]).match(/\d+,\d+/g);
      if (coordinates) coordinates.forEach(livingCells.add, livingCells);

      return gameState;
    },

    persist: function(gameState) {
      var serialized = gameState.boardSize + ':' + gameState.livingCells.join(',');
      var hash = '#' + encodeURI(serialized);
      if (hash !== location.hash) {
        history.pushState({
          boardSize: gameState.boardSize,
          livingCells: gameState.livingCells.items()
        }, document.title, hash);
      }
    },
    onGameState: function() {}
  };
  window.onpopstate = function(event) {
    var state = event.state;
    var gameState = state ?
      new GameState(state.boardSize, new StringSet(state.livingCells)) :
      persistance.restore();

    persistance.onGameState(gameState);
    event.preventDefault();
  };
  return persistance;
});
