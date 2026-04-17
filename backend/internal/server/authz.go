// Developer: Saif Hamdan

package server

import (
	"fmt"
	"mo3tamad/model"
	"mo3tamad/pkg/oauth2"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type OldAction struct {
	Action  int  `json:"action,omitempty"`
	Checked bool `json:"checked"`
}

type Action struct {
	Action  string `json:"action,omitempty"`
	Checked bool   `json:"checked"`
}

type Resource struct {
	Resource int      `json:"resource,omitempty"`
	Actions  []Action `json:"actions,omitempty"`
}

type Policy struct {
	Role     int      `json:"role,omitempty"`
	Resource int      `json:"resource,omitempty"`
	Actions  []Action `json:"actions,omitempty"`
}

type PolicyResourceArray struct {
	Role  int        `json:"role,omitempty"`
	Rules []Resource `json:"rules,omitempty"`
}

type UpdatePolicyRequest struct {
	OldPolicy []Policy `json:"old_policy"`
	NewPolicy []Policy `json:"new_policy"`
}

// ****************************************************************************
// ************************ Roles *********************************************
// ****************************************************************************

// @Description  Get All System Roles
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200  {array}  model.Role
// @Failure      404  {object}  server.HttpResponse
// @Router 		 /api/v1/system/roles [get]
func (s *Server) GetAllRoles(c *fiber.Ctx) error {
	roles := []model.Role{}
	err := s.DB.Where("`desc` != ?", "user").Find(&roles).Error
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseOK(c, &roles)
	// return s.App.HttpResponseOK(c, roles)
}

// @Description  Create Role
// @Tags         system
// @Accept       json
// @Produce      json
// @Param request body model.Role true "query params"
// @Success      201  {object}  model.Role
// @Failure      404  {object}  server.HttpResponse
// @Param request   body model.Role true "Update Role Request"
// @Router 		 /api/v1/system/roles [post]
func (s *Server) CreateRole(c *fiber.Ctx) error {
	role := &model.Role{}

	err := c.BodyParser(role)
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}

	err = s.DB.Create(role).Error
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}

	return s.App.HttpResponseCreated(c, role)
}

// @Description  Update Role
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200  {object}  model.Role
// @Failure      404  {object}  server.HttpResponse
// @Failure      400  {object}  server.HttpResponse
// @Failure      500  {object}  server.HttpResponse
// @Param role_id   path int true "Role ID"
// @Param request   body model.Role true "Update Role Request"
// @Router 		 /api/v1/system/roles [put]
func (s *Server) UpdateRole(c *fiber.Ctx) error {
	roleId, err := c.ParamsInt("role_id")
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}

	oldRole := &model.Role{}
	err = s.DB.First(oldRole, roleId).Error
	if err == gorm.ErrRecordNotFound {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseNotFound(c, err)
	} else if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	role := &model.Role{}
	err = c.BodyParser(role)
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}

	role.RoleId = oldRole.RoleId
	role.CreatedAt = oldRole.CreatedAt
	role.CreatedBy = oldRole.CreatedBy
	//role.DeletedAt = oldRole.DeletedAt

	err = s.DB.Save(&role).Error
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}

	return s.App.HttpResponseOK(c, role)
}

