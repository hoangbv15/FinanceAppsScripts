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
  // Hash each substring into 1000 buckets, to turn into an integer
  const firstStrLen = Math.floor(key.length / 2);
  
  // Google sheets can have maximum 10,000 columns, but only 5,000,000 cells
  // If we divide the sheet 2236 columns and 2236 rows, we get roughly 5 million buckets
  const sizeLimit = 2236; 
  var firstKey = hash(key.substring(0, firstStrLen), sizeLimit) + 1;
  var secondKey = hash(key.substring(firstStrLen), sizeLimit) + 1;
  return [secondKey, firstKey]; // getRange takes (row, column)
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

function checkForHashCollision() {
  const sheetData = parseSheet();
  const tickers = sheetData.tickers;
  const currencies = sheetData.currencies;
  
  var ranges = {};
  var collisions = [];
  
  // Get all possible keys that can store in the cache
  for (var i = 0; i < tickers.length; i++) {
    var ticker = tickers[i];
    var currency = currencies[i];
    // Construct and methods from FinanceData
    for (var [_, field] of Object.entries(DataType)) {
      var key = getCacheKey(field, ticker);
      
      // Get hash value
      var range = getRangeFromKey(key);
      range = `${range[0]}-${range[1]}`;
      // Check if there is a collision
      if (range in ranges) {
        // Collision detected!
        collisions.push(`${ranges[range]} and ${key} has a key collision at ${range}`);
      }
      else {
        // No collision, store the key value
        ranges[range] = key;
        logDebug(`No collision for key ${key}`);
      }
    }
  }
  
  if (collisions.length == 0) {
    return "OK";
  }
  throw new Error(collisions.join("\n"));
}
