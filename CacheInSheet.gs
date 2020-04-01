const cacheSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("cache");
const cacheInSheet = {
  get: function (key) {
    var rangeKey = getRangeFromKey(key);
    try {
      var range = cacheSheet.getRange(rangeKey[0], rangeKey[1]);
      var result = range.isBlank() ? null : range.getValue();
      logDebug(`Cached value for ${key} on ${rangeKey}: ${result}`);
      return range.isBlank() ? null : range.getValue();
    }
    catch(e) {
      var error = new Error(e + " range: " + rangeKey);
      logError(error);
      return error;
    }
  },
  put: function (key, value) {
    var range = getRangeFromKey(key);
    logDebug(`Caching key ${key} on ${range} with value ${value}`);
    cacheSheet.getRange(range[0], range[1]).setValue(value);
  },
  clear: function() {
    cacheSheet.getDataRange().clear();
  }
};

function getRangeFromKey(key) {
  // Divide the key into 2 substrings
  // Hash the first 1 chars into 26 buckets, to turn into an alphabet letter
  // Hash the rest into 1000 buckets, to turn into an integer
  const firstStrLen = Math.floor(key.length / 2);
//  const a = 'a'.charCodeAt(0);
  
  var firstKey = hash(key.substring(0, firstStrLen), 1000) + 1;
  var secondKey = hash(key.substring(firstStrLen), 1000) + 1;
  return [secondKey, firstKey]; // getRange takes (row, column)
//  return String.fromCharCode(a + firstKey) + secondKey;
}

function hash(key, buckets) {
  var hash = 0, i, chr;
  for (i = 0; i < key.length; i++) {
    chr = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  // Values will be from 0 to buckets - 1
  return ((hash + 2147483647) + 1) % buckets;
}