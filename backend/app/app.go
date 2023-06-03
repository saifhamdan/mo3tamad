package app

import (
	"mo3tamad/config"
	"mo3tamad/internal/server"
	"mo3tamad/pkg/authz"
	"mo3tamad/pkg/cache"
	"mo3tamad/pkg/db"
	"mo3tamad/pkg/email"
	"mo3tamad/pkg/logger"
	"mo3tamad/pkg/oauth2"
	"mo3tamad/pkg/redis"

	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-playground/validator/v10"
)

func Run() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// config instant
	cfg, err := config.NewConfig(".")
	if err != nil {
		log.Panic("Error reading config", err)
	}

	// logger
	log, err := logger.NewLogger(cfg)
	if err != nil {
		log.Logger.Panicf("Error reading config: %v", err)
	}

	// MYSQL
	DBSess, err := db.NewMysqlDB(cfg)
	if err != nil {
		log.Logger.Panicf("Error connecting to MYSQL DB: %v", err)
	}

	// Redis
	redisClient, err := redis.NewRedisClient(cfg)
	if err != nil {
		log.Logger.Fatalf("Error connectting to redis service at %v", cfg.RedisHost)
	}
	if redisClient != nil {
		log.Logger.Infof("Connected to redis %s", cfg.RedisHost)
	}

	// make our cache wrapper from Redis
	cacheClient := cache.NewCache(redisClient)
	if log == nil {
		fmt.Println("Could not start a cache session")
		panic(0)
	}

	//validetor
	validate := validator.New()

	// Auto Migrate
	if err := db.Migrate(DBSess.DB); err != nil {
		fmt.Print(err)
		panic(0)
	}

	// authz
	authzObj, err := authz.NewAuthz(DBSess.DB)
	if err != nil {
		fmt.Printf("We have a problem creating authorization %v", err)
		panic(0)
	}

	// OAuth2
	oauth2 := oauth2.NewOAuth2(cacheClient, DBSess.DB, cfg)

	err = email.SendEmail([]string{"saifhamdan15@gmail.com"}, "Exam Applicant", "Hiiiii")
	if err != nil {
		fmt.Print(err)
	}

	server := server.NewServer(log, cfg, DBSess.DB, cacheClient, validate, authzObj, oauth2)

	// register API Routes
	server.Register()

	// run HTTP server
	server.App.Listen(":5000")

	if err := recover(); err != nil {
		log.Logger.Fatalf("some panic ...:", err)
	}

	// we need nice way to exit will use os package notify
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	select {
	case v := <-quit:
		fmt.Printf("signal.Notify CTRL+C: %v", v)
	case done := <-ctx.Done():
		fmt.Printf("ctx.Done: %v", done)
	}

}
