"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const index_1 = require("../controllers/index");
router.get('/:email', index_1.userInfo);
router.put('/edit', index_1.EditUserInfo);
router.post('/createUser', index_1.createUser);
exports.default = router;
