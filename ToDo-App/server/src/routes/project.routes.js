import { Router } from "express";
import { projectController } from "../controllers/projectController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.use(auth(true));

router.get("/", projectController.getAll);
router.post("/", projectController.create);
router.delete("/:id", projectController.remove);
router.post("/:id/collaborators", projectController.addCollaborator);

router.post("/:id/tasks", projectController.addTask);
router.patch("/:projectId/tasks/:taskId", projectController.updateTask);
router.delete("/:projectId/tasks/:taskId", projectController.deleteTask);

export default router;
