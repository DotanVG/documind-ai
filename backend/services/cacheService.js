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
    try {
        if (!client || !client.isOpen) {
            await initializeRedisClient();
        }
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
};

/**
 * Sets a value in the cache with an optional expiration.
 * @param {string} key - The cache key
 * @param {*} value - The value to cache
 * @param {number} [expireIn=3600] - Expiration time in seconds (default: 1 hour)
 */
const setCachedValue = async (key, value, expireIn = 3600) => {
    try {
        if (!client || !client.isOpen) {
            await initializeRedisClient();
        }
        await client.set(key, JSON.stringify(value), {
            EX: expireIn,
            NX: true,
        });
    } catch (error) {
        console.error('Redis set error:', error);
    }
};

// Initialize the Redis client when this module is imported
initializeRedisClient().catch(console.error);

module.exports = { getCachedValue, setCachedValue, initializeRedisClient };
