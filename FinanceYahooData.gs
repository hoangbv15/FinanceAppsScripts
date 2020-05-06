const YahooFields = {
  LFCF: "Levered free cash flow",
  TOTALDEBT: "Total debt",
  FDIVIDEND: "Forward Annual Dividend Rate",
  DIVIDEND: "Trailing Annual Dividend Rate",
  BOOK: "Book Value Per Share",
  PE: "Forward P\/E",
  PB: "Price\/Book"
};

const YahooNumModifiers = {
  k: 1000,
  M: 1000000,
  B: 1000000000,
}

function getYahooUrl(ticker) {
  return `https://finance.yahoo.com/quote/${ticker}/key-statistics`;
}

function parseYahooHtml(html, fieldName) {
  var tableRegex = new RegExp(`${fieldName}<\/span>.*?<td.*?>(-?[0-9]*\.?[0-9]+|N\/A)([kbm])?(?:<\/span>)?<\/td>`, "gi");
  var match = tableRegex.exec(html);
  if (match == null) {
    return `No ${fieldName} information found in html ${html.substring(0, 200)}`;
  }
  logDebug(`Match information: ${match}`);
  var result = match[1];
  if (result > 0 && match.length > 2) {
    return result * (YahooNumModifiers[match[2]] || 1)
  }
  return result;
}

function getYahooHtmlData(ticker) {
  const key = `yahoo-${ticker}`;
  var html = UrlFetcher.fetch(getYahooUrl(ticker));
  logInfo(`Fetched html for ${key}`);
  return html;
}

function getYahooData(fieldName, ticker, fieldNameKey) {
  var html = getYahooHtmlData(ticker);
  value = parseYahooHtml(html, fieldName);
  logDebug(`Fetched data: ${value}`);
  cacheData(getCacheKey(fieldNameKey, ticker), value);
  // Pre cache all data that can be parsed from the same html
  cacheAllData(YahooFields, ticker, html, parseYahooHtml, fieldNameKey);

  if (value == "N/A") {
    value = "";
  }
  
  return value; 
}