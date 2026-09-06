import "dotenv/config";
import { StratosClient } from "./stratos/client.js";

const client = new StratosClient();

const result = await client.verifyPilot();

console.log(result);
