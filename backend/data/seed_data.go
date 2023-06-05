package main

import (
	"log"
	"mo3tamad/config"
	"mo3tamad/model"
	"mo3tamad/pkg/authz"
	"mo3tamad/pkg/db"
	"mo3tamad/pkg/logger"
	"mo3tamad/pkg/oauth2"

	"gorm.io/gorm"
)

func main() {

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

	err = db.Migrate(DBSess.DB)
	if err != nil {
		log.Logger.Panicf("Error in mirgrating: %v", err)
	}

	tx := DBSess.DB.Begin()

	authz, err := authz.NewAuthz(DBSess.DB)
	if err != nil {
		tx.Rollback()
		log.Logger.Fatal(err)
	}

	err = authz.SeedAuthz(DBSess.DB)
	if err != nil {
		tx.Rollback()
		log.Logger.Fatal(err)
	}

	err = seedCategoiresAndLevels(tx)
	if err != nil {
		tx.Rollback()
		log.Logger.Fatal(err)
	}

	err = seedAccount(tx)
	if err != nil {
		tx.Rollback()
		log.Logger.Fatal(err)
	}

	tx.Commit()
	log.Logger.Info("data seeded successfully")
}

func seedAccount(tx *gorm.DB) error {

	company := &model.Company{
		Name:         "oracle",
		Desc:         "very well known company",
		IsVerified:   true,
		Phone_number: "0000",
	}

	err := tx.Create(company).Error
	if err != nil {
		return err
	}

	// 2. Get Role "Admin"
	roleAdmin := &model.Role{Desc: authz.Roles_Admin}
	err = tx.First(roleAdmin).Error
	if err != nil {
		return err
	}

	password, err := oauth2.EncryptPassword("admin")
	if err != nil {
		return err
	}

	adminAccount := &model.Account{
		Name:      "admin",
		Email:     "admin@company.com",
		Mobile:    "060001",
		Password:  password,
		RoleID:    roleAdmin.RoleId,
		CompanyId: company.CompanyId,
		Active:    true,
		Status:    "active",
	}
	err = tx.Create(adminAccount).Error
	if err != nil {
		return err
	}

	return nil
}

func seedCategoiresAndLevels(tx *gorm.DB) error {

	err := tx.Create(&Categories).Error
	if err != nil {
		return err

	}
	err = tx.Create(&Levels).Error
	if err != nil {
		return err
	}

	return nil
}
