import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    ...tsJestTransformCfg,
  },
};


// module.exports = {
//   testEnvironment: "jsdom",
//   transform: {
//   "^.+\.(ts|tsx)$": "ts-jest",
//   },
//   };