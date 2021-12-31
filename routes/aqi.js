const express = require("express");
const router = express.Router();
const needle = require("needle");
const apicache = require("apicache");

//ENV variables
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_HEADER = process.env.API_KEY_HEADER;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

// Init cache
const cache = apicache.middleware;

router.get("/", cache("5 minutes"), async (req, res) => {
  // api call with optional query params
  console.log(req.query);
  let url = `${API_BASE_URL}/by-city?city=Bengaluru`;
  if (req.query.lat && req.query.lon) {
    url = `${API_BASE_URL}/by-lat-lng?lat=${req.query.lat}&lon=${req.query.lon}`;
  } else if (req.query.city) {
    url = `${API_BASE_URL}/by-city?city=${req.query.city}`;
  } else if (req.query.postalcode && req.query.country) {
    url = `${API_BASE_URL}/by-postal-code?postalcode=${req.query.postalcode}&country=${req.query.country}`;
  } else {
    res.status(400).json({
      message: "Please provide a query parameter",
      success: false,
    });
    console.log("Please provide a query parameter");
  }

  // api call
  try {
    const response = await needle("get", url, {
      headers: {
        [API_KEY_HEADER]: API_KEY_VALUE,
      },
    });
    res.status(200).json(response.body);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

module.exports = router;
