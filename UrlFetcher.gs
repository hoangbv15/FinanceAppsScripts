const UrlFetcher = {
  fetch: function(url) {
    var result = null;
    var attempt = 1;
    while (result == null) {
      try {
        result = UrlFetchApp.fetch(url).getContentText();
      }
      catch (e) {
        // Network error, retry
        if (!retry(attempt++)) {
          throw e;
        }
      }
    }
    return result;
  },
  DelayMs: 3000
};

// Retry with max attempt
function retry(attempt) {
  const maxRetry = 3;
  if (attempt > maxRetry) {
    return false;
  }
  // Backoff
  Utilities.sleep(UrlFetcher.DelayMs * attempt);
  return true;
}