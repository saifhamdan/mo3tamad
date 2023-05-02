package config

import (
	"github.com/spf13/viper"
)

type Config struct {
	// HTTP config
	HttpHost                string `mapstructure:"HTTP_HOST"`
	HttpPort                string `mapstructure:"HTTP_PORT"`
	HttpOAuthTokenExpiresIn int64  `mapstructure:"HTTP_OAUTH_TOKEN_EXPIRES_IN"`
	// Corteza config
	CortezaAPI      string `mapstructure:"CORTEZA_API"`
	CortezaEmail    string `mapstructure:"CORTEZA_EMAIL"`
	CortezaPassword string `mapstructure:"CORTEZA_PASSWORD"`
	// MySQL config
	MysqlHost     string `mapstructure:"MYSQL_HOST"`
	MysqlPort     string `mapstructure:"MYSQL_PORT"`
	MysqlUser     string `mapstructure:"MYSQL_USER"`
	MysqlPassword string `mapstructure:"MYSQL_PASSWORD"`
	MysqlDBName   string `mapstructure:"MYSQL_DB"`
	// Redis config
	RedisHost     string `mapstructure:"REDIS_HOST"`
	RedisPassword string `mapstructure:"REDIS_PASSWORD"`
	// Logging config
	LogFile string `mapstructure:"LOG_FILE"`
}

func NewConfig(path string) (*Config, error) {

	config := &Config{}

	viper.AddConfigPath(path)
	viper.SetConfigName("app")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	err := viper.ReadInConfig()
	if err != nil {
		return nil, err
	}
	err = viper.Unmarshal(config)

	return config, err
}
