import { Request, Response, NextFunction } from "express";
import Team from "../../models/teams/teams.model";
import User from "../../models/users/users";
import Sequelize from "sequelize";
import Joi from "joi";
// import CustomError from "../../Errors/customError";

export const createTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      res.status(400).json({
        message: "Provide all Credentials",
        status: false,
        data: null,
      });
    }

    const newTeam = await Team.create({
      name: "Development Team",
      description: "Team responsible for software development",
    });

    res.status(200).json({
      message: "Teams created Successfully",
      status: true,
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      message: "Some Thing Went Wrong",
      status: false,
      data: null,
    });
  }
};

export const addUsersToTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { teamId, userIds } = req.body;
    console.log(teamId, userIds);

    // Fetch existing team
    const team: any = await Team.findByPk(teamId);

    if (!team) {
      return res.status(404).json({
        message: `Team with ID ${teamId} not found`,
        status: false,
        data: null,
      });
    }

    // Fetch users to add
    const usersToAdd = await User.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: userIds,
        },
      },
    });

    const existingUserIds = usersToAdd.map((user: any) => user.id);
    const missingUserIds = userIds.filter(
      (id: any) => !existingUserIds.includes(id)
    );

    if (missingUserIds.length > 0) {
      res.status(404).json({
        message: `Users with IDs [${missingUserIds.join(", ")}] not found`,
        status: false,
        data: null,
      });
      return;
    }

    // Associate users with the team
    await team.addUsers(usersToAdd);

    res.status(200).json({
      message: "Users added to team successfully",
      status: true,
      data: null,
    });
  } catch (err) {
    console.error("Error adding users to team:", err);
    res.status(400).json({
      message: "Something went wrong",
      status: false,
      data: null,
    });
  }
};

export const getUsersByTeamId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { teamId } = req.params; // Assuming teamId is passed as a route parameter

    if (teamId) {
      if (!teamId) {
        return res.status(401).json({
          message: `Please Provide Valid TeamId`,
          status: false,
          data: null,
        });
      }
    }

    // Fetch team by ID
    const team: any = await Team.findByPk(teamId);

    if (!team) {
      return res.status(401).json({
        message: `Team with ID ${teamId} not found`,
        status: false,
        data: null,
      });
    }

    // Fetch users belonging to the team
    const users = await team.getUsers({
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "TeamUsers",
          "refresh_token",
        ],
      }, // Specify attributes to exclude
    });

    res.status(200).json({
      message: `Users of team with ID ${teamId}`,
      status: true,
      data: users,
    });
  } catch (err) {
    console.error("Error fetching users of team:", err);
    res.status(400).json({
      message: "Something went wrong",
      status: false,
      data: null,
    });
  }
};

export const removeUserFromTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { teamId, userId } = req.params; // Assuming teamId and userId are passed as route parameters

    if (!teamId || !userId) {
      return res.status(401).json({
        message: `Please Provide all Required Fields`,
        status: false,
        data: null,
      });
    }

    // Fetch team by ID
    const team: any = await Team.findByPk(teamId);

    if (!team) {
      return res.status(404).json({
        message: `Team with ID ${teamId} not found`,
        status: false,
        data: null,
      });
    }

    // Fetch user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
        status: false,
        data: null,
      });
    }

    // Check if the user is associated with the team
    const isUserInTeam = await team.hasUser(user);

    if (!isUserInTeam) {
      return res.status(404).json({
        message: `User with ID ${userId} is not a member of team with ID ${teamId}`,
        status: false,
        data: null,
      });
    }

    // Remove user from the team
    await team.removeUser(user);

    res.status(200).json({
      message: `User with ID ${userId} removed from team with ID ${teamId}`,
      status: true,
      data: null,
    });
  } catch (err) {
    console.error("Error removing user from team:", err);
    res.status(400).json({
      message: "Something went wrong",
      status: false,
      data: null,
    });
  }
};

const createTeamWithUsersSchema = Joi.object({
  name: Joi.string().required(),
  userIds: Joi.array().items(Joi.number()).min(1).required(),
});

export const createTeamWithUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = createTeamWithUsersSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        status: false,
        data: null,
      });
    }
    const { name, userIds } = req.body;

    const existingTeam = await Team.findOne({ where: { name } });

    if (existingTeam) {
      return res.status(400).json({
        message: `A team with the name '${name}' already exists`,
        status: false,
        data: null,
      });
    }

    // Create the team
    const team: any = await Team.create({ name });

    // If there are user IDs provided, add users to the team
    if (userIds && userIds.length > 0) {
      const usersToAdd = await User.findAll({
        where: {
          id: {
            [Sequelize.Op.in]: userIds,
          },
        },
      });

      const existingUserIds = usersToAdd.map((user: any) => user.id);
      const missingUserIds = userIds.filter(
        (id: any) => !existingUserIds.includes(id)
      );

      if (missingUserIds.length > 0) {
        return res.status(404).json({
          message: `Users with IDs [${missingUserIds.join(", ")}] not found`,
          status: false,
          data: null,
        });
      }

      // Associate users with the team
      await team.addUsers(usersToAdd);
    }

    res.status(201).json({
      message: "Team created successfully",
      status: true,
      data: { team },
    });
  } catch (err) {
    console.error("Error creating team:", err);
    res.status(400).json({
      message: "Something went wrong",
      status: false,
      data: null,
    });
  }
};
