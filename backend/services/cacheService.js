// services/cacheService.js
const redis = require('redis');

let client;

/**
 * Initializes the Redis client.
 * @returns {Promise<void>}
 */
const initializeRedisClient = async () => {
    client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    client.on('error', (error) => {
        console.error('Redis Client Error', error);
    });

    client.on('connect', () => {
        console.log('Connected to Redis');
    });

    await client.connect();
};

/**
 * Retrieves a value from the cache.
 * @param {string} key - The cache key
 * @returns {Promise<string|null>} - The cached value or null if not found
 */
const getCachedValue = async (key) => {
    if (!client) {
        throw new Error('Redis client not initialized');
    }
    return client.get(key);
};

/**
 * Sets a value in the cache.
 * @param {string} key - The cache key
 * @param {string} value - The value to cache
 * @returns {Promise<void>}
 */
const setCachedValue = async (key, value) => {
    if (!client) {
        throw new Error('Redis client not initialized');
    }
    return client.set(key, value);
};

module.exports = { getCachedValue, setCachedValue, initializeRedisClient };
