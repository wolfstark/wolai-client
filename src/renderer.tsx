/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
// import { parse } from "./urlHelpers";
import electron, { BrowserWindow } from "electron";
import path from "path";
import url from "url";
import config from "./config.json";
import process from "process";
import * as ipc from "./ipc";
import * as schemeHelpers from "./schemeHelpers";

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

const style: { [key: string]: React.CSSProperties } = {
  wolaiWebview: {
    width: "100%",
    height: "100%",
  },
  wolaiContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "block",
  },
  dragRegionStyle: {
    position: "absolute",
    zIndex: 9999,
    top: 0,
    left: 0,
    right: 0,
    height: 34,
    pointerEvents: "none",
    WebkitAppRegion: "drag",
  } as React.CSSProperties,
};

const App = (props: { wolaiUrl: string }) => {
  console.log("App -> wolaiUrl", props.wolaiUrl);
  const wolaiElm = useRef(null);
  // console.log(`file://${MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY}`);
  useEffect(() => {
    if (!wolaiElm) return;

    wolaiElm.current.addEventListener("did-fail-load", (error) => {
      if (error.errorCode === -3) {
        return;
      }
      if (
        !error.validatedURL.startsWith(
          schemeHelpers.getSchemeUrl({
            httpUrl: config.baseURL,
            protocol: config.protocol,
          })
        )
      ) {
        return;
      }
    });

    let electronWindow;

    try {
      electronWindow = electron.remote.getCurrentWindow();
    } catch (error) {
      console.error(error);
    }
    if (!electronWindow) {
      console.error("electronWindow not defined");
      return;
    }
    electronWindow.on("focus", (e) => {
      wolaiElm.current.focus();
    });
    wolaiElm.current.addEventListener("dom-ready", function () {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      wolaiElm.current.blur();
      wolaiElm.current.focus();
      // ========== TODO

      // const webContents = electron.remote.webContents.fromId(
      //   wolaiElm.current.getWebContentsId()
      // );
      // webContents.on("new-window", (e, urlToGo) => {
      //   e.preventDefault();
      //   ipc.sendToMain("create-window", urlToGo);
      // });
    });
    electronWindow.addListener("app-command", (e, cmd) => {
      const webContents = wolaiElm.current.getWebContents();
      if (cmd === "browser-backward" && webContents.canGoBack()) {
        webContents.goBack();
      } else if (cmd === "browser-forward" && webContents.canGoForward()) {
        webContents.goForward();
      }
    });
    electronWindow.addListener("swipe", (e, dir) => {
      const webContents = wolaiElm.current.getWebContents();
      if (dir === "left" && webContents.canGoBack()) {
        webContents.goBack();
      } else if (dir === "right" && webContents.canGoForward()) {
        webContents.goForward();
      }
    });
    // ========
    // setTimeout(() => {
    // }, 2);
  }, []);
  return (
    <>
      <div style={style.dragRegionStyle}></div>
      <div style={style.wolaiContainer}>
        <webview
          ref={wolaiElm}
          id="wolai"
          src={props.wolaiUrl}
          preload={`file://${MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY}`}
          allowpopups={true}
          // preload={MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY}
          // preload="./preload.js"
          style={style.wolaiWebview}
        ></webview>
      </div>
    </>
  );
};

window["openDevTools"] = () => {
  if (document) {
    const el = document.getElementById("wolai");
    (el as any).openDevTools();
  }
};

const init = () => {
  const parsed = url.parse(window.location.href, true);
  const wolaiUrl = (parsed.query.path as string) || config.baseURL;
  delete parsed.search;
  delete parsed.query;
  const plainUrl = url.format(parsed);
  window.history.replaceState(undefined, undefined, plainUrl); //TODO

  document.title = "wolai";
  ReactDOM.render(<App wolaiUrl={wolaiUrl} />, document.getElementById("root"));
};
init();
