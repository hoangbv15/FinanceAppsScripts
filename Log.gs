const LogLevel = {
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  NONE: "NONE"
};
const LogLevelPriority = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, NONE: 4
};
var logLevel = LogLevel.WARN;

function log(level, message) {
  if (LogLevelPriority[level] < LogLevelPriority[logLevel]) {
    return;
  }
  Logger.log(`[${level}] ${message}`);
}

function logDebug(message) {
  log(LogLevel.DEBUG, message);
}

function logInfo(message) {
  log(LogLevel.INFO, message);
}

function logWarn(message) {
  log(LogLevel.WARN, message);
}

function logError(message) {
  log(LogLevel.ERROR, message);
}

function setLogLevel(level) {
  logLevel = level;
  return `Log level: ${level}`;
}

function getLogs() {
  return "Log: " + Logger.getLog();
}