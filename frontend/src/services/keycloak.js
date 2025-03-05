import Keycloak from 'keycloak-js';
import { logError, logMessage, logWarning } from '../consolePlugin';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export const initKeycloak = (onAuthenticatedCallback) => {
  keycloak
    .init({
      onLoad: 'login-required',
      checkLoginIframe: false,
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

export const login = () => keycloak.login();

export const logout = () => {
  const logoutUrl = import.meta.env.VITE_KEYCLOAK_LOGOUT_URL;
  const idToken = keycloak.idToken;
  keycloak
    .logout({
      redirectUri: window.location.origin,
      url: `${logoutUrl}?post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}&id_token_hint=${idToken}`,
    })
    .then(() => {
      // Clear all local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      logMessage('Logged out and storage cleared');
    })
    .catch((error) => {
      logError('Logout failed', error);
    });
};

export const getToken = () => keycloak.token;
export const isLoggedIn = () => !!keycloak.token;
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
