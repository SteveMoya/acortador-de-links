import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";
import auth from "auth-astro";

import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [auth(), tailwind(), db(), icon()]
});