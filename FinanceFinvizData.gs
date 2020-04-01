const FinvizFields = {
  DIVIDEND: "Dividend", 
  BOOK: "Book\/sh", 
  PE: "P\/E", 
  PB: "P\/B"
};

function getFinvizUrl(ticker) {
  return `https://finviz.com/quote.ashx?t=${ticker}`;
}

function trimSpan(html) {
  var spanRegex = new RegExp("<span.*>(.*)<\/span>");
  var match = spanRegex.exec(html);
  if (match == null) {
    return html;
  }
  return match[1];
}

function parseFinvizHtml(html, fieldName) {
  var tableRegex = new RegExp(`${fieldName}<\/td>.*<b>(.*)<\/b>`, "gi");
  var match = tableRegex.exec(html);
  if (match == null) {
    throw new Error(`No ${fieldName} information found in html ${html.substring(0, 200)}`);
  }
  var result = match[1];
  return trimSpan(result);
}

function getFinvizHtmlData(ticker) {
  const key = `finviz-${ticker}`;
  var html = UrlFetcher.fetch(getFinvizUrl(ticker));
  logInfo(`Fetched html for ${key}`);
  return html;
}

function getFinvizData(fieldName, ticker) {
  var html = getFinvizHtmlData(ticker);
  value = parseFinvizHtml(html, fieldName);
  logDebug(`Fetched data: ${value}`);
  cacheData(getCacheKey(fieldName, ticker), value);
  // Pre cache all data that can be parsed from the same html
  cacheAllData(FinvizFields, ticker, html, parseFinvizHtml, fieldName);
  
  if (value == "-") {
    value = "";
  }
  return value; 
}