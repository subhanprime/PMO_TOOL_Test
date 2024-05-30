"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_controller_1 = require("../../controllers/authentication/login.controller");
const router = (0, express_1.Router)();
router.post('/', login_controller_1.LoginControl);
exports.default = router;
