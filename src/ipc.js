import { BrowserWindow, ipcRenderer, ipcMain, remote } from "electron";
function sendMainToWolai(eventName, ...args) {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(eventName, ...args);
  });
}
const _sendMainToWolai = sendMainToWolai;
export { _sendMainToWolai as sendMainToWolai };
export const receiveWolaiFromMain = {
  addListener(eventName, fn) {
    ipcRenderer.addListener(eventName, fn);
  },
  removeListener(eventName, fn) {
    ipcRenderer.removeListener(eventName, fn);
  },
};
function proxyMainToWolai(wolaiWebView, eventName) {
  ipcRenderer.addListener(eventName, (event, arg) => {
    wolaiWebView.getWebContents().send(eventName, arg);
  });
}
const mainToWolaiIpcMap = {
  "wolai:update-error": true,
  "wolai:checking-for-update": true,
  "wolai:update-available": true,
  "wolai:update-not-available": true,
  "wolai:update-progress": true,
  "wolai:update-ready": true,
  "wolai:app-update-finished": true,
  "wolai:app-update-error": true,
  "wolai:checking-for-app-update": true,
  "wolai:app-update-available": true,
  "wolai:app-update-not-available": true,
  "wolai:app-update-progress": true,
  "wolai:app-update-ready": true,
  "wolai:popup-callback": true,
  "wolai:broadcast": true,
  "wolai:google-drive-picker-callback": true,
  "wolai:get-cookie-response": true,
};
const mainToWolaiIpcEvents = Object.keys(mainToWolaiIpcMap);
function proxyAllMainToWolai(wolaiWebView) {
  for (const eventName of mainToWolaiIpcEvents) {
    proxyMainToWolai(wolaiWebView, eventName);
  }
}
const _proxyAllMainToWolai = proxyAllMainToWolai;
export { _proxyAllMainToWolai as proxyAllMainToWolai };
function sendToMain(eventName, ...args) {
  ipcRenderer.send(eventName, ...args);
}
const _sendToMain = sendToMain;
export { _sendToMain as sendToMain };
export const receiveMainFromRenderer = {
  addListener(eventName, fn) {
    ipcMain.addListener(eventName, fn);
  },
  removeListener(eventName, fn) {
    ipcMain.removeListener(eventName, fn);
  },
};
function sendIndexToWolai(wolaiWebView, eventName, ...args) {
  wolaiWebView.getWebContents().send(eventName, ...args);
}
const _sendIndexToWolai = sendIndexToWolai;
export { _sendIndexToWolai as sendIndexToWolai };
export const receiveWolaiFromIndex = {
  addListener(eventName, fn) {
    ipcRenderer.addListener(eventName, fn);
  },
  removeListener(eventName, fn) {
    ipcRenderer.removeListener(eventName, fn);
  },
};
function sendIndexToSearch(searchWebView, eventName, ...args) {
  searchWebView.getWebContents().send(eventName, ...args);
}
const _sendIndexToSearch = sendIndexToSearch;
export { _sendIndexToSearch as sendIndexToSearch };
export const receiveSearchFromIndex = {
  addListener(eventName, fn) {
    ipcRenderer.addListener(eventName, fn);
  },
  removeListener(eventName, fn) {
    ipcRenderer.removeListener(eventName, fn);
  },
};
function sendSearchToIndex(eventName, ...args) {
  ipcRenderer.sendToHost(eventName, ...args);
}
const _sendSearchToIndex = sendSearchToIndex;
export { _sendSearchToIndex as sendSearchToIndex };
function sendWolaiToIndex(eventName, ...args) {
  ipcRenderer.sendToHost(eventName, ...args);
}
const _sendWolaiToIndex = sendWolaiToIndex;
export { _sendWolaiToIndex as sendWolaiToIndex };
const receiveIndexFromWolaiFnMap = new Map();
export const receiveIndexFromWolai = {
  addListener(wolaiWebView, eventName, fn) {
    const listener = (event) => {
      if (event && event.channel === eventName) {
        const arg = event.args && event.args[0];
        fn(arg);
      }
    };
    receiveIndexFromWolaiFnMap.set(fn, listener);
    wolaiWebView.addEventListener("ipc-message", listener);
  },
  removeListener(wolaiWebView, eventName, fn) {
    const listener = receiveIndexFromWolaiFnMap.get(fn);
    if (listener) {
      wolaiWebView.removeEventListener("ipc-message", listener);
      receiveIndexFromWolaiFnMap.delete(fn);
    }
  },
};
const receiveIndexFromSearchFnMap = new Map();
export const receiveIndexFromSearch = {
  addListener(searchWebView, eventName, fn) {
    const listener = (event) => {
      if (event && event.channel === eventName) {
        const arg = event.args && event.args[0];
        fn(arg);
      }
    };
    receiveIndexFromSearchFnMap.set(fn, listener);
    searchWebView.addEventListener("ipc-message", listener);
  },
  removeListener(searchWebView, eventName, fn) {
    const listener = receiveIndexFromSearchFnMap.get(fn);
    if (listener) {
      searchWebView.removeEventListener("ipc-message", listener);
      receiveIndexFromSearchFnMap.delete(fn);
    }
  },
};
const broacastListenerMap = new Map();
export const broadcast = {
  emit(channel, ...args) {
    sendToMain("wolai:broadcast", {
      windowId: remote.getCurrentWindow().id,
      channel: channel,
      args: args,
    });
  },
  addListener(channel, fn) {
    const callback = (sender, payload) => {
      if (
        payload.windowId !== remote.getCurrentWindow().id &&
        payload.channel === channel
      ) {
        fn(...payload.args);
      }
    };
    broacastListenerMap.set(fn, callback);
    receiveWolaiFromMain.addListener("wolai:broadcast", callback);
  },
  removeListener(eventName, fn) {
    const callback = broacastListenerMap.get(fn);
    if (callback) {
      receiveWolaiFromMain.removeListener("wolai:broadcast", callback);
      broacastListenerMap.delete(fn);
    }
  },
};
