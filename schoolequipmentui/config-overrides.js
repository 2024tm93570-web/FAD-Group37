// Webpack configuration override to fix setupMiddlewares issue
module.exports = function override(config, env) {
  // Fix for webpack-dev-server setupMiddlewares compatibility issue
  // This removes the setupMiddlewares option that causes issues with newer webpack-dev-server
  if (config.devServer) {
    // Remove setupMiddlewares to use default behavior
    delete config.devServer.setupMiddlewares;
    
    // Ensure onBeforeSetupMiddleware and onAfterSetupMiddleware are available
    if (!config.devServer.onBeforeSetupMiddleware) {
      config.devServer.onBeforeSetupMiddleware = undefined;
    }
    if (!config.devServer.onAfterSetupMiddleware) {
      config.devServer.onAfterSetupMiddleware = undefined;
    }
  }
  
  return config;
};

