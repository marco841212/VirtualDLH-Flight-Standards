import {
  spawnSync
} from "node:child_process";


const npmCommand =
  process.platform === "win32"
    ? "npm.cmd"
    : "npm";


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
      npmCommand,
      [
        "exec",
        "--",
        "vite",
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
