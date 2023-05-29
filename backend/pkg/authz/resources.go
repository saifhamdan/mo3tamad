package authz

import (
	"fmt"
	"io/ioutil"
	"mo3tamad/model"

	"github.com/goccy/go-json"
	"gorm.io/gorm"
)

// Resources
const (
	// DEMO AUTHZ
	Admin = "admin_all"
	// USERS AUTHZ
	GetUsers   = "users_getall"
	GetUser    = "users_get"
	CreateUser = "users_create"
	UpdateUser = "users_update"
	DeleteUser = "users_delete"
	// EXAMS AUTHZ
	GetExams   = "exams_getall"
	GetExam    = "exams_get"
	CreateExam = "exams_create"
	UpdateExam = "exams_update"
	DeleteExam = "exams_delete"
	// REGISTER AUTHZ
	Register = "register_all"
)

// Roles
const (
	Roles_Admin     = "admin"
	Roles_Assistant = "assistant"
	Roles_User      = "user"
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

	if res.RowsAffected < 2 {
		// create admin role
		err = tx.Create(&model.Role{Desc: Roles_Admin}).Error
		if err != nil {
			return fmt.Errorf("error creating role")
		}

		// create assistant role
		err = tx.Create(&model.Role{Desc: Roles_Assistant}).Error
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

	// admin
	adminResources := append(resources[:3], resources[3+1:]...)
	rules := mapResoucesToRules(Roles_Admin, adminResources)
	authz.Enforcer.AddNamedPoliciesEx("p", rules)

	// assistant
	assistantResources := []model.Resource{}
	assistantResources = append(assistantResources, resources[2])
	assistantResources = append(assistantResources, model.Resource{
		ResourceId: resources[1].ResourceId,
		Type:       resources[1].Type,
		Desc:       resources[1].Desc,
		Status:     resources[1].Status,
		Actions: []model.Action{
			{
				ActionId:   resources[1].Actions[0].ActionId,
				ResourceId: resources[1].Actions[0].ResourceId,
				Desc:       resources[1].Actions[0].Desc,
				Checked:    resources[1].Actions[0].Checked,
			},
		},
		Model: resources[1].Model,
	})
	rules = mapResoucesToRules(Roles_Assistant, assistantResources)
	authz.Enforcer.AddNamedPoliciesEx("p", rules)

	// user
	userResources := []model.Resource{}
	userResources = append(userResources, resources[3])
	rules = mapResoucesToRules(Roles_User, userResources)
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
	for i := range r {
		for j := range r[i].Actions {
			rules = append(rules, []string{role, r[i].Desc, r[i].Actions[j].Desc})
		}
	}
	return
}
