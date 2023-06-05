// Admin
export const adminBreadcrumbs: Breadcrumb[] = [
  {
    label: 'Company',
  },
];

// Dashboard
export const dashboardBreadcrumbsPage: Breadcrumb[] = [
  {
    label: 'Dashboard',
    path: '/company/dashboard',
  },
];

// Exams Projects
export const examsProjectsBreadcrumbsPage: Breadcrumb[] = [
  {
    label: 'Exams Projects',
    path: '/company/exams-projects',
  },
];

// Exams Projects / new Exams Project
export const newExamProjectBreadcrumbsPage: Breadcrumb[] =
  examsProjectsBreadcrumbsPage.concat([
    {
      label: 'New Exam Project',
      path: '/company/exams-projects/new',
    },
  ]);

export const editExamProjectResultsBreadcrumbsPage = (
  data: any
): Breadcrumb[] =>
  examsProjectsBreadcrumbsPage.concat([
    {
      label: data.name,
    },
    {
      label: 'Edit',
      path: `/company/exams-projects/${data?.id}/results`,
    },
  ]);

// Exams Projects / ${Exams Project name} / Results
export const examProjectQuestionsBreadcrumbsPage = (data: any): Breadcrumb[] =>
  examsProjectsBreadcrumbsPage.concat([
    {
      label: data.name,
    },
    {
      label: 'Questions list',
      path: `/company/exams-projects/${data?.id}/questions`,
    },
  ]);

// Exams Projects / ${Exams Project name} / Results
export const examProjectQuestionNewBreadcrumbsPage = (
  data: any
): Breadcrumb[] =>
  examsProjectsBreadcrumbsPage.concat([
    {
      label: 'Questions list',
      path: `/company/exams-projects/${data?.id}/questions`,
    },
    {
      label: 'New',
      path: `/company/exams-projects/${data?.id}/questions/new`,
    },
  ]);

export const examProjectQuestionEditBreadcrumbsPage = (
  data: any
): Breadcrumb[] =>
  examsProjectsBreadcrumbsPage.concat([
    // {
    //   // label: data.desc,
    // },
    {
      label: 'Questions list',
      path: `/company/exams-projects/${data?.examId}/questions`,
    },
    {
      label: 'Edit',
      path: `/company/exams-projects/${data?.id}/questions/${data?.id}/edit`,
    },
  ]);

// Exams Projects / ${Exams Project name} / Students
export const examProjectApplicantsBreadcrumbsPage = (data: any): Breadcrumb[] =>
  examsProjectsBreadcrumbsPage.concat([
    {
      label: 'Applicants list',
      path: `/company/exams-projects/${data.id}/applicants`,
    },
  ]);

// Users
export const usersBreadcrumbsPage: Breadcrumb[] = [
  {
    label: 'Users',
    path: '/company/users',
  },
];

// Users / new User
export const newUsersBreadcrumbsPage: Breadcrumb[] =
  usersBreadcrumbsPage.concat([
    {
      label: 'New User',
      path: '/company/users/new',
    },
  ]);

// Users / edit User
export const editUsersBreadcrumbsPage = (data: any): Breadcrumb[] =>
  usersBreadcrumbsPage.concat([
    {
      label: data.name,
    },
    {
      label: 'Edit',
      path: `/company/users/${data?.id}/results`,
    },
  ]);

// Company Profile
export const companyProfileBreadcrumbsPage = (data: any): Breadcrumb[] => [
  {
    label: data.name,
  },
  {
    label: 'Company Profile',
    path: `/company/profile`,
  },
];
