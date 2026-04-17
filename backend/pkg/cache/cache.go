// By Emran A. Hamdan, Lead Architect
package cache

import (
	"context"
	"time"

	"github.com/go-redis/redis/v8"
)

type Cache struct {
	Redis *redis.Client
}

// NewCache return new cache instant constructor using redisClient
func NewCache(redis *redis.Client) *Cache {
	return &Cache{Redis: redis}
}

// Set Redis `SET key value [expiration]` command.
// Use expiration for `SETEX`-like behavior.
//
// Zero expiration means the key has no expiration time.
// KeepTTL is a Redis KEEPTTL option to keep existing TTL, it requires your redis-server version >= 6.0,
// otherwise you will receive an error: (error) ERR syntax error.
func (e *Cache) Set(ctx context.Context, key string, value []byte, expiration int64) error {
	return e.Redis.Set(ctx, key, string(value), time.Duration(expiration)*time.Second).Err()
}

// Get Redis `GET key` command. It returns redis.Nil error when key does not exist.
func (e *Cache) Get(ctx context.Context, key string) (string, error) {
	result, err := e.Redis.Get(ctx, key).Result()
	if err != nil {
		return "", err
	}

	return string(result), nil
}

// Get Redis `GET key` command. It returns redis.Nil error when key does not exist.
func (e *Cache) GetAll(ctx context.Context, key string) (string, error) {
	// result, err := e.redis.Sc(ctx, key).Result()
	// if err != nil {
	// 	return "", err
	// }

	// return string(result), nil
	return "", nil
}

// delete key if exists
func (e *Cache) Delete(ctx context.Context, key string) error {
	return e.Redis.Del(ctx, key).Err()
}
