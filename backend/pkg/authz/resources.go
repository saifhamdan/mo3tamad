package authz

import (
	"fmt"
	"io/ioutil"
	"mo3tamad/model"

	"github.com/goccy/go-json"
	"gorm.io/gorm"
)

// Assessments
const (
	Admin = "admin_all"
	User  = "user_all"
)

// Roles
const (
	Roles_Admin = "admin"
	Roles_User  = "user"
)

func (authz *Authz) SeedAuthz(db *gorm.DB) error {

	// 1. Read resources from "resources.json" file and parse it
	file, err := ioutil.ReadFile("pkg/authz/resources.json")
	if err != nil {
		return fmt.Errorf("error Reading resources file")
	}
	resources := []model.Resource{}
	err = json.Unmarshal(file, &resources)
	if err != nil {
		return fmt.Errorf("error parsing resources from json")
	}

	// 2. load resources, actions and roles to DB
	tx := db.Begin()

	// check if resouces exists
	res := tx.Find(&[]model.Resource{})
	if res.Error != nil {
		return res.Error
	}

	if res.RowsAffected == 0 {
		for i := range resources {
			actions := resources[i].Actions
			resources[i].Actions = []model.Action{}
			err = tx.Create(&resources[i]).Error
			if err != nil {
				return fmt.Errorf("error creating a resource")
			}

			for j := range actions {
				actions[j].ResourceId = resources[i].ResourceId
			}

			err = tx.Create(&actions).Error
			if err != nil {
				return fmt.Errorf("error creating a actions")
			}
			resources[i].Actions = actions
		}
	}

	// check if roles exists
	res = tx.Find(&[]model.Role{})
	if res.Error != nil {
		return res.Error
	}
	fmt.Println("rows effected", res.RowsAffected)
	fmt.Println("rows ")
	if res.RowsAffected < 2 {
		// create admin role
		err = tx.Create(&model.Role{Desc: Roles_Admin}).Error
		if err != nil {
			return fmt.Errorf("error creating role")
		}

		// create user role
		err = tx.Create(&model.Role{Desc: Roles_User}).Error
		if err != nil {
			return fmt.Errorf("error creating role")
		}
	}

	tx.Commit()

	// 3. Assign Resources to Roles using Casbin
	rules := mapResoucesToRules(Roles_Admin, resources)
	fmt.Println(rules)
	authz.Enforcer.AddNamedPoliciesEx("p", rules)

	// // 4. load casbin rules
	// // Load the policy from DB.
	err = authz.Enforcer.LoadPolicy()
	if err != nil {
		return err
	}
	authz.Enforcer.SavePolicy()

	return nil
}

func mapResoucesToRules(role string, r []model.Resource) (rules [][]string) {
	fmt.Print(r)
	for i := range r {
		for j := range r[i].Actions {
			rules = append(rules, []string{role, r[i].Desc, r[i].Actions[j].Desc})
		}
	}
	return
}
