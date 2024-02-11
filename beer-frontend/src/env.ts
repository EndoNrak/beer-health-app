const env = process.env;

export const REACT_APP_API_URL = env.REACT_APP_API_URL || (() => {
  throw new Error("REACT_APP_API_URL is not defined.");
})();

export const REACT_APP_DOMAIN = env.REACT_APP_DOMAIN || (() => {
  throw new Error("REACT_APP_DOMAIN is not defined.");
})();

export const REACT_APP_FITBIT_AUTH_CLIENT_ID= env.REACT_APP_FITBIT_AUTH_CLIENT_ID || (() => {
  throw new Error("REACT_APP_FITBIT_AUTH_CLIENT_ID is not defined.");
})();

export const REACT_APP_FITBIT_AUTH_CLIENT_SECRET= env.REACT_APP_FITBIT_AUTH_CLIENT_SECRET || (() => {
  throw new Error("REACT_APP_FITBIT_AUTH_CLIENT_SECRET is not defined.");
})();

export const REACT_APP_COGNITO_USER_POOL_DOMAIN= env.REACT_APP_COGNITO_USER_POOL_DOMAIN || (() => {
  throw new Error("REACT_APP_COGNITO_USER_POOL_DOMAIN is not defined.");
})();

export const REACT_APP_COGNITO_AUTH_CLIENT_ID= env.REACT_APP_COGNITO_AUTH_CLIENT_ID || (() => {
  throw new Error("REACT_APP_COGNITO_AUTH_CLIENT_ID is not defined.");
})();

export const REACT_APP_COGNITO_AUTH_CLIENT_SECRET= env.REACT_APP_COGNITO_AUTH_CLIENT_SECRET || (() => {
  throw new Error("REACT_APP_COGNITO_AUTH_CLIENT_SECRET is not defined.");
})();
