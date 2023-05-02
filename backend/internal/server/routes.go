package server

import (
	"mo3tamad/pkg/authz"

	"github.com/gofiber/fiber/v2/middleware/cors"
)

func (s *Server) Register() {
	//************************ Route Grouping *******************************
	api := s.App.Group("/api")
	v1 := api.Group("/v1")

	//************************ Middlewares *******************************
	s.App.Use(cors.New())
	s.App.Use(s.Middleware.RequestsLogger)
	api.Use(s.Middleware.Protect)

	//************************ AUTH Routes *******************************
	oauthRoutes := s.App.Group("auth/oauth")
	oauthRoutes.Post("/login", s.Middleware.BasicAuthParser, s.Login)
	oauthRoutes.Delete("/logout/:session_id", s.Logout)
	oauthRoutes.Post("/refresh/token", s.RefreshToken)

	//************************ System Routes *****************************
	system := v1.Group("/system")

	// protect all system routes
	system.Use(s.Middleware.Authorization(authz.Admin))

	// Roles
	roleRoutes := system.Group("/roles")
	roleRoutes.Get("/", s.GetAllRoles)
	roleRoutes.Post("/", s.CreateRole)
	roleRoutes.Put("/:role_id", s.UpdateRole)
	roleRoutes.Delete("/:role_id", s.DeleteRole)

	// Resources
	resourceRoutes := system.Group("/resources")
	resourceRoutes.Get("/", s.GetAllResources)
	resourceRoutes.Get("/:role_id/role", s.GetAllResourcesWithRole)
	resourceRoutes.Post("/", s.CreateResource)
	resourceRoutes.Put("/:resource_id", s.UpdateResource)
	resourceRoutes.Delete("/:resource_id", s.DeleteResource)

	// Policies
	policyRoutes := system.Group("/policies")
	policyRoutes.Get("/", s.GetAllPolicies)
	policyRoutes.Get("/:role", s.GetRolePolicies)
	policyRoutes.Post("/", s.CreatePolicies)
	policyRoutes.Put("/", s.UpdatePolicy)
	policyRoutes.Delete("/", s.DeletePolicies)

	//************************ Business Routes *****************************

	// Accounts
	accountsRoutes := v1.Group("/accounts")
	accountsRoutes.Get("/", s.Middleware.Authorization(authz.Admin), s.GetAllAccounts)
	accountsRoutes.Get("/me", s.GetMyProfile)
	// this is an exeption because we need every account to be able to access it
	accountsRoutes.Get("/policies/ui", s.GetAllPoliciesRoleUI)
	accountsRoutes.Get("/:id", s.Middleware.Authorization(authz.Admin), s.GetAccount)
	accountsRoutes.Post("/", s.Middleware.Authorization(authz.Admin), s.CreateAccount)
	accountsRoutes.Delete("/:id", s.Middleware.Authorization(authz.Admin), s.DeleteAccount)
	accountsRoutes.Patch("/:id", s.Middleware.Authorization(authz.Admin), s.UpdateAccount)

	// Companies

}
