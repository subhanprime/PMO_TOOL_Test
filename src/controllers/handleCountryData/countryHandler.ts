// controllers/countryController.ts

import { Request, Response, NextFunction } from "express";
import axios from "axios";
import Country from "../../models/country/country.model";
import { sequelize } from "../../db/pgdb";
import Areas from "../../models/areas/areas.model";
import City from "../../models/city/city.model";

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

export const handleCountry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // First, try to get the data from the database
    const countries = await Country.findAll();

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
    const transaction = await sequelize.transaction();
    const response = await axios.get(url);
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
    const promises = apiCountries.map((country: any) =>
      Country.upsert(country, { transaction })
    );

    await Promise.all(promises);
    await transaction.commit();

    console.log(
      `Successfully stored ${apiCountries.length} countries in the database.`
    );

    res.status(200).json({
      message: "Successfully retrieved and stored all countries",
      status: true,
      count: apiCountries.length,
      countries: apiCountries,
    });
  } catch (error) {
    // await transaction.rollback();
    console.error("Failed to fetch or store country data:", error);
    res.status(500).json({
      message: "Failed to retrieve or store country data",
      status: false,
      error: error.message,
    });
  }
};

export const handleCities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { countryCode } = req.params;

  try {
    // First, try to get the data from the database
    let cities = await City.findAll({
      where: { countryCode },
    });

    if (cities.length > 0) {
      console.log(
        `Data retrieved from the database for country code: ${countryCode}`
      );
      return res.status(200).json({
        message: `Successfully retrieved all cities from the database for country code: ${countryCode}`,
        status: true,
        cities,
      });
    }

    // If no data found in the database, fetch from GeoNames API
    const url = `http://api.geonames.org/searchJSON?formatted=true&country=${countryCode}&featureClass=P&username=subhanali12&style=full`;
    const response = await axios.get(url);
    const geoCities = response.data.geonames;

    if (!geoCities || geoCities.length === 0) {
      console.error(`No cities found for country code: ${countryCode}`);
      return res.status(404).json({
        message: `No cities found for country code: ${countryCode}`,
        status: false,
      });
    }

    // Process each city from the API response and upsert into the database
    const upsertPromises = geoCities.map((city: any) => {
      return City.upsert({
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
    cities = await City.findAll({
      where: { countryCode },
    });

    console.log(
      `Data fetched from API and stored in database for country code: ${countryCode}`
    );
    res.status(200).json({
      message: `Successfully retrieved and stored all cities for country code: ${countryCode}`,
      status: true,
      cities,
    });
  } catch (error) {
    console.error(
      `Failed to fetch city data for country code: ${countryCode}:`,
      error
    );
    res.status(500).json({
      message: `Failed to retrieve city data for country code: ${countryCode}`,
      status: false,
      error: error.message,
    });
  }
};

export const getAreasByCity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cityName } = req.params;
  const username = "subhanali12";

  try {
    // First, try to get the data from the database
    let areas = await Areas.findAll({
      where: { cityName: cityName },
    });

    // If data is not found in the database, fetch from GeoNames API
    if (areas.length === 0) {
      const url = `http://api.geonames.org/searchJSON?formatted=true&q=${encodeURIComponent(
        cityName
      )}&username=${username}&style=full`;
      const response = await axios.get(url);
      const geoAreas = response.data.geonames;

      if (!geoAreas || geoAreas.length === 0) {
        console.error(`No areas found for the city: ${cityName}`);
        return res.status(404).json({
          message: `No areas found for the city: ${cityName}`,
          status: false,
        });
      }

      // Process each area from the API response and upsert into the database
      const upsertPromises = geoAreas.map((area: any) => {
        return Areas.upsert({
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
      areas = await Areas.findAll({
        where: { cityName: cityName },
      });
    }

    // Map the areas for response
    const areaDetails = areas.map((area: any) => ({
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
  } catch (error) {
    console.error(`Error fetching areas for the city ${cityName}:`, error);
    res.status(500).json({
      message: `Failed to retrieve areas for the city: ${cityName}`,
      status: false,
      error: error.message,
    });
  }
};
