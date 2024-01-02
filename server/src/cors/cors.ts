import cors, { CorsOptions } from "cors";

const whiteList = [
//   "http://127.0.0.1:3000",
//   "http://127.0.0.1:5500",
//   "http://localhost:3000",
  "http://calcalist.com"
];

const corsOptions: CorsOptions = {
  origin: whiteList,
};

const corsHandler = cors(corsOptions);

export default corsHandler;