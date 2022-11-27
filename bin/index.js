#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_fs = __toESM(require("fs"));
var import_command_line_args = __toESM(require("command-line-args"));
var import_command_line_usage = __toESM(require("command-line-usage"));
var import_validate_npm_package_name = __toESM(require("validate-npm-package-name"));
var import_child_process = require("child_process");
var SCRIPT_OPTIONS = [
  { name: "name", alias: "n", type: String, defaultValue: "new-package" },
  { name: "description", alias: "d", type: String },
  { name: "version", alias: "v", type: String, defaultValue: "1.0.0" },
  { name: "license", alias: "t", type: String, defaultValue: "MIT" },
  { name: "private", alias: "p", type: Boolean, defaultValue: false },
  { name: "silent", alias: "s", type: Boolean, defaultValue: false },
  { name: "git", alias: "g", type: Boolean, defaultValue: true },
  { name: "help", alias: "h", type: Boolean, defaultValue: false }
];
var DESCRIPTIONS = {
  name: "The name for your new module.",
  description: "The description for your new module.",
  version: "Initial version.",
  license: "The license you choose.",
  private: "Whether or not this module should be marked as private.",
  silent: "Suppress log messages other than errors.",
  git: "Whether or not to start with git.",
  help: "Show these docs."
};
var HELP_SECTIONS = [
  {
    header: "Create New Module",
    content: "Generates a new, {italic empty} npm module. Very basic indeed."
  },
  {
    header: "Options",
    optionList: SCRIPT_OPTIONS.map((opt) => {
      const descBase = DESCRIPTIONS[opt.name];
      const defaultValue = opt.defaultValue;
      let description = descBase ? descBase : "";
      if (defaultValue !== void 0) {
        description += " {green Default value: " + defaultValue.toString() + ".}";
      }
      return {
        name: opt.name,
        alias: opt.alias,
        typeLabel: typeof opt.type(),
        description
      };
    })
  }
];
(() => {
  const options = (0, import_command_line_args.default)(SCRIPT_OPTIONS, { partial: true });
  const { _unknown, ...untouched } = options;
  if (_unknown && _unknown.length === 1) {
    untouched["name"] = _unknown[0];
  } else if (_unknown && _unknown.length > 1) {
    console.warn(
      "\u{1F914} Ambiguous usage. Not sure what you want. See the help docs...\n"
    );
    untouched["help"] = true;
  }
  const { help, git, silent, ...packageJsonValues } = untouched;
  const logger = (message) => !silent && console.log("\u2699\uFE0F  " + message);
  if (help) {
    const help2 = (0, import_command_line_usage.default)(HELP_SECTIONS);
    console.log(help2);
    process.exit(0);
  }
  logger("Validating package name");
  const { validForNewPackages, errors } = (0, import_validate_npm_package_name.default)(options.name);
  if (!validForNewPackages) {
    console.error(
      "\u26A0\uFE0F The name you have selected is not a valid package.json name."
    );
    if (errors) {
      for (const error of errors) {
        console.error("	- ", error);
      }
    }
    process.exit(1);
  }
  logger("Creating module directory");
  const dirName = packageJsonValues.name.replace("@", "").replace("/", "-");
  try {
    import_fs.default.mkdirSync(dirName);
  } catch (err) {
    if (err.code === "EEXIST")
      console.error(
        `\u{1F6D1} Directory "${dirName}" already exists. Please remove and try again or choose a new name.`
      );
    else
      console.error(`Could not create dir ${dirName}`, err);
    process.exit(1);
  }
  logger("Writing package.json");
  try {
    const packageJsonJson = JSON.stringify(packageJsonValues, null, 2);
    import_fs.default.writeFileSync(`./${dirName}/package.json`, packageJsonJson);
  } catch (err) {
    console.error(`Could not write ${dirName}/package.json`, err);
    process.exit(1);
  }
  if (git) {
    logger("Setting up git");
    const gitBaseCommand = `cd ./${dirName} && git`;
    (0, import_child_process.execSync)(`${gitBaseCommand} init`);
    (0, import_child_process.execSync)(`${gitBaseCommand} add --all`);
    (0, import_child_process.execSync)(`${gitBaseCommand} commit -m "Initial commit"`);
  }
  logger(`\u{1F389} All done. You can see your project at: ./${dirName}`);
})();
