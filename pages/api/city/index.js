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

export default async function handler(req, res) {
  await cors(req, res)
  await new Promise((r) => setTimeout(r, 2000));
  res.status(200).json(cityData);
}
