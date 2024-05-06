import { Request, Response } from "express";
import Project from "../../models/projects";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { creater_name, scope, objective, Deliverables } = req.body;

    // Create a new Project record in the database
    const project = await Project.create({
      creater_name:"subhan ali",
      scope:"desc scipr",
      objective: objective || "Default Objective",
      Deliverables: Deliverables || "Default Deliverables",
      // Add more properties as needed...
    });

    console.log("Project created:", project);
    res.status(200).json({
      message: "Project created successfully",
      status: true,
      data: project,
    });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(400).json({
      message: "Something went wrong",
      status: false,
      data: null,
    });
  }
};
