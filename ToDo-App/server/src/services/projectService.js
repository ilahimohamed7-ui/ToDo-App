import { Project } from "../models/Project.js";

export const projectService = {
  getAll: async (userId) => {
    return Project.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    }).sort({ createdAt: -1 });
  },

  create: async (userId, name) => {
    const project = await Project.create({ name, owner: userId });
    return project;
  },

  delete: async (userId, id) => {
    const project = await Project.findOneAndDelete({
      _id: id,
      owner: userId,
    });
    if (!project) throw new Error("Projekt nicht gefunden oder keine Berechtigung");
    return project;
  },

  addCollaborator: async (userId, projectId, collaboratorId) => {
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Projekt nicht gefunden");
    if (String(project.owner) !== String(userId))
      throw new Error("Nur der Besitzer kann teilen");

    if (!project.collaborators.includes(collaboratorId)) {
      project.collaborators.push(collaboratorId);
      await project.save();
    }
    return project;
  },

  addTask: async (userId, projectId, taskData) => {      // Tasks bearbeitet nur wenn der User Owner oder Collaborator ist,  Dann update i Subdocuments und speichere das gesamte Projekt
    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { collaborators: userId }],
    });
    if (!project) throw new Error("Projekt nicht gefunden");

    project.tasks.push(taskData);
    await project.save();
    return project;
  },

  updateTask: async (userId, projectId, taskId, updates) => {
    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { collaborators: userId }],
    });
    if (!project) throw new Error("Projekt nicht gefunden");

    const task = project.tasks.id(taskId);
    if (!task) throw new Error("Task nicht gefunden");

    Object.assign(task, updates);
    await project.save();
    return project;
  },

  deleteTask: async (userId, projectId, taskId) => {
  const project = await Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { collaborators: userId }],
  });
  if (!project) throw new Error("Projekt nicht gefunden");

  // Task im Array suchen
  const idx = project.tasks.findIndex(
    (t) => t._id.toString() === taskId.toString()
  );
  if (idx === -1) throw new Error("Task nicht gefunden");

  // Aus dem Array entfernen
  project.tasks.splice(idx, 1);

  await project.save();
  return project;
},

};
