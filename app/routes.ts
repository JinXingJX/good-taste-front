// app/routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Define a layout route for the admin section
const admin = route("/admin", "routes/admin.tsx", [
  index("routes/admin/index.tsx"), // Dashboard
  route("login", "routes/admin/login.tsx"),
  route("pages", "routes/admin/pages/index.tsx"), // Page list
  route("pages/:pageKey", "routes/admin/pages/$key.tsx"), // Edit page
  route("products", "routes/admin/products/index.tsx"), // Product list/create
  route("products/:id", "routes/admin/products/$id.tsx"), // Edit product
  route("messages", "routes/admin/messages/index.tsx"), // Message list
  route("users", "routes/admin/users/index.tsx"),     // User list/create
  route("settings", "routes/admin/settings/index.tsx"), // Site Settings
]);

export default [
  // Public Routes (assuming they use a root layout)
  route("/", "routes/_layout.tsx", [ // Wrap public routes in a layout
      index("routes/index.tsx"),                  // Home
      route("about", "routes/about.tsx"),         // About Us
      route("resources", "routes/resources.tsx"), // Resources
      route("culture", "routes/culture.tsx"),     // Culture
      route("products", null, [                   // Products section
          index("routes/products/index.tsx"),       // Product list
          route(":id", "routes/products/$id.tsx"),  // Product detail
      ]),
      route("message", "routes/message.tsx"),     // Message Form
      route("contact", "routes/contact.tsx"),     // Contact Us
  ]),

  // Admin Routes (uses its own layout defined in admin.tsx)
  admin,

  // Catch-all or Not Found Route (Optional)
  // route("*", "routes/notFound.tsx"),

] satisfies RouteConfig;