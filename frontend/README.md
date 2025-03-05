# Tenant Manager

This is the Tenant Manager frontend. It implements a Vue frontend with Keycloak authentication support. The Tenant Manager application allows users to log in using their standard login credentials. Once logged in, they can create a tenancy, search for users in the system to add to that tenancy, and assign roles within the tenancy.

## Configuration

The Tenant Manager frontend will require some configuration. We will need to configure the application to authenticate using a public client on the Keycloak standard realm. You can get a public client from [this link.](https://bcgov.github.io/sso-requests)

### Required .env variables

| Name                      | Description                       | Example                     |
| ------------------------- | --------------------------------- | --------------------------- |
| VITE_KEYCLOAK_URL             | This is the authorization URL for the keycloak realm | https://dev.loginproxy.gov.bc.ca/auth |
| VITE_KEYCLOAK_REALM           | The realm in the keycloak instance | standard    |
| VITE_KEYCLOAK_CLIENT_ID | The client id in the realm   | example-client-id                        |
| VITE_KEYCLOAK_LOGOUT_URL | The logout URL   | https://dev.loginproxy.gov.bc.ca.auth/realms/standard/protocol/openid-connect/logout |

### Project setup

```sh
npm install
```

### Compiles and hot-reloads for development

```sh
npm run serve
```

### Compiles and minifies for production

```sh
npm run build
```

### Lints and fixes files

```sh
npm run lint
```
