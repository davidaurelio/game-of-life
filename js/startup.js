define(['./main', './persistence', './controls'],
function(mainLoop, persistence, initControls) {
  'use strict';

  mainLoop(persistence, function(handlers) {
    return initControls(document.getElementById('controls'),
                        document.getElementById('game-of-life'),
                        handlers);
  });
});
