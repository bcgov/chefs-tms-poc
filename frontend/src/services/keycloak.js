import Keycloak from 'keycloak-js';
import { logError, logMessage, logWarning } from '~/plugins/consolePlugin';

// Initialize Keycloak instance with configuration from environment variables
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

/**
 * Initializes Keycloak and calls the provided callback if authenticated.
 * @param {Function} onAuthenticatedCallback - The callback to call once authenticated.
 */
export const initKeycloak = (onAuthenticatedCallback) => {
  keycloak
    .init({
      onLoad: 'login-required', // Redirect to login if not authenticated
      checkLoginIframe: false, // Disable login status check iframe
    })
    .then((authenticated) => {
      if (authenticated) {
        logMessage('Authenticated');
        onAuthenticatedCallback();
      } else {
        logWarning('Not authenticated');
      }
    })
    .catch((error) => {
      logError('Failed to initialize', error);
    });
};

/**
 * Initiates the login process using Keycloak.
 */
export const login = () => keycloak.login();

/**
 * Logs out the user and clears local storage and session storage.
 */
export const logout = () => {
  const logoutUrl = import.meta.env.VITE_KEYCLOAK_LOGOUT_URL;
  const idToken = keycloak.idToken;
  keycloak
    .logout({
      redirectUri: window.location.origin,
      url: `${logoutUrl}?post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}&id_token_hint=${idToken}`,
    })
    .then(() => {
      localStorage.clear();
      sessionStorage.clear();
      logMessage('Logged out and storage cleared');
    })
    .catch((error) => {
      logError('Logout failed', error);
    });
};

/**
 * Returns the current authentication token.
 * @returns {string} The authentication token.
 */
export const getToken = () => keycloak.token;

/**
 * Checks if the user is logged in.
 * @returns {boolean} True if the user is logged in, otherwise false.
 */
export const isLoggedIn = () => !!keycloak.token;

/**
 * Returns the current user's information.
 * @returns {Object} The user's information.
 */
export const getUser = () => {
  return {
    firstName: keycloak.tokenParsed.given_name,
    lastName: keycloak.tokenParsed.family_name,
    displayName: keycloak.tokenParsed.display_name,
    userName: keycloak.tokenParsed.idir_username,
    ssoUserId: keycloak.tokenParsed.idir_user_guid,
    email: keycloak.tokenParsed.email,
  };
};
