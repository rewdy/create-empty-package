#!/usr/bin/env node

import fs from "fs";
import commandLineArgs from "command-line-args";
import commandLineUsage, { Section } from "command-line-usage";
import type { OptionDefinition } from "command-line-args";
import validatePackageName from "validate-npm-package-name";
import { execSync } from "child_process";

const SCRIPT_OPTIONS: OptionDefinition[] = [
  { name: "name", alias: "n", type: String, defaultValue: "new-module" },
  { name: "description", alias: "d", type: String },
  { name: "version", alias: "v", type: String, defaultValue: "1.0.0" },
  { name: "license", alias: "t", type: String, defaultValue: "UNLICENSED" },
  { name: "private", alias: "p", type: Boolean, defaultValue: false },
  { name: "silent", alias: "s", type: Boolean, defaultValue: false },
  { name: "git", alias: "g", type: Boolean, defaultValue: true },
  { name: "help", alias: "h", type: Boolean, defaultValue: false },
];

const DESCRIPTIONS: Record<string, string> = {
  name: "The name for your new module.",
  description: "The description for your new module.",
  version: "Initial version.",
  license: "The license you choose.",
  private: "Whether or not this module should be marked as private.",
  silent: "Suppress log messages other than errors.",
  git: "Whether or not to start with git.",
  help: "Show these docs.",
};

const HELP_SECTIONS: Section[] = [
  {
    header: "Create New Module",
    content: "Generates a new, {italic empty} npm module. Very basic indeed.",
  },
  {
    header: "Options",
    optionList: SCRIPT_OPTIONS.map((opt) => {
      const descBase = DESCRIPTIONS[opt.name];
      const defaultValue = opt.defaultValue;
      let description = descBase ? descBase : "";
      if (defaultValue !== undefined) {
        description +=
          " {green Default value: " + defaultValue.toString() + ".}";
      }
      return {
        name: opt.name,
        alias: opt.alias,
        typeLabel: typeof opt.type(),
        description: description,
      };
    }),
  },
];

(() => {
  let options = commandLineArgs(SCRIPT_OPTIONS, { partial: true });

  // Slice and dice 🔪
  const { help, git, silent, _unknown, ...packageJsonValues } = options;
  let forceHelp = false;

  if (_unknown && _unknown.length === 1) {
    options = {
      ...options,
      name: _unknown[0], // if we get one unknown arg, set it to the name.
    };
  } else if (_unknown && _unknown.length > 1) {
    console.warn(
      "🤔 Ambiguous usage. Not sure what you want. See the help docs...\n"
    );
    forceHelp = true;
  }

  const logger = (message: string) => !silent && console.log("⚙️  " + message);

  // Show help docs when requested
  if (help || forceHelp) {
    const help = commandLineUsage(HELP_SECTIONS);
    console.log(help);
    process.exit(0); // don't continue if asking for help
  }

  // Validate package.json name
  logger("Validating package name");
  const { validForNewPackages, errors } = validatePackageName(options.name);
  if (!validForNewPackages) {
    console.error(
      "⚠️ The name you have selected is not a valid package.json name."
    );
    if (errors) {
      for (const error of errors) {
        console.error("\t- ", error);
      }
    }
    process.exit(1); // we done
  }

  // Make new directory
  logger("Creating module directory");
  const dirName = packageJsonValues.name.replace("@", "").replace("/", "-");
  try {
    fs.mkdirSync(dirName);
  } catch (err: any) {
    if (err.code === "EEXIST")
      console.error(
        `🛑 Directory "${dirName}" already exists. Please remove and try again or choose a new name.`
      );
    else console.error(`Could not create dir ${dirName}`, err);
    process.exit(1);
  }

  // Write package.json
  logger("Writing package.json");
  try {
    const packageJsonJson = JSON.stringify(packageJsonValues, null, 2);
    fs.writeFileSync(`./${dirName}/package.json`, packageJsonJson);
  } catch (err: any) {
    console.error(`Could not write ${dirName}/package.json`, err);
    process.exit(1);
  }

  if (git) {
    logger("Setting up git");
    const gitBaseCommand = `cd ./${dirName} && git`;
    execSync(`${gitBaseCommand} init`);
    execSync(`${gitBaseCommand} add --all`);
    execSync(`${gitBaseCommand} commit -m "Initial commit"`);
  }

  logger(`🎉 All done. You can see your project at: ./${dirName}`);
})();
