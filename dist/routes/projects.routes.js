"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const index_1 = require("../controllers/index");
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
const index_2 = require("../controllers/index");
router.post("/create", verifyJWT_1.default, 
//   verifyRole(ROLES.admin, ROLES.user),
index_1.createProject);
router.get("/all", verifyJWT_1.default, index_2.getAllProjectsWithDetails);
router.delete("/delete/:projectId", verifyJWT_1.default, index_2.deleteProject);
router.put("/update/:projectId", verifyJWT_1.default, index_2.updateProject);
router.get("/:id", verifyJWT_1.default, index_2.getProjectDetailsWithStates);
exports.default = router;
