/// Takes tickers and currencies and precache all data periodically
function runPrecache() {
  const sheetData = parseSheet();
  const tickers = sheetData.tickers;
  const currencies = sheetData.currencies
   
  for (var i = 0; i < tickers.length; i++) {
    var ticker = tickers[i], currency = currencies[i];
    // Cache each ticker
    try {
      getDividend(ticker, currency, true);
      // TODO: currently always refetching and not reusing result from getDividend if Yahoo. Need to find a way to optimise
      getLFCF(ticker, true);
    }
    catch (e) {
      logError(`Exception while fetching ${ticker}: ${e} ${e.stack}`);
    }
    Utilities.sleep(UrlFetcher.DelayMs);
  }
}

const removeEmptyValues = function(items) {
  return items.reduce(function(ar, e) {
    if (e[0]) ar.push(e[0]);
    return ar;
  }, []);
}