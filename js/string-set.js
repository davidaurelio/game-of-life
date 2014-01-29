define(function() {
  'use strict';

  function negate(fn) {
    return function() {
      return !fn.apply(this, arguments);
    };
  }

  function StringSet(entries) {
    this._map = Object.create(null);
    this._sequence = [];
    var n = entries && entries.length || 0;
    for (var i = 0; i < n; i++) this.add(entries[i]);
  }

  StringSet.prototype = {
    add: function(item) {
      if (!this.has(item)) {
        this._map[item] = 1;
        this._sequence.push(String(item));
      }
    },
    has: function(item) {
      return item in this._map;
    },
    remove: function(item) {
      if (this.has(item)) {
        var sequence = this._sequence;
        sequence.splice(sequence.indexOf(String(item)), 1);
        delete this._map[item];
      }
    },
    toggle: function(item) {
      if (this.has(item)) this.remove(item);
      else this.add(item);
    },
    items: function() {
      return this._sequence.slice();
    },
    difference: function(set) {
      return new StringSet(this._sequence.filter(negate(set.has), set));
    },
    union: function(set) {
      return new StringSet(this._sequence.concat(set._sequence));
    },
    symmetricDifference: function(set) {
      return this.difference(set).union(set.difference(this));
    },

    map: function(callback, thisArg) {
      return this._sequence.map(callback, thisArg);
    },
    join: function(joiner) {
      return this._sequence.join(joiner);
    }
  };
  return StringSet;
});
