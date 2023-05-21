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
	//Exams
	examsRoutes := v1.Group("/exams")
	examsRoutes.Get("/", s.GetAllExams)
	examsRoutes.Get("/:id", s.GetExam)
	examsRoutes.Post("/", s.CreateExam)
	examsRoutes.Delete("/:id", s.DeleteExam)
	examsRoutes.Patch("/:id", s.UpdateExam)

	questionRoutes := v1.Group("/questions")
	questionRoutes.Get("/", s.GetAllQuestions)
	questionRoutes.Get("/:id", s.GetQuestion)
	questionRoutes.Get("/byId/:id", s.GetQuestionByExamId)
	questionRoutes.Post("/", s.CreateQuestion)
	questionRoutes.Delete("/:id", s.DeleteQuestion)
	questionRoutes.Patch("/:id", s.UpdateQuestion)

	registrationRoutes := v1.Group("/registration")
	registrationRoutes.Post("/:account_id/:exam_id", s.CreateRegister)
	registrationRoutes.Patch("/:id/start", s.StartedExam)
	registrationRoutes.Patch("/:id/finish", s.FinishedExam)
	registrationRoutes.Patch("/:id/cheat", s.UserCheated)
	registrationRoutes.Get("/byUser/:id", s.GetRegByUserId)
	registrationRoutes.Get("/byExam/:id", s.GetRegByExamId)
	registrationRoutes.Delete("/:id", s.DeleteRegistration)

	companyrouts := v1.Group("/company")
	companyrouts.Get("/", s.GetAllCompanies)
	companyrouts.Get("/:id", s.GetCompany)
	companyrouts.Post("/", s.CreateCompany)
	companyrouts.Delete("/:id", s.DeleteCompany)
	companyrouts.Patch("/:id", s.UpdateCompany)

}
