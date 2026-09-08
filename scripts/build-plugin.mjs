import {
  existsSync
} from "node:fs";

import {
  spawnSync
} from "node:child_process";

import {
  resolve
} from "node:path";


const viteCli =
  resolve(
    process.cwd(),
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


runViteBuild();
runViteBuild(
  "background"
);
