var nativefier = require("nativefier").default;
var package = require("./package.json");

const { PLATFORM } = process.env;
// @ts-check
console.log("PLATFORM", PLATFORM);

/**
 * @type {import("nativefier/lib/options/model").NativefierOptions}
 */
var options = {
  name: "wolai", // will be inferred if not specified
  targetUrl: "https://www.wolai.com", // required
  version: package.version,
  out: "./dist",
  zoom: 1.0,
  platform: PLATFORM,
  showMenuBar: false,
  disableContextMenu: true,
  icon: "./assets/wolai_icon_512.png",
  inject: [`./src/${PLATFORM}.js`],
  titleBarStyle: "hiddenInset",
  internalUrls: ".*?.wolai.*?",
  darwinDarkModeSupport: true,
  // browserwindowOptions: JSON.stringify({
  //   webPreferences: {
  //     spellcheck: false,
  //   },
  // }),
};
nativefier(options, function (error, appPath) {
  if (error) {
    console.error(error);
    return;
  }
  console.log("App has been nativefied to", appPath);
});
