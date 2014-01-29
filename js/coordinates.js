define(function() {
  'use strict';

  function fromString(string) {
    return string.split(',').map(Number);
  }

  return {
    fromString: fromString,
    fromSet: function(coordinatesSet) {
      return coordinatesSet.map(fromString);
    }
  };
});