// @Description  Delete Role
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      204
// @Failure      404  {object}  server.HttpResponse
// @Param role_id   path int true "Role ID"
// @Router 		 /api/v1/system/roles [delete]
func (s *Server) DeleteRole(c *fiber.Ctx) error {
	roleId, err := c.ParamsInt("role_id")
	if err != nil {
		s.Log.Logger.Error(err)
		return s.App.HttpResponseBadRequest(c, err)
	}

	role := &model.Role{}
	err = s.DB.First(role, roleId).Error
	if err == gorm.ErrRecordNotFound {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseNotFound(c, err)
	} else if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	tx := s.DB.Begin()
	res := s.DB.Delete(role, roleId)
	if res.Error != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	// delete all associated policies related to this role
	_, err = s.Authz.Enforcer.RemoveFilteredNamedPolicy("p", 0, strconv.FormatInt(int64(role.RoleId), 10))
	if err != nil {
		tx.Rollback()
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	err = s.saveChanges()
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	tx.Commit()
	return s.App.HttpResponseNoContent(c)
}

// ****************************************************************************
// ************************ Resources *****************************************
// ****************************************************************************

// @Description  Get All Resources Regardless of role
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200  {array}  model.Resource
// @Failure      404  {object}  server.HttpResponse
// @Router 		 /api/v1/system/resources [get]
func (s *Server) GetAllResources(c *fiber.Ctx) error {
	resources := []model.Resource{}
	err := s.DB.Preload("Actions").Find(&resources).Error
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	return s.App.HttpResponseOK(c, &resources)
}

// @Description  Get All Resources Regardless of role
// @Tags         system
// @Accept       json
// @Produce      json
// @Success      200  {array}  model.Resource
// @Failure      404  {object}  server.HttpResponse
// @Router 		 /api/v1/system/resources/:role_id/role [get]
func (s *Server) GetAllResourcesWithRole(c *fiber.Ctx) error {
	roleId, err := c.ParamsInt("role_id")
	if err != nil {
		s.Log.Logger.Error(err)
		return s.App.HttpResponseBadRequest(c, err)
	}

	role := &model.Role{}
	err = s.DB.First(role, roleId).Error
	if err == gorm.ErrRecordNotFound {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	} else if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	rulesStr := s.Authz.Enforcer.GetFilteredNamedPolicy("p", 0, strconv.FormatInt(int64(roleId), 10))

	// resources map point to array of actions
	rm := roleResourcesMap(rulesStr)

	resources := []model.Resource{}
	err = s.DB.Preload("Actions").Find(&resources).Error
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	for _, r := range resources {
		roleActions := rm[strconv.FormatInt(int64(r.ResourceId), 10)]
		for j, a := range r.Actions {
			for _, pa := range roleActions {
				if pa.Action == a.Desc {
					r.Actions[j].Checked = true
				}
			}
		}
	}

	return s.App.HttpResponseOK(c, &resources)
}

// Create New Resource
func (s *Server) CreateResource(c *fiber.Ctx) error {
	resource := &model.Resource{}

	err := c.BodyParser(resource)

	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}

	actions := resource.Actions
	resource.Actions = []model.Action{}
	tx := s.DB.Begin()

	err = tx.Create(resource).Error
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}

	for i := range actions {
		actions[i].ResourceId = resource.ResourceId
	}

	err = tx.Create(&actions).Error
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}

	tx.Commit()
	return s.App.HttpResponseOK(c, resource)
}

// Update Resource
func (s *Server) UpdateResource(c *fiber.Ctx) error {
	resourceId, err := c.ParamsInt("resource_id")
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}
	tx := s.DB.Begin()

	oldResource := &model.Resource{}
	err = s.DB.Preload("Actions").First(oldResource, resourceId).Error
	if err == gorm.ErrRecordNotFound {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseNotFound(c, err)
	} else if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	// delete All previous Actions
	err = tx.Where("resource_id = ?", resourceId).Delete(model.Action{}).Error
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	// update resource
	resource := &model.Resource{}
	err = c.BodyParser(resource)
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}

	resource.ResourceId = resourceId
	resource.CreatedAt = oldResource.CreatedAt
	resource.CreatedBy = oldResource.CreatedBy
	//resource.DeletedAt = oldResource.DeletedAt
	// oldActions := oldResource.Actions
	actions := resource.Actions
	// newActions := []model.Action{}
	resource.Actions = []model.Action{}

	err = s.DB.Save(resource).Error
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}

	for i := range actions {
		if actions[i].ResourceId == 0 {
			actions[i].ResourceId = resourceId
		}
	}

	err = tx.Save(&actions).Error
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}

	tx.Commit()
	return s.App.HttpResponseOK(c, resource)
}

