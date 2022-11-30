import core from "@actions/core";
import fs from "fs";
import { load } from "js-yaml"

const INPUT_FILE  = core.getInput('input_file') || './src/shorten.yaml';
const BUILD_FOLDER  = core.getInput('output_folder') || './build';

const template = (location) =>
  `<html><head><meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" /><meta http-equiv="Pragma" content="no-cache" /><meta http-equiv="Expires" content="0" /><meta http-equiv="REFRESH" content="0;url=${location}"/></head><body></body></html>`;

// Read the new links yaml file
const linksText = fs.readFileSync(INPUT_FILE, "utf8");

// Convert from YAML to JSON
const linksJson = load(linksText);

if (fs.existsSync(BUILD_FOLDER)){
  // Delete the _ directory
  fs.rmSync(BUILD_FOLDER, { recursive: true, force: true });
}

// Recreate the _ directory
fs.mkdirSync(BUILD_FOLDER);
fs.writeFileSync(`${BUILD_FOLDER}/shorten.yaml`, linksText)
fs.writeFileSync(`${BUILD_FOLDER}/index.html`, template("shorten.yaml"))

Object.entries(linksJson).forEach(([key, value]) => {
  const data = template(value)
  if (!fs.existsSync(`${BUILD_FOLDER}/${key}`)) {
    fs.mkdirSync(`${BUILD_FOLDER}/${key}`);
  }
  fs.writeFileSync(`${BUILD_FOLDER}/${key}/index.html`, data)
});