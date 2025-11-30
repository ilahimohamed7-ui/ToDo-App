import { projectService } from "../services/projectService.js";
import { User } from "../models/User.js";

//  Socket.io-Update für alle Clients im ProjektRaum senden
function emitProjectUpdate(req, project) {
  try {
    const io = req.app.get("io");          // aus app.set("io", io) in server.js
    if (!io || !project?._id) return;

    const roomId = project._id.toString();
    io.to(roomId).emit("project:updated", project);
  } catch (e) {
    console.error("Failed to emit project update:", e);
  }
}

export const projectController = {
  async getAll(req, res, next) {
    try {
      const projects = await projectService.getAll(req.user._id);
      res.json({ projects });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const { name } = req.body;
      if (!name?.trim()) {
        return res.status(400).json({ error: { message: "Name erforderlich" } });
      }
      const project = await projectService.create(req.user._id, name.trim());
      
      res.status(201).json({ project });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      await projectService.delete(req.user._id, req.params.id);
      
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  },

  async addCollaborator(req, res, next) {
    try {
      const { email } = req.body;
      const collaborator = await User.findOne({ email });
      if (!collaborator) {
        return res
          .status(404)
          .json({ error: { message: "Benutzer nicht gefunden" } });
      }

      const project = await projectService.addCollaborator(
        req.user._id,
        req.params.id,
        collaborator._id
      );

      emitProjectUpdate(req, project); //alle im Projekt updaten
      res.json({ project });
    } catch (e) {
      next(e);
    }
  },

  async addTask(req, res, next) {
    try {
      const { title, dueDateTime } = req.body;
      if (!title?.trim()) {
        return res
          .status(400)
          .json({ error: { message: "Titel erforderlich" } });
      }

      const project = await projectService.addTask(
        req.user._id,
        req.params.id,
        {
          title: title.trim(),
          completed: false,
          dueDateTime: dueDateTime ? new Date(dueDateTime) : null,
        }
      );

      emitProjectUpdate(req, project); // neue Task -> alle sehen es
      res.json({ project });
    } catch (e) {
      next(e);
    }
  },

  async updateTask(req, res, next) {
    try {
      const { projectId, taskId } = req.params;
      const project = await projectService.updateTask(
        req.user._id,
        projectId,
        taskId,
        req.body
      );

      emitProjectUpdate(req, project); //  completed toggeln
      res.json({ project });
    } catch (e) {
      next(e);
    }
  },

  async deleteTask(req, res, next) {
    try {
      const { projectId, taskId } = req.params;
      const project = await projectService.deleteTask(
        req.user._id,
        projectId,
        taskId
      );

      emitProjectUpdate(req, project); // Task gelöscht -> alle sehen es
      res.json({ project });
    } catch (e) {
      next(e);
    }
  },
};
