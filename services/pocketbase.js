import PocketBase from "pocketbase";
import dotenv from "dotenv";

dotenv.config();

export const pb = new PocketBase(process.env.POCKETHOST_BASE_URL);
