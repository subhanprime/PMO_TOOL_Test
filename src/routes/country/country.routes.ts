import { Router } from "express";
// import { handleCountry } from "../../controllers/handleCountryData/countryHandler";
import { handleCountry, handleCities, getAreasByCity } from "../../controllers";
const router = Router();

router.get("/all", handleCountry);
router.get("/cities/:countryCode", handleCities);
router.get("/cities/areas/:cityName", getAreasByCity);

export default router;
