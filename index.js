var nativefier = require("nativefier").default;

// @ts-check

/**
 * @type {import("nativefier/lib/options/model").NativefierOptions}
 */
var options = {
  name: "wolai", // will be inferred if not specified
  targetUrl: "https://www.wolai.com", // required
  version: "1.0.1",
  out: ".",
  icon: "./PNG/wolai_icon_512.png",
  inject: ["./src/customjs.js"],
  titleBarStyle: "hiddenInset",
};
nativefier(options, function (error, appPath) {
  if (error) {
    console.error(error);
    return;
  }
  console.log("App has been nativefied to", appPath);
});
