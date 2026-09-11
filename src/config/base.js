const isProd = import.meta.env.PROD;
const appTitle = import.meta.env.VITE_APP_TITLE;
const baseURLProd = import.meta.env.VITE_API_BASE_URL_PROD;
const baseURLDev = import.meta.env.VITE_API_BASE_URL_DEV;
const cryptojsSecretKey = import.meta.env.VITE_CRYPTOJS_SECRET_KEY;

const baseConfig = {
  isProd,
  appTitle,
  cryptojsSecretKey,
};

const devConfig = { ...baseConfig, baseURL: baseURLDev };
const prodConfig = { ...baseConfig, baseURL: baseURLProd };

const config = isProd ? prodConfig : devConfig;

export default config;
