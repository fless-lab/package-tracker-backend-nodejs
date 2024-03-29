const redis = require('redis');
const bluebird = require('bluebird');

let redisClient;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

function init() {
  redisClient = redis.createClient({
    port: 6379,
    host: '127.0.0.1',
  });

  redisClient.on('connect', () => {
    console.info('Client connected to Redis...');
  });

  redisClient.on('ready', () => {
    console.info('Client connected to Redis and ready to use...');
  });

  redisClient.on('error', (err) => {
    console.error(err.message);
  });

  redisClient.on('end', () => {
    console.warn('Client disconnected from Redis');
  });

  process.on('SIGINT', () => {
    console.log('On client quit');
    redisClient.quit();
  });
}

function getClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call init() first.');
  }
  return redisClient;
}

module.exports = {
  init,
  getClient,
};