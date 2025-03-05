/**
 * Logs an error message to the console.
 * @param {string} error - The error message to log.
 */
const logError = (error) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

/**
 * Logs a regular message to the console.
 * @param {string} message - The message to log.
 */
const logMessage = (message) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(message);
  }
};

/**
 * Logs a warning message to the console.
 * @param {string} message - The warning message to log.
 */
const logWarning = (message) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(message);
  }
};

export default {
  /**
   * Installs the plugin, adding global logging methods to the Vue instance.
   * @param {Object} app - The Vue app instance.
   */
  install(app) {
    app.config.globalProperties.$error = logError;
    app.config.globalProperties.$log = logMessage;
    app.config.globalProperties.$warn = logWarning;
  },
};

export { logError, logMessage, logWarning };