// Delete Resource
func (s *Server) DeleteResource(c *fiber.Ctx) error {
	resourceId, err := c.ParamsInt("resource_id")
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}

	resource := &model.Resource{}

	err = s.DB.First(resource, resourceId).Error
	if err == gorm.ErrRecordNotFound {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseNotFound(c, err)
	} else if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	tx := s.DB.Begin()
	err = tx.Delete(resource, resourceId).Error
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseNotFound(c, err)
	}

	// delete All previous Actions
	err = tx.Where("resource_id = ?", resourceId).Delete(&model.Action{}).Error
	if err != nil {
		tx.Rollback()
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	// delete all associated policies related to this role
	_, err = s.Authz.Enforcer.RemoveFilteredNamedPolicy("p", 0, "", strconv.FormatInt(int64(resource.ResourceId), 10))
	if err != nil {
		tx.Rollback()
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	err = s.saveChanges()
	if err != nil {
		tx.Rollback()
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	tx.Commit()
	return s.App.HttpResponseNoContent(c)
}

// ****************************************************************************
// ************************ Policies ******************************************
// ****************************************************************************

// Get All Policies
func (s *Server) GetAllPolicies(c *fiber.Ctx) error {
	rules := s.Authz.Enforcer.GetNamedPolicy("p")

	return s.App.HttpResponseOK(c, mapStringToPolicyv2(rules))
}

// Get All Policies given RoleId
func (s *Server) GetRolePolicies(c *fiber.Ctx) error {
	role := c.Params("role")
	if role == "" {
		s.Log.Logger.Error()
		return s.App.HttpResponseBadRequest(c, fmt.Errorf("bad request, missing role"))
	}

	r := s.Authz.Enforcer.GetNamedPolicy("p")
	rp := s.Authz.Enforcer.GetFilteredNamedPolicy("p", 0, role)
	// res := mapStringToResources(r, rp)

	rm := roleResourcesMap(rp)
	res := mapStringToResources(r, rm)
	return s.App.HttpResponseOK(c, &res)
}

// Get Policies in Map belongs to a Role For UI
func (s *Server) GetAllPoliciesRoleUI(c *fiber.Ctx) error {
	// roleId, err := c.ParamsInt("role_id")
	// if err != nil {
	// 	s.Log.Logger.Error(err)
	// 	return s.App.HttpResponseBadRequest(c, err)
	// }

	client := c.Locals("client").(*oauth2.Config)

	role := &model.Role{
		Desc: client.Scope,
	}
	err := s.DB.Where(role).First(role).Error
	if err == gorm.ErrRecordNotFound {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	} else if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	rulesStr := s.Authz.Enforcer.GetFilteredNamedPolicy("p", 0, role.Desc)

	// resources map point to array of actions
	rm := roleResourcesMap(rulesStr)

	resources := []model.Resource{}
	err = s.DB.Preload("Actions").Find(&resources).Error
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}
	policiesMap := make(map[string]bool)
	for _, r := range resources {
		roleActions := rm[r.Desc]
		for _, a := range r.Actions {
			policiesMap[fmt.Sprintf("%s_%s", r.Desc, a.Desc)] = false
			for _, pa := range roleActions {
				if pa.Action == a.Desc {
					policiesMap[fmt.Sprintf("%s_%s", r.Desc, a.Desc)] = true
					break
				}
			}
		}
	}

	return s.App.HttpResponseOK(c, policiesMap)
}

// Create Policies
func (s *Server) CreatePolicies(c *fiber.Ctx) error {
	policies := []Policy{}
	err := c.BodyParser(&policies)
	if err != nil {
		s.Log.Logger.Errorf("error parsing policy struct %v", err)
		return s.App.HttpResponseBadRequest(c, fmt.Errorf("error parsing policy struct %v", err))
	}
	rulesStr := [][]string{}
	for i := range policies {
		// check role exists
		role := &model.Role{}
		err = s.DB.First(role, policies[i].Role).Error
		if err == gorm.ErrRecordNotFound {
			s.Log.Logger.Error("role id doesn't exist")
			return s.App.HttpResponseNotFound(c, fmt.Errorf("role id doesn't exist"))
		} else if err != nil {
			s.Log.Logger.Error(err.Error())
			return s.App.HttpResponseInternalServerErrorRequest(c, err)
		}

		// check resource exists
		resource := &model.Resource{}
		err = s.DB.Preload("Actions").First(resource, policies[i].Resource).Error
		if err == gorm.ErrRecordNotFound {
			s.Log.Logger.Error("resource id doesn't exist")
			return s.App.HttpResponseNotFound(c, fmt.Errorf("resource id doesn't exist"))
		} else if err != nil {
			s.Log.Logger.Error(err.Error())
			return s.App.HttpResponseInternalServerErrorRequest(c, err)
		}

		for j := range policies[i].Actions {
			action := policies[i].Actions[j].Action
			if err != nil {
				s.Log.Logger.Error(err.Error())
				return s.App.HttpResponseInternalServerErrorRequest(c, err)
			}
			doesActionExist := false
			for _, a := range resource.Actions {
				if a.Desc == action {
					doesActionExist = true
					break
				}
			}
			if !doesActionExist {
				s.Log.Logger.Error("action id doesn't exist")
				return s.App.HttpResponseNotFound(c, fmt.Errorf("action id doesn't exist"))
			}
		}

		rulesStr = append(rulesStr, policyToString(&policies[i])...)
	}

	_, err = s.Authz.Enforcer.AddNamedPolicies("p", rulesStr)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}
	err = s.saveChanges()
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseOK(c, &policies)
}

// Update Policy
func (s *Server) UpdatePolicy(c *fiber.Ctx) error {
	body := &UpdatePolicyRequest{}

	err := c.BodyParser(body)
	if err != nil {
		return s.App.HttpResponseBadRequest(c, err)
	}

	oldPolicyStr := mapPoliciesToString(body.OldPolicy)
	newPolicyStr := mapPoliciesToString(body.NewPolicy)

	updated, err := s.Authz.Enforcer.UpdatePolicies(oldPolicyStr, newPolicyStr)
	if err != nil {
		s.Log.Logger.Error(err)
		return s.App.HttpResponseBadRequest(c, err)
	}

	err = s.saveChanges()
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseOK(c, updated)
}

