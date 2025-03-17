import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("components/layout.tsx", [
    route("/", "routes/index.tsx", [
      index("routes/landing-page.tsx"),
      route("onboarding", "routes/onboarding.tsx"),
      route("dashboard", "routes/dashboard.tsx", [
        route("feedback", "routes/feedback.tsx"),
        route("roadmap", "routes/roadmap.tsx"),
        route("changelog", "routes/changelog.tsx"),
        route("help-center", "routes/help-center.tsx"),
      ]),
    ]),
    route("signin", "routes/signin.tsx"),
    route("forgotPassword", "routes/forgotPassword.tsx"),
    route("updatePassword", "routes/updatePassword.tsx"),
    route("signup", "routes/signup.tsx"),
  ]),
] satisfies RouteConfig;
