import { Login, Signup } from "components/Authentication";
import routes from "routes";

import PublicDashboard from "./_Public/Dashboard";
import QuizAttempt from "./_Public/QuizAttempt";
import QuizResult from "./_Public/QuizResult";
import Register from "./_Public/Register";
import QuizDashboard from "./Admin/Dashboard";
import ConfigureQuiz from "./Admin/Quiz/Configuration";
import QuizRandomizer from "./Admin/Quiz/Configuration/Randomizer";
import QuizTiming from "./Admin/Quiz/Configuration/Timing";
import QuizVisibility from "./Admin/Quiz/Configuration/Visibility";
import QuizQuestions from "./Admin/Quiz/Questions";
import QuestionBuilder from "./Admin/Quiz/Questions/Builder";
import SubmissionList from "./Admin/Quiz/Submissions";
import GeneralSettings from "./Admin/Settings/General";

export const getRouteConfig = (isLoggedIn, isRegistered, isSubmitted) => ({
  public: [
    { path: routes.public.dashboard, component: PublicDashboard, exact: true },
    { path: routes.public.quizzes.register, component: Register, exact: true },
    {
      path: routes.public.quizzes.attempt,
      component: QuizAttempt,
      exact: true,
      private: true,
      condition: isRegistered,
      redirect: routes.public.dashboard,
    },
    {
      path: routes.public.quizzes.result,
      component: QuizResult,
      exact: true,
      private: true,
      condition: isSubmitted,
      redirect: routes.public.dashboard,
    },
  ],
  admin: [
    { path: routes.admin.login, component: Login, exact: true },
    { path: routes.admin.signup, component: Signup, exact: true },
    {
      path: routes.admin.dashboard,
      component: QuizDashboard,
      exact: true,
      private: true,
      condition: isLoggedIn,
      redirect: routes.admin.login,
    },
    {
      path: routes.admin.quizzes.questions,
      component: QuizQuestions,
      exact: true,
      private: true,
      condition: isLoggedIn,
      redirect: routes.admin.login,
    },
    {
      path: routes.admin.quizzes.question.new,
      component: QuestionBuilder,
      exact: true,
      private: true,
      condition: isLoggedIn,
      redirect: routes.admin.login,
    },
    {
      path: routes.admin.quizzes.question.edit,
      component: QuestionBuilder,
      exact: true,
      private: true,
      condition: isLoggedIn,
      redirect: routes.admin.login,
    },
    {
      path: routes.admin.quizzes.submissions,
      component: SubmissionList,
      exact: true,
      private: true,
      condition: isLoggedIn,
      redirect: routes.admin.login,
    },
    {
      path: routes.admin.quizzes.configure.base,
      component: ConfigureQuiz,
      exact: true,
      private: true,
      condition: isLoggedIn,
      redirect: routes.admin.login,
    },
    {
      path: routes.admin.quizzes.configure.visibility,
      component: QuizVisibility,
      exact: true,
      private: true,
      condition: isLoggedIn,
      redirect: routes.admin.login,
    },
    {
      path: routes.admin.quizzes.configure.quiz_timing,
      component: QuizTiming,
      exact: true,
      private: true,
      condition: isLoggedIn,
      redirect: routes.admin.login,
    },
    {
      path: routes.admin.quizzes.configure.randomize,
      component: QuizRandomizer,
      exact: true,
      private: true,
      condition: isLoggedIn,
      redirect: routes.admin.login,
    },
    {
      path: routes.admin.settings.base,
      component: GeneralSettings,
      exact: true,
      private: true,
      condition: isLoggedIn,
      redirect: routes.admin.login,
    },
  ],
});
