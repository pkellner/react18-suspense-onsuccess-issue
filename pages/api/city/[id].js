import cityData from "../../../data/cityData";

import Cors from "cors";
import initMiddleware from "../../../src/initMiddleware";

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["GET"],
  })
);

export default async function cityDataHandler(req, res) {
  await cors(req, res)
  let filtered = {};
  await new Promise((r) => setTimeout(r, 2000));
  filtered = cityData.filter((city) => city.id == req.query.id);
  if (filtered.length > 0) {
    res.status(200).json(filtered[0]);
  } else {
    res.status(404).json({ message: `city with id: ${(req.query.id)} not found.` });
  }
}
