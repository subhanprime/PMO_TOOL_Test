"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const verifyJWT_1 = __importDefault(require("../../middleware/verifyJWT"));
const verifyRole_1 = __importDefault(require("../../middleware/verifyRole"));
const roles_1 = require("../../config/roles");
const router = (0, express_1.Router)();
router.post("/create", verifyJWT_1.default, (0, verifyRole_1.default)(roles_1.ROLES.admin), controllers_1.departmentCreate);
router.delete("/delete/:id", verifyJWT_1.default, (0, verifyRole_1.default)(roles_1.ROLES.admin), controllers_1.deleteDepartment);
router.get("/all", verifyJWT_1.default, controllers_1.getAllDepartments);
exports.default = router;
