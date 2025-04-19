const routes = {
  root: "/",
  admin: {
    dashboard: "/admin/dashboard",
    signup: "/admin/signup",
    login: "/admin/login",
    quizzes: {
      questions: "/admin/quizzes/:slug/questions",
      question: {
        new: "/admin/quizzes/:slug/question/new",
        edit: "/admin/quizzes/:slug/questions/:id/edit",
      },
      submissions: "/admin/quizzes/:slug/submissions",
      configure: {
        base: "/admin/quizzes/:slug/configure",
        visibility: "/admin/quizzes/:slug/configure/visibility",
        quiz_timing: "/admin/quizzes/:slug/configure/quiz_timing",
        randomize: "/admin/quizzes/:slug/configure/randomize",
        email_notifications:
          "/admin/quizzes/:slug/configure/email_notifications",
      },
    },
    settings: {
      general: "/admin/settings/general",
      redirections: "/admin/settings/redirections",
      categories: "/admin/settings/categories",
    },
  },
  public: {
    dashboard: "/",
    register: "/register",
    quizzes: {
      register: "/quizzes/:slug/register",
      attempt: "/quizzes/:slug/attempt",
      result: "/quizzes/:slug/:userId/result",
    },
  },
};

export default routes;
