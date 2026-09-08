import {
  copyFileSync,
  existsSync,
  rmSync
} from "node:fs";

import {
  spawnSync
} from "node:child_process";

import {
  resolve
} from "node:path";


const projectRoot =
  process.cwd();

const distDir =
  resolve(
    projectRoot,
    "dist"
  );

const viteCli =
  resolve(
    projectRoot,
    "node_modules",
    "vite",
    "bin",
    "vite.js"
  );


if (!existsSync(viteCli)) {

  throw new Error(
    "Vite is not installed locally. Run npm install before building the Stratos plugin."
  );

}


function runViteBuild(
  buildTarget
) {

  const env = {
    ...process.env
  };

  if (buildTarget) {
    env.BUILD_TARGET =
      buildTarget;
  } else {
    delete env.BUILD_TARGET;
  }


  const result =
    spawnSync(
      process.execPath,
      [
        viteCli,
        "build"
      ],
      {
        stdio: "inherit",
        env
      }
    );


  if (
    result.error
  ) {

    throw result.error;

  }


  if (
    result.status !== 0
  ) {

    process.exit(
      result.status ?? 1
    );

  }

}


function copyManifestIconsToRoot() {

  const icons = [
    "icon-light.svg",
    "icon-dark.svg"
  ];


  for (const icon of icons) {

    const source =
      resolve(
        distDir,
        "assets",
        icon
      );

    const destination =
      resolve(
        distDir,
        icon
      );


    if (!existsSync(source)) {

      throw new Error(
        `Missing Stratos plugin asset: assets/${icon}`
      );

    }


    copyFileSync(
      source,
      destination
    );

  }

}


function validateDistribution() {

  const requiredFiles = [
    "plugin.json",
    "icon-light.svg",
    "icon-dark.svg",
    "ui/index.js",
    "background/index.js"
  ];


  for (const file of requiredFiles) {

    if (
      !existsSync(
        resolve(
          distDir,
          file
        )
      )
    ) {

      throw new Error(
        `Incomplete Stratos distribution: missing dist/${file}`
      );

    }

  }


  console.log(
    "Stratos distribution validated."
  );

}


rmSync(
  distDir,
  {
    recursive: true,
    force: true
  }
);


runViteBuild();
runViteBuild(
  "background"
);

copyManifestIconsToRoot();
validateDistribution();
