import { Express } from "express";
import userController from "../controllers/user.controller";
import groupController from "../controllers/group.controller";
import { authenticate } from "../controllers/auth.controller";

const routes = (app: Express) => {
  // Login
  app.post("/login", userController.login);
  // Users
  app.post("/users", authenticate, userController.create);
  app.get("/users", authenticate, userController.findAll);
  app.get("/users/:id", authenticate, userController.findById);
  app.put("/users/:id", authenticate, userController.update);
  app.delete("/users/:id", authenticate, userController.delete);
  app.get("/users/:id/groups", authenticate, userController.getUserGroups);
  // Groups
  app.post("/groups", authenticate, groupController.create);
  app.get("/groups", authenticate, groupController.findAll);
  app.get("/groups/:id", authenticate, groupController.findById);
  app.put("/groups/:id", authenticate, groupController.update);
  app.delete("/groups/:id", authenticate, groupController.delete);
  app.get("/groups/:id/users", authenticate, groupController.getGroupUsers);
};

export default routes;
