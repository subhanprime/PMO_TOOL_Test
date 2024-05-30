"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const index_1 = require("../controllers/index");
router.put('/', index_1.resetPassword);
exports.default = router;
