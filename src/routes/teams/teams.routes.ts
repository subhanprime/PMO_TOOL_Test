import { Router } from "express";
const router = Router();
import {
  createTeams,
  addUsersToTeams,
  getUsersByTeamId,
  removeUserFromTeam,
  createTeamWithUsers,
} from "../../controllers/index";

router.post("/create", createTeams);
router.post("/create/users", createTeamWithUsers);
router.post("/addUsers", addUsersToTeams);
router.get("/:teamId/users", getUsersByTeamId);
router.delete("/:teamId/users/:userId/remove", removeUserFromTeam);
export default router;
