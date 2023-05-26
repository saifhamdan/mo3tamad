// By Emran A. Hamdan, Lead Architect
package db

import (
	"fmt"
	"mo3tamad/config"

	"mo3tamad/model"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// MysqlDB instant to pass to handlers
type MysqlDB struct {
	DB *gorm.DB
}

// NewMysqlDB will return a valid connection to Mysql DB Session
func NewMysqlDB(cfg *config.Config) (*MysqlDB, error) {

	dns := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.MysqlUser,
		cfg.MysqlPassword,
		cfg.MysqlHost,
		cfg.MysqlPort,
		cfg.MysqlDBName,
	)

	fmt.Println("DNS", dns)

	db, err := gorm.Open(mysql.Open(dns), &gorm.Config{
		PrepareStmt:                              true,
		DisableForeignKeyConstraintWhenMigrating: true,
		// NamingStrategy: schema.NamingStrategy{
		// 	TablePrefix:   "vfx",
		// 	SingularTable: true,
		// 	NoLowerCase:   true,
		// },
	})

	dbc := &MysqlDB{
		DB: db,
	}

	return dbc, err
}

// Migrate when you change your model, called from main only
func Migrate(db *gorm.DB) error {

	// Business
	if err := db.AutoMigrate(&model.Account{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&model.Company{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&model.Exam{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&model.Question{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&model.Option{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&model.Registration{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&model.Trans{}); err != nil {
		return err
	}

	// OAuth
	if err := db.AutoMigrate(&model.Session{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&model.Token{}); err != nil {
		return err
	}
	// Authz
	if err := db.AutoMigrate(&model.Resource{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&model.Action{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&model.Role{}); err != nil {
		return err
	}

	return nil
}
