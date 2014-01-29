define(function() {
  'use strict';

  return function(persistence, initControls) {
    var gameState, controls;
    var autoplay = {
      playing: false,
      intervalLength: 0,
      timeout: undefined,
      step: function() {
        persistAfter(progressGame)();
        if (autoplay.playing) {
          autoplay.timeout = setTimeout(autoplay.step, autoplay.intervalLength);
        }
      }
    };

    function persistAfter(fn) {
      return function() {
        var returnValue = fn.apply(this, arguments);
        persistence.persist(gameState);
        return returnValue;
      };
    }

    function resetGame() {
      controls.domBoard.toggleCells(gameState.livingCells);
      gameState.reset();
    }

    function changeSize(boardSize) {
      gameState.boardSize = boardSize;
      controls.domBoard.resizeTo(gameState);
    }

    function progressGame() {
      var changedCells = gameState.progress();
      controls.domBoard.toggleCells(changedCells);
    }

    controls = initControls({
      clear: persistAfter(resetGame),
      randomize: persistAfter(function(density) {
        resetGame();
        var random = Math.random;
        var boardSize = gameState.boardSize, livingCells = gameState.livingCells;
        for (var x = 0; x < boardSize; x++) {
          for (var y = 0; y < boardSize; y++) {
            if (random() + density >= 1) {
              livingCells.add([x, y]);
            }
          }
        }
        controls.domBoard.toggleCells(livingCells);
      }),
      changeSize: changeSize,
      commitChangedSize: persistAfter(function(boardSize) {
        changeSize(boardSize);
        gameState.cleanup();
      }),
      progress: persistAfter(progressGame),
      toggleAutoplay: function(doAutoplay, intervalLength) {
        autoplay.playing = doAutoplay;
        autoplay.intervalLength = intervalLength;
        autoplay.step();
      },
      changeAutoplayInterval: function(intervalLength) {
        autoplay.intervalLength = intervalLength;
      },
      toggleCell: persistAfter(function(x, y) {
        gameState.livingCells.toggle([x, y]);
        controls.domBoard.toggleCell(x, y)
      })
    });

    function onGameState(newState) {
      var cellsToToggle, domBoard = controls.domBoard;
      if (gameState) {
        cellsToToggle = gameState.livingCells.symmetricDifference(newState.livingCells);
        domBoard.toggleCells(cellsToToggle);
      }
      domBoard.resizeTo(newState);
      controls.setBoardSize(newState.boardSize);
      gameState = newState;
    }
    autoplay.intervalLength = controls.autoplayIntervalLength;
    persistence.boardSize = controls.boardSize;
    persistence.onGameState = onGameState;
    onGameState(persistence.restore());
  };
});
