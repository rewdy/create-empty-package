#!/usr/bin/env node

const esbuild = require("esbuild");

/**
 * This is our build config. Note that we're targeting node. That's important.
 */
let buildConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: ["node10.4"],
  external: [
    // Not sure why esbuild can't figure these out on its own, but oh well.
    "command-line-args",
    "command-line-usage",
    "validate-npm-package-name",
  ],
  outfile: "bin/index.js",
};

(() => {
  const args = process.argv.slice(2);
  const watchMode = args.includes("--watch");

  // handle watch
  if (watchMode) {
    buildConfig = {
      ...buildConfig,
      watch: {
        onRebuild(error, result) {
          if (error) {
            console.error("😡 rebuild failed:", error);
          } else {
            console.log("😉 rebuild succeeded:", result);
          }
        },
      },
    };
  }

  const successMessage = watchMode
    ? "👀 watching codes"
    : "🎉 Script built successfully!";

  // build
  esbuild
    .build(buildConfig)
    .then((buildResult) => console.log(successMessage, buildResult))
    .catch(() => process.exit(1));
})();
