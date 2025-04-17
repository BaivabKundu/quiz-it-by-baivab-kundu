import {
  Clock,
  Eye,
  Notification,
  Settings as SettingsIcon,
} from "@bigbinary/neeto-icons";
import routes from "routes";
import { buildRoute } from "utils/url";

export const configurationItems = slug => [
  {
    description: "Settings for showing quiz on the public home page",
    icon: Eye,
    label: "Quiz visibility",
    name: "QUIZ_VISIBILITY",
    path: buildRoute(routes.admin.quizzes.configure.visibility, slug),
  },
  {
    description: "Settings related to timers for the quiz",
    icon: Clock,
    label: "Quiz timing",
    name: "QUIZ_TIMING",
    path: buildRoute(routes.admin.quizzes.configure.quiz_timing, slug),
  },
  {
    description: "Settings to configure options and questions preferences",
    icon: SettingsIcon,
    label: "Questions and options",
    name: "QUESTIONS_AND_OPTIONS",
    path: buildRoute(routes.admin.quizzes.configure.randomize, slug),
  },
  {
    description: "Configure email notifications",
    icon: Notification,
    label: "Email notifications",
    name: "EMAIL_NOTIFICATIONS",
    path: buildRoute(routes.admin.quizzes.configure.email_notifications, slug),
  },
];
