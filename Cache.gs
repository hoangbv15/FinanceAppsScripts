const getCache = function() { return cacheInSheet; };

function getCachedData(key) {
  return getCache().get(key);
}

function cacheData(key, value) {
  getCache().put(key, value);
}

function clearCache() {
  getCache().clear();
}