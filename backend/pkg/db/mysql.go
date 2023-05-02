// By Emran A. Hamdan, Lead Architect
package db

import (
	"fmt"
	"mo3tamad/config"
	"mo3tamad/pkg/authz"
	"mo3tamad/pkg/oauth2"

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
		PrepareStmt: true,
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
func Migrate(cfg *config.Config) error {
	db, err := NewMysqlDB(cfg)
	if err != nil {
		fmt.Println(err)
	}

	// Business
	db.DB.AutoMigrate(&model.Account{})
	// OAuth
	db.DB.AutoMigrate(&model.Session{})
	db.DB.AutoMigrate(&model.Token{})
	// Authz
	db.DB.AutoMigrate(&model.Resource{})
	db.DB.AutoMigrate(&model.Action{})
	db.DB.AutoMigrate(&model.Role{})

	return nil
}

func SeedData(db *gorm.DB) error {

	tx := db.Begin()

	// 2. Get Role "Admin"
	roleAdmin := &model.Role{Desc: authz.Roles_Admin}
	err := tx.First(roleAdmin).Error
	if err != nil {
		return err
	}

	password, err := oauth2.EncryptPassword("admin")
	if err != nil {
		return err
	}

	adminAccount := &model.Account{
		Name:     "admin",
		Email:    "admin@company.com",
		Mobile:   "060001",
		Password: password,
		RoleID:   roleAdmin.RoleId,
		Active:   true,
		Status:   "active",
	}
	err = tx.Create(adminAccount).Error
	if err != nil {
		return err
	}

	tx.Commit()
	return nil
}