// Remove Policy
func (s *Server) DeletePolicies(c *fiber.Ctx) error {
	policies := []Policy{}
	err := c.BodyParser(&policies)
	if err != nil {
		s.Log.Logger.Errorf("error parsing policy struct %v", err)
		return s.App.HttpResponseBadRequest(c, err)
	}

	rulesStr := mapPoliciesToString(policies)
	_, err = s.Authz.Enforcer.RemoveNamedPolicies("p", rulesStr)
	if err != nil {
		s.Log.Logger.Error(err.Error())
		return s.App.HttpResponseBadRequest(c, err)
	}

	err = s.saveChanges()
	if err != nil {
		return s.App.HttpResponseInternalServerErrorRequest(c, err)
	}

	return s.App.HttpResponseNoContent(c)
}

// ****************************************************************************
// ************************ Local methods *************************************
// ****************************************************************************

// local methods
func (s *Server) saveChanges() error {
	return s.Authz.Enforcer.SavePolicy()
}

func policyToString(p *Policy) (rules [][]string) {
	roleStr := strconv.FormatInt(int64(p.Role), 10)
	resourceStr := strconv.FormatInt(int64(p.Resource), 10)
	for _, a := range p.Actions {
		rules = append(rules, []string{roleStr, resourceStr, a.Action})
	}
	return rules
}

func mapPoliciesToString(policies []Policy) (rules [][]string) {
	for _, p := range policies {
		rules = append(rules, policyToString(&p)...)
	}
	return
}

func roleResourcesMap(rules [][]string) map[string][]Action {
	resourceMap := make(map[string][]Action)
	for _, rr := range rules {
		resource := string(rr[1])
		action := string(rr[2])

		_, ok := resourceMap[resource]
		if !ok {
			resourceMap[resource] = []Action{}

			resourceMap[resource] = append(resourceMap[resource],
				Action{
					Action:  action,
					Checked: true,
				})
		} else {
			resourceMap[resource] = append(resourceMap[resource], Action{Action: action, Checked: true})
		}
	}
	return resourceMap
}

func mapStringToResources(rules [][]string, rolePolicyMap map[string][]Action) (resources []Resource) {
	resourceMap := make(map[string]int)
	actionsMap := make(map[string]bool)

	for _, rr := range rules {
		resource := string(rr[1])
		resourceInt, _ := strconv.Atoi(resource)
		action := string(rr[2])
		check := false
		roleActions, ok := rolePolicyMap[resource]
		if ok {
			for _, a := range roleActions {
				if a.Action == action {
					check = a.Checked
					break
				}
			}
		}

		key, ok := resourceMap[resource]
		if !ok {
			resourceMap[resource] = len(resources)
			resources = append(resources, Resource{Resource: resourceInt, Actions: []Action{
				{
					Action:  action,
					Checked: check,
				},
			}})
		} else {
			if ok := actionsMap[resource+action]; !ok {
				resources[key].Actions = append(resources[key].Actions, Action{Action: action, Checked: check})
			}
		}
		actionsMap[resource+action] = true
	}
	return
}

func mapStringToPolicyv2(rules [][]string) (policies []PolicyResourceArray) {
	roleMap := make(map[string]int)
	resourceMap := make(map[string]int)

	for _, rr := range rules {
		role := string(rr[0])
		roleInt, _ := strconv.Atoi(role)
		resource := string(rr[1])
		resourceInt, _ := strconv.Atoi(resource)
		action := string(rr[2])
		reskey := role + "-" + resource

		roleVal, ok := roleMap[role]
		if !ok {
			roleMap[role] = len(policies)
			resourceMap[reskey] = 0
			policies = append(policies,
				PolicyResourceArray{
					Role: roleInt,
					Rules: []Resource{
						{
							Resource: resourceInt,
							Actions: []Action{
								{
									Action: action, Checked: false,
								},
							},
						}},
				})
		} else {
			resVal, ok := resourceMap[reskey]
			if !ok {
				resourceMap[reskey] = len(policies[roleVal].Rules)
				newResouce := Resource{
					Resource: resourceInt,
					Actions: []Action{
						{
							Action: action, Checked: false,
						},
					},
				}
				policies[roleVal].Rules = append(policies[roleVal].Rules, newResouce)
			} else {
				policies[roleVal].Rules[resVal].Actions = append(policies[roleVal].Rules[resVal].Actions, Action{Action: action, Checked: true})
			}
		}
	}
	return
}
