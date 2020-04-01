const lastModifiedKey = "last-modified";
const numOfPagesKey = "num-of-pages";
const refreshAfterMinutes = 5;
const maxLengthPerEntry = 20000;

const inMemoryCache = CacheService.getUserCache();

const cacheInMemory = {
  get: function (key) {
    if (isKeyOutdated(key) == true) {
      logDebug(`Cache entry for ${key} is out of date (${refreshAfterMinutes} minutes threshold)`);
      return null;
    }
    
    // Get all the pages and combine together
    var values = [];
    var numOfPages = inMemoryCache.get(getNumOfPagesKey(key));
    
    logDebug(`Cache entry for ${key} is up-to-date with ${numOfPages} pages`);
    
    for (var i = 0; i < numOfPages; i++) {
      var value = inMemoryCache.get(getPageKey(key, i));
      values.push(value);
    }
    var result = values.join();
    return result;
  },
  put: function (key, value) {
    // Paginate data to fit the cache
    var pages = [];
    for (var i = 0; i < value.length; i += maxLengthPerEntry - 1) {
      pages.push(value.substring(i, i + maxLengthPerEntry - 1));
    }
    
    logDebug(`Caching ${key} with ${pages.length} pages`);
    
    inMemoryCache.put(getNumOfPagesKey(key), pages.length);
    for (var i = 0; i < pages.length; i++) {
      inMemoryCache.put(getPageKey(key, i), pages[i]);
    }
    // Refresh last modified state
    inMemoryCache.put(getLastModifiedKey(key), Date.now())
  },
  clear: function() {
    // Not supported
  }
};

function getMinutesBetween(date1, date2) {
  var dif = date2.getTime() - date1.getTime(); 
  dif = Math.round((dif/1000)/60); 
  return dif;
}

function getLastModifiedKey(key) {
  return `${lastModifiedKey}-${key}`;
}

function getNumOfPagesKey(key) {
  return `${numOfPagesKey}-${key}`;
}

function getPageKey(key, page) {
  return `${key}-${page}`;
}

function isKeyOutdated(key) {
  var lastModified = inMemoryCache.get(getLastModifiedKey(key));
  if (lastModified != null) {
    var lastModifiedDate = new Date(0);
    lastModifiedDate.setUTCMilliseconds(lastModified);
    var now = new Date();
    var difference = getMinutesBetween(lastModifiedDate, now);
    logDebug(`Last modified: ${difference} minutes ago, last modified date: ${lastModifiedDate}`);
    if (difference < refreshAfterMinutes) {
      return false;
    }
  }
  return true;
}