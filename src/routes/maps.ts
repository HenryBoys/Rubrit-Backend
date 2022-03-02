import express from "express";
import axios from "axios";
import env from "../../environment";

const app = express.Router();

interface GeocodingResponse {
  results: [];
  status: string;
}

app.get('/', async (req, res) => {
  let { address } = req.query;
  if (!address) return res.status(400).json('Please provide an address');

  let response: GeocodingResponse;
  let encodedAddress = encodeURIComponent(address.toString());
  try {
    let { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${env.google.maps_api_key}`);
    response = data;
  } catch(error) {
    return res.json(error);
  }
  res.json(response.results);
});

export default app;