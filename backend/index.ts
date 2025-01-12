import express, { Express, Request, Response } from "express";
const cors = require("cors");
import { testSolid } from "./auth/authentication";
import { checkPermissions } from "./controllers/permissions";
import {
  getDemographicDataFromPod,
  getOrderFromPod,
  getSuperplusMembers,
  handleOrder,
  signUp,
} from "./controllers/superplusMembers";

const app: Express = express();
app.use(express.json());
const port = 3000;

app.use(cors());

app
  .get("/test", async (req: Request, res: Response) => {
    await testSolid({ request: req, response: res });
  })
  .get("/orderhistory", async (req: Request, res: Response) => {
    await getOrderFromPod({ request: req, response: res });
  })
  .get("/demographicdata", async (req: Request, res: Response) => {
    await getDemographicDataFromPod({ request: req, response: res });
  })
  .get("/superplusmembers", async (req: Request, res: Response) => {
    await getSuperplusMembers({ request: req, response: res });
  })
  .get("/checkPermissions", async (req: Request, res: Response) => {
    await checkPermissions({ request: req, response: res });
  })
  .post("/signUp", async (req: Request, res: Response) => {
    await signUp({ request: req, response: res });
  })
  .post("/checkout", async (req: Request, res: Response) => {
    await handleOrder({ request: req, response: res });
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
