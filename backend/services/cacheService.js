// Placeholder cache service that doesn't use Redis

const cache = new Map();

const getCachedValue = async (key) => {
    return cache.get(key) || null;
};

const setCachedValue = async (key, value) => {
    cache.set(key, value);
};

const initializeRedisClient = async () => {
    console.log('Redis client initialization skipped in production');
};

module.exports = { getCachedValue, setCachedValue, initializeRedisClient };
