import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("/about", "routes/about.tsx"),
  route("/resources", "routes/resources.tsx"),
  route("/culture", "routes/culture.tsx"),
  route("/products", "routes/products.tsx"),
  route("/products/:id", "routes/products/$id.tsx"),
  route("/message", "routes/message.tsx"),
  route("/contact", "routes/contact.tsx"),
  route("/admin", "routes/admin.tsx", [
    index("routes/admin/index.tsx"),
    route("login", "routes/admin/login.tsx"),
    route("pages", "routes/admin/pages/index.jsx"),
    route("pages/:key", "routes/admin/pages/$key.jsx"),
    route("products", "routes/admin/products/index.tsx")
  ])
] satisfies RouteConfig;