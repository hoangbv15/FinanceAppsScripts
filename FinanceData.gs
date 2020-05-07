function getCacheKey(fieldName, ticker) {
  return `${ticker}-${fieldName}`;
}

function cacheAllData(fields, ticker, html, parser, excludedField) {
  for (var [key, field] of Object.entries(fields)) {
    if (key == excludedField) {
      continue;
    }
    try {
      cacheData(getCacheKey(key, ticker), parser(html, field));
    } catch (e) {
      logWarn(e);
    }
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
     switch (currency.toString()) { // If called via arrayformula, currency is not a string!
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
    value = getFromNetworkFunc(fieldName, ticker, fieldNameKey);
  }
  else {
    // Get from cache
    value = getTickerFromCache(fieldNameKey, ticker);
  }
  if (EmptyValues.has(value)) {
    value = "";
  }
  return value;
}

function getDataCustom(ticker, fieldName, shouldFetch, getFromNetworkFunc) {
  return getDataArray(ticker, null, fieldName, shouldFetch, function(fieldName, ticker) { return getFromNetworkFunc(ticker); });
}

function getDataArray(ticker, currency, fieldNameKey, shouldFetch, getFromNetworkFunc) {
  if (ticker.map) {
    return ticker.map(function(t, i) {
      return getData(t, currency ? currency[i] : null, fieldNameKey, shouldFetch, getFromNetworkFunc); 
    });
  }
  else {
    return getData(ticker, currency, fieldNameKey, shouldFetch, getFromNetworkFunc);
  }
}

// -----------------------------------------------------------------
const DataType = {
  DIVIDEND: "DIVIDEND",
  BOOK: "BOOK",
  PE: "PE",
  PB: "PB",
  LFCF: "LFCF",
  TOTALDEBT: "TOTALDEBT"
};

function getDividend(ticker, currency, shouldFetch) {
  return getDataArray(ticker, currency, DataType.DIVIDEND, shouldFetch);
}

function getBookValue(ticker, currency, shouldFetch) {
  return getDataArray(ticker, currency, DataType.BOOK, shouldFetch);
}

function getPE(ticker, currency, shouldFetch) {
  return getDataArray(ticker, currency, DataType.PE, shouldFetch);
}

function getPB(ticker, currency, shouldFetch) {
  return getDataArray(ticker, currency, DataType.PB, shouldFetch);
}

function getLFCF(ticker, shouldFetch) {
  return getDataCustom(ticker, DataType.LFCF, shouldFetch, function(ticker) { return getYahooData(YahooFields.LFCF, ticker, DataType.LFCF); });
}

function getTotalDebt(ticker, shouldFetch) {
  return getDataCustom(ticker, DataType.TOTALDEBT, shouldFetch, function(ticker) { return getYahooData(YahooFields.TOTALDEBT, ticker, DataType.TOTALDEBT); });
}
// -----------------------------------------------------------------

function cacheCustomData() {
  cacheData("OGZD.IL-DIVIDEND", 0.5);
  cacheData("IUKD.L-DIVIDEND", 0.4697);
}