"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { handleCountry } from "../../controllers/handleCountryData/countryHandler";
const controllers_1 = require("../../controllers");
const router = (0, express_1.Router)();
router.get("/all", controllers_1.handleCountry);
router.get("/cities/:countryCode", controllers_1.handleCities);
router.get("/cities/areas/:cityName", controllers_1.getAreasByCity);
exports.default = router;
