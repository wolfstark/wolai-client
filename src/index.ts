import { app, BrowserWindow, session, shell } from "electron";
import windowStateKeeper from "electron-window-state";
import * as schemeHelpers from "./schemeHelpers";
import * as schemeHandler from "./schemeHandler";

import constants from "./constants";
import * as urlHelpers from "./urlHelpers";
import config from "./config.json";
import url from "url";
import * as ipc from "./ipc";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

const configProtocol = config.protocol + ":";
const configBaseOrigin = config.baseURL;
const allowedNavigationOrigins = [
  configBaseOrigin,
  "https://accounts.google.com",
  "https://app.asana.com",
  "https://trello.com",
  "https://www.evernote.com",
  "https://docs.google.com",
  "https://slack.com",
  "https://login.microsoftonline.com",
  "https://connect.wustl.edu",
];

const allowedSubdomainsOnDomain = [
  ".okta.com",
  ".onelogin.com",
  ".jumpcloud.com",
  ".slack.com",
];

const allowedUrlPrefixes = ["https://www.google.com/accounts/"];

app.on("web-contents-created", (event, contents) => {
  contents.on("will-attach-webview", (event, webPreferences, params) => {
    params.partition = constants.electronSessionPartition;
    // if (webPreferences.preload) {
    //   if (!webPreferences.preload.startsWith("file://")) {
    //     delete webPreferences.preload;
    //   }
    // }
    // delete webPreferences.preload;
    // webPreferences.nodeIntegration = false;
    // webPreferences.webSecurity = true;
    // webPreferences.allowRunningInsecureContent = false;
    // webPreferences.experimentalFeatures = false;
    // webPreferences.enableBlinkFeatures = "";
    // let protocol;
    // try {
    //   protocol = new url.URL(params.src).protocol;
    // } catch (error) {
    //   console.error(error);
    // }
    // if ("file:" !== protocol) {
    //   event.preventDefault(); // TODO
    // }
  });
});
app.on("ready", () => {
  session
    .fromPartition(constants.electronSessionPartition)
    .setPermissionRequestHandler(
      (webContents, permission, callback, details) => {
        const urlpath = details.requestingUrl;
        const { protocol } = new url.URL(urlpath);
        // if (protocol === configProtocol) {
        callback(true);
        // } else {
        //   callback(false);
        // }
      }
    );
});
app.on("web-contents-created", (event, webContents) => {
  webContents.on("will-navigate", (event, urlpath) => {
    const { protocol, origin } = new url.URL(urlpath);
    if (
      // protocol !== configProtocol &&
      !allowedNavigationOrigins.includes(origin) &&
      !allowedSubdomainsOnDomain.find(
        (domain) => origin.startsWith("https://") && origin.endsWith(domain)
      ) &&
      !allowedUrlPrefixes.find((prefix) => urlpath.startsWith(prefix))
    ) {
      event.preventDefault();
      if (protocol === "https:" || protocol === "http:") {
        shell.openExternal(urlpath);
      }
    }
  });
  webContents.on("will-redirect", (event, urlpath, isInPlace, isMainFrame) => {
    const { protocol, origin } = new url.URL(urlpath);
    if (
      isMainFrame &&
      // protocol !== configProtocol &&
      !allowedNavigationOrigins.includes(origin) &&
      !allowedSubdomainsOnDomain.find(
        (domain) => origin.startsWith("https://") && origin.endsWith(domain)
      ) &&
      !allowedUrlPrefixes.find((prefix) => urlpath.startsWith(prefix))
    ) {
      event.preventDefault();
    }
  });
  webContents.on("new-window", async (event, urlpath) => {
    console.log("urlpath", urlpath);
    const { protocol, origin } = new url.URL(urlpath);
    if (origin !== config.baseURL) {
      event.preventDefault();
      if (protocol === "https:" || protocol === "http:") {
        shell.openExternal(urlpath);
      }
    } else {
      // TODO win
      createWindow(urlpath);
    }
  });
  webContents.on("will-prevent-unload", (event) => {
    event.preventDefault();
  });
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

function makeRelativeUrl(url) {
  try {
    new URL(url);
  } catch (error) {
    return;
  }
  const fixedUrl = schemeHelpers.fixSchemeUrl({
    url: url,
    protocol: config.protocol,
    baseUrl: config.baseURL,
  });
  const httpUrl = schemeHelpers.getHttpUrl({
    schemeUrl: fixedUrl,
    baseUrl: config.baseURL,
  });
  const relativeUrl = urlHelpers.removeBaseUrl(httpUrl);
  return relativeUrl;
}
// console.log(__dirname);

// console.log(MAIN_WINDOW_WEBPACK_ENTRY, 999);
function getIndexUrl(relativeUrl) {
  if (relativeUrl.startsWith("/")) {
    relativeUrl = relativeUrl.slice(1);
  }
  // console.log(
  //   "getIndexUrl -> MAIN_WINDOW_WEBPACK_ENTRY",
  //   MAIN_WINDOW_HTML_WEBPACK_ENTRY
  // );
  return urlHelpers.format({
    pathname: MAIN_WINDOW_WEBPACK_ENTRY,
    // protocol: "file:",
    // slashes: true,
    query: {
      path:
        // schemeHelpers.getSchemeUrl({
        //   httpUrl: config.baseURL,
        //   protocol: config.protocol,
        // }) +
        // config.baseURL + "/" + relativeUrl,
        relativeUrl,
    },
  });
}

function handleActivate(relativeUrl) {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length === 1) {
    const win = allWindows[0];
    if (relativeUrl) {
      win.webContents.loadURL(getIndexUrl(relativeUrl));
    }
    win.focus();
  } else {
    const win = createWindow(relativeUrl);
    win.focus();
  }
}

async function startup(relativeUrl) {
  // debugger;
  // const isregist = schemeHandler.registerUrlSchemeProxy();

  // await assetCache_1.assetCache.initialize();
  // await schemeHandler_1.registerUrlSchemeProxy();
  handleActivate(relativeUrl);
}

async function handleReady() {
  let relativeUrl;
  if (process.platform === "win32") {
    const { argv } = process;
    const url = argv.find((arg) => arg.startsWith(config.protocol + ":"));
    if (url) {
      relativeUrl = makeRelativeUrl(url);
    }
  }
  startup(relativeUrl);
}

const createWindow = (relativeUrl = ""): BrowserWindow => {
  const windowState = windowStateKeeper({
    defaultWidth: 1320,
    defaultHeight: 860,
  });
  const rect = {
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
  };
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    const [x, y] = focusedWindow.getPosition();
    rect.x = x + 20;
    rect.y = y + 20;
    const [width, height] = focusedWindow.getSize();
    rect.width = width;
    rect.height = height;
  }
  // Create the browser window.
  const window = new BrowserWindow({
    ...rect,
    show: false,
    backgroundColor: "#ffffff",
    titleBarStyle: "hiddenInset",
    webPreferences: {
      webviewTag: true,
      session: session.fromPartition(constants.electronSessionPartition),
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  window.once("ready-to-show", () => {
    window.show();
  });
  if (focusedWindow) {
    if (focusedWindow.isFullScreen()) {
      window.setFullScreen(true);
    }
  } else {
    if (windowState.isFullScreen) {
      window.setFullScreen(true);
    }
  }
  window.on("close", () => {
    windowState.saveState(window);
  });
  // and load the index.html of the app.
  // window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // console.log(getIndexUrl(relativeUrl))
  const url = getIndexUrl(relativeUrl);
  window.loadURL(url);
  // window.loadURL(relativeUrl);

  // Open the DevTools.
  // window.webContents.openDevTools();
  // open new window
  // app.on("web-contents-created", () => {
  //   window.webContents.on("new-window", onNewWindowHelper);
  // });

  // window.on("new-window-for-tab", onNewWindowHelper);
  return window;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", handleReady);
app.setAppUserModelId(config.desktopAppId);
app.setAsDefaultProtocolClient(config.protocol);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipc.receiveMainFromRenderer.addListener("create-window", (event, urlPath) => {
  createWindow(urlPath);
});

app.on("open-url", (event, url) => {
  event.preventDefault();
  const relativeUrl = makeRelativeUrl(url);
  if (app.isReady()) {
    handleActivate(relativeUrl);
  } else {
    app.removeListener("ready", handleReady);
    app.on("ready", async () => startup(relativeUrl));
  }
});

if (app.requestSingleInstanceLock()) {
  app.on("second-instance", (event, argv, workingDirectory) => {
    if (process.platform === "win32") {
      const url = argv.find((arg) => arg.startsWith(config.protocol + ":"));
      const urlPath = url && makeRelativeUrl(url);
      handleActivate(urlPath);
    }
  });
} else {
  app.quit();
}
