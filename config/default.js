require('dotenv').config();
const { getEnvVar } = require('env-utils');


const lazyGetEnvVar = (...args) => () => getEnvVar(...args);

module.exports = {
  isDev: () => process.env.NODE_ENV === 'development',
  isProd: () => process.env.NODE_ENV === 'production',

  app: {
    port: lazyGetEnvVar('PORT', { devDefault: '8100' }),
    version: '0.0.1',
    environment: process.env.NODE_ENV || 'development',
    host: '0.0.0.0'
  }
}