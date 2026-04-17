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
	oauthRoutes.Post("/signup", s.Signup)
	oauthRoutes.Post("/signup/company", s.SignupCompany)
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
	accountsRoutes.Get("/company/:companyId", s.Middleware.Authorization(authz.GetUsers), s.GetAllAccountsByCompanyId)
	accountsRoutes.Get("/me", s.GetMyProfile)
	accountsRoutes.Patch("/me", s.UpdateMyProfile)
	// this is an exeption because we need every account to be able to access it
	accountsRoutes.Get("/policies/ui", s.GetAllPoliciesRoleUI)
	accountsRoutes.Get("/:id", s.Middleware.Authorization(authz.GetUser), s.GetAccount)
	accountsRoutes.Post("/", s.Middleware.Authorization(authz.CreateUser), s.CreateAccount)
	accountsRoutes.Delete("/:id", s.Middleware.Authorization(authz.DeleteUser), s.DeleteAccount)
	accountsRoutes.Patch("/:id", s.Middleware.Authorization(authz.UpdateUser), s.UpdateAccount)

	// Companies
	//Exams
	examsRoutes := v1.Group("/exams")
	examsRoutes.Get("/", s.GetAllExams)
	examsRoutes.Get("/company/:companyId", s.Middleware.Authorization(authz.GetExams), s.GetAllExamsByCompanyId)
	examsRoutes.Get("/:id", s.GetExam)
	examsRoutes.Post("/", s.Middleware.Authorization(authz.CreateExam), s.CreateExam)
	examsRoutes.Delete("/:id", s.Middleware.Authorization(authz.DeleteExam), s.DeleteExam)
	examsRoutes.Patch("/:id", s.Middleware.Authorization(authz.UpdateExam), s.UpdateExam)

	questionRoutes := v1.Group("/questions")
	questionRoutes.Get("/", s.GetAllQuestions)
	questionRoutes.Get("/:id", s.GetQuestion)
	questionRoutes.Get("/byId/:id", s.GetQuestionByExamId)
	questionRoutes.Post("/", s.CreateQuestion)
	questionRoutes.Delete("/:id", s.DeleteQuestion)
	questionRoutes.Patch("/:id", s.UpdateQuestion)

	registrationRoutes := v1.Group("/registration")
	registrationRoutes.Get("/my-exams", s.GetRegByUserId)
	registrationRoutes.Get("/:id", s.GetRegistration)
	registrationRoutes.Get("/byExam/:id", s.GetRegByExamId)
	registrationRoutes.Delete("/:id", s.DeleteRegistration)
	registrationRoutes.Patch("/:id/start", s.Middleware.Authorization(authz.Register), s.StartedExam)
	registrationRoutes.Patch("/:id/approve", s.Middleware.Authorization(authz.CreateExam), s.ApproveApplicant)
	registrationRoutes.Patch("/:id/decline", s.Middleware.Authorization(authz.CreateExam), s.DeclineApplicant)
	registrationRoutes.Patch("/:id/finish", s.Middleware.Authorization(authz.Register), s.FinishedExam)
	registrationRoutes.Patch("/:id/cheat", s.Middleware.Authorization(authz.Register), s.UserCheated)
	registrationRoutes.Post("/:account_id/:exam_id", s.Middleware.Authorization(authz.Register), s.CreateRegister)

	companyRoutes := v1.Group("/company")
	companyRoutes.Get("/", s.GetAllCompanies)
	companyRoutes.Get("/:id", s.GetCompany)
	companyRoutes.Post("/", s.CreateCompany)
	companyRoutes.Delete("/:id", s.DeleteCompany)
	companyRoutes.Patch("/:id", s.UpdateCompany)

	transRoutes := v1.Group("/trans")
	transRoutes.Post("/:transId/answer", s.UserAnswerd)
	//transRoutes.Get("/:id",s.GetUserAnswers)

	// thumbnails
	s.App.Get("/thumbnails/:thumbnailUrl", s.GetThumbnail)
	s.App.Get("/certificates/:certUrl", s.GetCertificate)

	// comments
	commentRoutes := v1.Group("/comment")
	commentRoutes.Get("/", s.GetAllComments)
	commentRoutes.Post("/", s.CreateComment)
	commentRoutes.Patch("/:id", s.UpdateComment)
	commentRoutes.Delete("/:id", s.DeleteComment)

	// categories
	categoryRoutes := v1.Group("/category")
	categoryRoutes.Get("/", s.GetAllCategories)

	// levels
	levelRoutes := v1.Group("/level")
	levelRoutes.Get("/", s.GetAllLevels)

}
