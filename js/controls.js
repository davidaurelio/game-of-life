define(['./dom-board', './coordinates'], function(DomBoard, coordinates) {
  'use strict';

  function numericValue(input) {
    return Number(input.value);
  }

  var forEach = [].forEach;
  function setOutputsForInput(input) {
    var id = input.id, value = input.value;
    var outputs = document.querySelectorAll('output[for=' + JSON.stringify(id) + ']');
    forEach.call(outputs, function(output) {
      output.value = value;
    });
  }

  return function(controlsContainer, table, handlers) {
    var clearButton = controlsContainer.querySelector('#clear');
    var densityRange = controlsContainer.querySelector('#density');
    var randomizeButton = controlsContainer.querySelector('#randomize');
    var sizeRange = controlsContainer.querySelector('#size');
    var stepButton = controlsContainer.querySelector('#step');
    var autoplayCheckbox = controlsContainer.querySelector('#autoplay');
    var autoplaySpeedRange = controlsContainer.querySelector('#autoplay-speed');

    clearButton.onclick = handlers.clear;

    randomizeButton.onclick = function() {
      handlers.randomize(numericValue(densityRange));
    };

    sizeRange.oninput = function() {
      handlers.changeSize(numericValue(this));
    };
    sizeRange.onchange = function() {
      handlers.commitChangedSize(numericValue(this));
    };

    stepButton.onclick = handlers.progress;

    autoplayCheckbox.onchange = function() {
      handlers.toggleAutoplay(this.checked, numericValue(autoplaySpeedRange));
    };

    autoplaySpeedRange.oninput = function() {
      handlers.changeAutoplayInterval(numericValue(this));
    };

    table.onclick = function() {
      var cell = event.target;
      if (cell.nodeName !== 'TD') cell = cell.parentNode;
      var coords = cell.dataset.coordinates;
      if (coords) {
        coords = coordinates.fromString(coords);
        handlers.toggleCell(coords[0], coords[1]);
      }
    };

    // set outputs from inputs once
    forEach.call(controlsContainer.querySelectorAll('input[type="range"][id]'), setOutputsForInput);

    // hook up range outputs to input events
    controlsContainer.oninput = function(event) {
      var target = event.target;
      if (target.nodeName === 'INPUT' && target.type === 'range') {
        setOutputsForInput(target);
      }
    };

    // prevent form submission
    controlsContainer.onsubmit = function() { return false; };

    return {
      autoplayIntervalLength: numericValue(autoplaySpeedRange),
      boardSize: {
        standard: numericValue(sizeRange),
        min: Number(sizeRange.min),
        max: Number(sizeRange.max)
      },
      domBoard: new DomBoard(table),
      setBoardSize: function(boardSize) {
        sizeRange.value = boardSize;
        setOutputsForInput(sizeRange);
      }
    };
  }
});
