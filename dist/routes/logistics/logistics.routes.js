"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const logistics_handler_1 = require("../../controllers/logistics/logistics.handler");
const verifyJWT_1 = __importDefault(require("../../middleware/verifyJWT"));
router.post("/create", verifyJWT_1.default, logistics_handler_1.createLogistics);
router.get("/:projectId", verifyJWT_1.default, logistics_handler_1.getLogisticsByProject);
router.delete("/delete/:logisticsId", verifyJWT_1.default, logistics_handler_1.deleteLogistics);
router.put("/update/:logisticsId", verifyJWT_1.default, logistics_handler_1.updateLogistics);
exports.default = router;
