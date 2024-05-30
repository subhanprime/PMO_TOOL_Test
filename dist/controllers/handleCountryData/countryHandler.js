"use strict";
// controllers/countryController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAreasByCity = exports.handleCities = exports.handleCountry = void 0;
const axios_1 = __importDefault(require("axios"));
const country_model_1 = __importDefault(require("../../models/country/country.model"));
const pgdb_1 = require("../../db/pgdb");
const areas_model_1 = __importDefault(require("../../models/areas/areas.model"));
const city_model_1 = __importDefault(require("../../models/city/city.model"));
// const username = process.env.GEO_USERNAME;
// export const handleCountry = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const url = `http://api.geonames.org/countryInfoJSON?username=subhanali12`;
//   const transaction = await sequelize.transaction();
//   try {
//     const response = await axios.get(url);
//     const countries = response.data.geonames;
//     // Use upsert for each country within a transaction
//     const promises = countries.map((country: any) =>
//       Country.upsert(country, { transaction })
//     );
//     await Promise.all(promises);
//     await transaction.commit();
//     console.log(
//       `Successfully stored ${countries.length} countries in the database.`
//     );
//     res.status(200).json({
//       message: "Successfully retrieved and stored all countries",
//       status: true,
//       count: countries.length,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Failed to fetch or store country data:", error);
//     res.status(500).json({
//       message: "Failed to retrieve or store country data",
//       status: false,
//       error: error.message,
//     });
//   }
// };
// export const handleCities = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { countryCode } = req.params; // Assuming country code is passed as a URL parameter
//   // const url = `http://api.geonames.org/citiesJSON?country=${countryCode}&username=subhanali12&maxRows=1000`;
//   const url = `http://api.geonames.org/searchJSON?formatted=true&country=${countryCode}&featureClass=P&username=subhanali12&style=full`;
//   try {
//     const response = await axios.get(url);
//     const cities = response.data.geonames;
//     if (!cities) {
//       console.error(`No cities found for country code: ${countryCode}`);
//       return res.status(404).json({
//         message: `No cities found for country code: ${countryCode}`,
//         status: false,
//       });
//     }
//     console.log(
//       `Successfully retrieved ${cities.length} cities for country code: ${countryCode}.`
//     );
//     // const cityNames = cities;
//     const cityDetails = cities.map((city: any) => ({
//       cityName: city.name,
//       asciiName: city.asciiName,
//       countryId: city.countryId,
//       countryCode: city.countryCode,
//       continentCode: city.continentCode,
//       toponymName: city.toponymName,
//       population: city.population,
//     }));
//     res.status(200).json({
//       message: `Successfully retrieved all cities for country code: ${countryCode}`,
//       status: true,
//       cities: cityDetails,
//     });
//   } catch (error) {
//     console.error(
//       `Failed to fetch city data for country code: ${countryCode}:`,
//       error
//     );
//     res.status(500).json({
//       message: `Failed to retrieve city data for country code: ${countryCode}`,
//       status: false,
//       error: error.message,
//     });
//   }
// };
// export const getAreasByCity = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { cityName } = req.params;
//   const username = "subhanali12";
//   const url = `http://api.geonames.org/searchJSON?formatted=true&q=${encodeURIComponent(
//     cityName
//   )}&username=${username}&style=full`; // Removed featureCode for broader results
//   try {
//     const response = await axios.get(url);
//     const areas = response.data.geonames;
//     if (!areas || areas.length === 0) {
//       console.error(`No areas found for the city: ${cityName}`);
//       return res.status(404).json({
//         message: `No areas found for the city: ${cityName}`,
//         status: false,
//       });
//     }
//     const areaDetails = areas.map((area: any) => ({
//       areaName: area.name,
//       adminCode1: area.adminCode1,
//       countryCode: area.countryCode,
//       population: area.population,
//       lat: area.lat,
//       lng: area.lng,
//     }));
//     res.status(200).json({
//       message: `Areas retrieved successfully for the city: ${cityName}`,
//       status: true,
//       count: areaDetails.length,
//       areas: areaDetails,
//     });
//   } catch (error) {
//     console.error(`Error fetching areas for the city ${cityName}:`, error);
//     res.status(500).json({
//       message: `Failed to retrieve areas for the city: ${cityName}`,
//       status: false,
//       error: error.message,
//     });
//   }
// };
const handleCountry = async (req, res, next) => {
    try {
        // First, try to get the data from the database
        const countries = await country_model_1.default.findAll();
        if (countries.length > 0) {
            console.log(`Data retrieved from the database.`);
            return res.status(200).json({
                message: "Successfully retrieved all countries from the database",
                status: true,
                countries,
            });
        }
        // If no data found in the database, fetch from GeoNames API
        const url = `http://api.geonames.org/countryInfoJSON?username=subhanali12`;
        const transaction = await pgdb_1.sequelize.transaction();
        const response = await axios_1.default.get(url);
        const apiCountries = response.data.geonames;
        if (!apiCountries || apiCountries.length === 0) {
            console.error("No countries found in the API response.");
            await transaction.rollback();
            return res.status(404).json({
                message: "No countries found",
                status: false,
            });
        }
        // Use upsert for each country within a transaction
        const promises = apiCountries.map((country) => country_model_1.default.upsert(country, { transaction }));
        await Promise.all(promises);
        await transaction.commit();
        console.log(`Successfully stored ${apiCountries.length} countries in the database.`);
        res.status(200).json({
            message: "Successfully retrieved and stored all countries",
            status: true,
            count: apiCountries.length,
            countries: apiCountries,
        });
    }
    catch (error) {
        // await transaction.rollback();
        console.error("Failed to fetch or store country data:", error);
        res.status(500).json({
            message: "Failed to retrieve or store country data",
            status: false,
            error: error.message,
        });
    }
};
exports.handleCountry = handleCountry;
const handleCities = async (req, res, next) => {
    const { countryCode } = req.params;
    try {
        // First, try to get the data from the database
        let cities = await city_model_1.default.findAll({
            where: { countryCode },
        });
        if (cities.length > 0) {
            console.log(`Data retrieved from the database for country code: ${countryCode}`);
            return res.status(200).json({
                message: `Successfully retrieved all cities from the database for country code: ${countryCode}`,
                status: true,
                cities,
            });
        }
        // If no data found in the database, fetch from GeoNames API
        const url = `http://api.geonames.org/searchJSON?formatted=true&country=${countryCode}&featureClass=P&username=subhanali12&style=full`;
        const response = await axios_1.default.get(url);
        const geoCities = response.data.geonames;
        if (!geoCities || geoCities.length === 0) {
            console.error(`No cities found for country code: ${countryCode}`);
            return res.status(404).json({
                message: `No cities found for country code: ${countryCode}`,
                status: false,
            });
        }
        // Process each city from the API response and upsert into the database
        const upsertPromises = geoCities.map((city) => {
            return city_model_1.default.upsert({
                cityName: city.name,
                asciiName: city.asciiName,
                countryId: city.geonameId, // Assuming countryId should be geonameId
                countryCode: city.countryCode,
                continentCode: city.continentCode,
                toponymName: city.toponymName,
                population: city.population,
                countryName: city.countryName, // Assuming this data is available in the response
            });
        });
        // Wait for all upserts to complete
        await Promise.all(upsertPromises);
        // Fetch the newly inserted/updated data
        cities = await city_model_1.default.findAll({
            where: { countryCode },
        });
        console.log(`Data fetched from API and stored in database for country code: ${countryCode}`);
        res.status(200).json({
            message: `Successfully retrieved and stored all cities for country code: ${countryCode}`,
            status: true,
            cities,
        });
    }
    catch (error) {
        console.error(`Failed to fetch city data for country code: ${countryCode}:`, error);
        res.status(500).json({
            message: `Failed to retrieve city data for country code: ${countryCode}`,
            status: false,
            error: error.message,
        });
    }
};
exports.handleCities = handleCities;
const getAreasByCity = async (req, res, next) => {
    const { cityName } = req.params;
    const username = "subhanali12";
    try {
        // First, try to get the data from the database
        let areas = await areas_model_1.default.findAll({
            where: { cityName: cityName },
        });
        // If data is not found in the database, fetch from GeoNames API
        if (areas.length === 0) {
            const url = `http://api.geonames.org/searchJSON?formatted=true&q=${encodeURIComponent(cityName)}&username=${username}&style=full`;
            const response = await axios_1.default.get(url);
            const geoAreas = response.data.geonames;
            if (!geoAreas || geoAreas.length === 0) {
                console.error(`No areas found for the city: ${cityName}`);
                return res.status(404).json({
                    message: `No areas found for the city: ${cityName}`,
                    status: false,
                });
            }
            // Process each area from the API response and upsert into the database
            const upsertPromises = geoAreas.map((area) => {
                return areas_model_1.default.upsert({
                    cityName: cityName,
                    areaName: area.name,
                    adminCode1: area.adminCode1,
                    countryCode: area.countryCode,
                    population: area.population,
                    lat: area.lat,
                    lng: area.lng,
                });
            });
            // Wait for all upserts to complete
            await Promise.all(upsertPromises);
            // Fetch the newly inserted data to ensure consistency
            areas = await areas_model_1.default.findAll({
                where: { cityName: cityName },
            });
        }
        // Map the areas for response
        const areaDetails = areas.map((area) => ({
            areaName: area.areaName,
            adminCode1: area.adminCode1,
            countryCode: area.countryCode,
            population: area.population,
            cityName: area.cityName,
            lat: area.lat,
            lng: area.lng,
        }));
        res.status(200).json({
            message: `Areas retrieved successfully for the city: ${cityName}`,
            status: true,
            count: areaDetails.length,
            areas: areaDetails,
        });
    }
    catch (error) {
        console.error(`Error fetching areas for the city ${cityName}:`, error);
        res.status(500).json({
            message: `Failed to retrieve areas for the city: ${cityName}`,
            status: false,
            error: error.message,
        });
    }
};
exports.getAreasByCity = getAreasByCity;
