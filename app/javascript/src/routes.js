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
    },
    settings: {
      base: "/admin/settings",
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
