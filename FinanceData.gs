function getCacheKey(fieldName, ticker) {
  return `${ticker}-${fieldName}`;
}

function cacheAllData(fields, ticker, html, parser, excludedField) {
  for (var [_, field] of Object.entries(fields)) {
    if (field == excludedField) {
      continue;
    }
    cacheData(getCacheKey(field, ticker), parser(html, field));
  }
}

function getTickerFromCache(fieldName, ticker) {
  // Retrieve value from cache
  const key = getCacheKey(fieldName, ticker);
  var value = getCachedData(key);
  if (value != null) {
    logInfo(`Found cached value for ${key}: ${value}`)
  }
  return value;
}

const Currencies = {
  USD: "USD",
  GBP: "GBP"
};

const EmptyValues = new Set(["-", "N/A"]);

function getData(ticker, currency, fieldNameKey, shouldFetch, getFromNetworkFunc) {
  var fieldName = null;
  if (getFromNetworkFunc == null) {
    switch (currency) {
      case Currencies.USD:
        fieldName = FinvizFields[fieldNameKey];
        getFromNetworkFunc = getFinvizData;
        break;
      case Currencies.GBP:
        fieldName = YahooFields[fieldNameKey];
        getFromNetworkFunc = getYahooData;
        break;
    }
  }
  fieldName = fieldName == null ? fieldNameKey : fieldName;
  
  // Retrieve from cache
  var value = null;
  if (shouldFetch) {
    // Fetch from network
    value = getFromNetworkFunc(fieldName, ticker);
  }
  else {
    // Get from cache
    value = getTickerFromCache(fieldName, ticker);
  }
  if (EmptyValues.has(value)) {
    value = "";
  }
  return value;
}

function getDataCustom(ticker, fieldName, shouldFetch, getFromNetworkFunc) {
  return getData(ticker, null, fieldName, shouldFetch, function(fieldName, ticker) { return getFromNetworkFunc(ticker); });
}

// -----------------------------------------------------------------
function getDividend(ticker, currency, shouldFetch) {
  return getData(ticker, currency, "DIVIDEND", shouldFetch);
}

function getBookValue(ticker, currency, shouldFetch) {
  return getData(ticker, currency, "BOOK", shouldFetch);
}

function getPE(ticker, currency, shouldFetch) {
  return getData(ticker, currency, "PE", shouldFetch);
}

function getPB(ticker, currency, shouldFetch) {
  return getData(ticker, currency, "PB", shouldFetch);
}

function getLFCF(ticker, shouldFetch) {
  return getDataCustom(ticker, YahooFields.LFCF, shouldFetch, function(ticker) { return getYahooData(YahooFields.LFCF, ticker); });
}

function getTotalDebt(ticker, shouldFetch) {
  return getDataCustom(ticker, YahooFields.TOTALDEBT, shouldFetch, function(ticker) { return getYahooData(YahooFields.TOTALDEBT, ticker); });
}
// -----------------------------------------------------------------