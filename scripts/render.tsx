import { config } from "dotenv";
import { buildSync } from "esbuild";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import React from "react";
import { renderToString } from "react-dom/server";

config({ quiet: true });

buildSync({
  entryPoints: ["src/**/*.ts", "src/**/*.tsx"],
  bundle: true,
  outdir: "./dist",
  format: "iife",
  minify: process.env.NODE_ENV !== "development",
  sourcemap: false,
  platform: "browser",
  tsconfig: "tsconfig.json",
  conditions: ["style"],
});

if (!existsSync("./dist")) mkdirSync("./dist");
