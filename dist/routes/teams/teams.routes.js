"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const index_1 = require("../../controllers/index");
router.post("/create", index_1.createTeams);
router.post("/create/users", index_1.createTeamWithUsers);
router.post("/addUsers", index_1.addUsersToTeams);
router.get("/:teamId/users", index_1.getUsersByTeamId);
router.delete("/:teamId/users/:userId/remove", index_1.removeUserFromTeam);
exports.default = router;
