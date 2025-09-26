import dotenv from 'dotenv';

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN!; // string
export const ADMIN_BOT_TOKEN = process.env.ADMIN_BOT_TOKEN!;
export const PORT = process.env.PORT || 5000;
export const DB = process.env.DB;
export const WEB_APP_URL = process.env.WEB_APP_URL;
export const WEB_SITE_URL = process.env.WEB_SITE_URL;
export const BOT_CERTIFICATION = process.env.BOT_CERTIFICATION;