function parseSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Portfolio");
  const metaRow = sheet.getRange("W1").getValue();
  const tickerRange = sheet.getRange(`Z${metaRow}`).getValue();
  const currencyRange = sheet.getRange(`AA${metaRow}`).getValue();
  var tickers = sheet.getRange(tickerRange).getValues();
  var currencies = sheet.getRange(currencyRange).getValues();
  
  var uniquePairs = removeDuplicates(tickers, currencies);
  return {
    tickers: uniquePairs.tickers,
    currencies: uniquePairs.currencies
  };
}

const removeDuplicates = function(tickers, currencies) {
  var tickersResult = [];
  var currenciesResult = [];
  var unique = new Set();
  // Check if there is any duplicate ticker-currency pair
  for (var i = 0; i < tickers.length; i++) {
    // Ignore empty values
    if (!tickers[i] || !currencies[i]) {
      continue;
    }
    var key = `${tickers[i]}-${currencies[i]}`;
    if (unique.has(key)) {
      continue;
    }
    unique.add(key);
    tickersResult.push(tickers[i]);
    currenciesResult.push(currencies[i]);
  }
  return {
    tickers: tickersResult,
    currencies: currenciesResult
  };
}