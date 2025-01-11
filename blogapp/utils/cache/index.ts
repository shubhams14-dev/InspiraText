// Import NodeCache module
const NodeCache = require("node-cache");

// Create a cache instance with a TTL (time-to-live) defined in the environment variables
const trendingCache = new NodeCache({
  stdTTL: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) : 3600, // Default TTL is 3600 seconds (1 hour)
});

// Export the cache instance for use in other parts of the application
export default trendingCache;
