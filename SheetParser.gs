function parseSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Portfolio");
  const metaRow = sheet.getRange("W1").getValue();
  const tickerRange = sheet.getRange(`Z${metaRow}`).getValue();
  const currencyRange = sheet.getRange(`AA${metaRow}`).getValue();
  const tickers = removeEmptyValues(sheet.getRange(tickerRange).getValues());
  const currencies = removeEmptyValues(sheet.getRange(currencyRange).getValues());
  return {
    tickers: tickers,
    currencies: currencies
  };
}
