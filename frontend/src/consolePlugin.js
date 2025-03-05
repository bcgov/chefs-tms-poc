const logError = (error) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

const logMessage = (message) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(message);
  }
};

const logWarning = (message) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(message);
  }
};

export default {
  install(app) {
    app.config.globalProperties.$error = logError;
    app.config.globalProperties.$log = logMessage;
    app.config.globalProperties.$warn = logWarning;
  },
};

export { logError, logMessage, logWarning };
