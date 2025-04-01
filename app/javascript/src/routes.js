const routes = {
  root: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  quizzes: {
    questions: {
      root: "/quizzes/:slug/questions",
      build: "/quizzes/:slug/questions/build",
      edit: "/quizzes/:slug/questions/:id/edit",
    },
  },
};

export default routes;
