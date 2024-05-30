"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUsersToTeams = exports.createTeams = void 0;
const teams_model_1 = __importDefault(require("../../models/teams/teams.model"));
const users_1 = __importDefault(require("../../models/users/users"));
const sequelize_1 = __importDefault(require("sequelize"));
const createTeams = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            res.status(400).json({
                message: "Provide all Credentials",
                status: false,
                data: null,
            });
        }
        const newTeam = await teams_model_1.default.create({
            name: "Development Team",
            description: "Team responsible for software development",
        });
        res.status(200).json({
            message: "Teams created Successfully",
            status: true,
            data: null,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Some Thing Went Wrong",
            status: false,
            data: null,
        });
    }
};
exports.createTeams = createTeams;
const addUsersToTeams = async (req, res) => {
    try {
        const userIds = [1];
        const teamId = 1;
        // Fetch existing team
        const team = await teams_model_1.default.findByPk(teamId);
        // Fetch users to add
        const usersToAdd = await users_1.default.findAll({
            where: {
                id: {
                    [sequelize_1.default.Op.in]: userIds,
                },
            },
        });
        console.log("usersToAdd", usersToAdd);
        console.log("team team teamteam ============", team);
        // Associate users with the team
        await team.addUsers(usersToAdd);
        res.status(200).json({
            message: "Users added to team successfully",
            status: true,
            data: null,
        });
    }
    catch (err) {
        console.error("Error adding users to team:", err);
        res.status(400).json({
            message: "Something went wrong",
            status: false,
            data: null,
        });
    }
};
exports.addUsersToTeams = addUsersToTeams;
