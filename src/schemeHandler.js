import { session, protocol as _protocol } from "electron";
// import { createReadStream } from "fs-extra";
import { PassThrough } from "stream";
import config from "./config.json";
import { getHttpUrl } from "./schemeHelpers";
// import { assetCache } from "./assetCache";
import got from "got";
import constants from "./constants";
import tough_cookie from "tough-cookie";
import CookieStore from "./CookieStore";

const cookieStore = new CookieStore();
const cookieJar = new tough_cookie.CookieJar(cookieStore);

_protocol.registerSchemesAsPrivileged([
  {
    scheme: config.protocol,
    privileges: {
      standard: true,
      secure: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);
function registerUrlSchemeProxy() {
  const { protocol } = session.fromPartition(
    constants.electronSessionPartition
  );
  return protocol.registerStreamProtocol(config.protocol, (req, callback) => {
    if (config.isLocalhost && !config.offline) {
      proxyRequest(req, callback);
      return;
    }
    try {
      // const cachedFile = await assetCache.handleRequest(req);
      // if (cachedFile) {
      //   const fileStream = createReadStream(cachedFile.absolutePath);
      //   callback({
      //     statusCode: 200,
      //     headers: cachedFile.headers,
      //     data: fileStream,
      //   });
      // } else {
      proxyRequest(req, callback);
      // }
    } catch (error) {
      //   loggly.log({
      //     level: "error",
      //     from: "schemeHandler",
      //     type: "requestHandlerError",
      //     error: error,
      //   });
      callback({
        statusCode: 500,
        headers: {},
        data: createStream("Something went wrong."),
      });
    }
  });
}
export { registerUrlSchemeProxy };
function proxyRequest(req, callback) {
  const httpUrl = getHttpUrl({
    schemeUrl: req.url,
    baseUrl: config.baseURL,
  });
  console.log("proxyRequest -> httpUrl", httpUrl);
  const stream = got(httpUrl, {
    headers: req.headers,
    method: req.method,
    useElectronNet: true,
    throwHttpErrors: false,
    cookieJar: cookieJar,
    decompress: false,
  });
  stream.on("response", (resp) => {
    const headers = { ...resp.headers };
    delete headers["content-encoding"];
    delete headers["Content-Encoding"];
    callback({
      statusCode: resp.statusCode || 0,
      headers: headers,
      data: stream,
    });
  });
  stream.on("error", (error) => {
    callback({
      statusCode: 0,
      headers: {},
      data: createErrorStream(error),
    });
  });
  if (req.uploadData) {
    for (const { bytes } of req.uploadData) {
      stream.write(bytes);
    }
  }
  stream.end();
}
function createStream(str) {
  const stream = new PassThrough();
  stream.push(str);
  stream.push(null);
  return stream;
}
function createErrorStream(error) {
  const stream = new PassThrough();
  stream.destroy(error);
  return stream;
}
