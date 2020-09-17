import { parse as __parse, format as __format } from "url";
function parse(str, args = {}) {
  try {
    return __parse(str, true, args.slashesDenoteHost);
  } catch (err) {
    try {
      const result = __parse(str);
      const resultWithQuery = {
        ...result,
        query: {},
      };
      return resultWithQuery;
    } catch (err) {
      return __parse("", true);
    }
  }
}
const _parse = parse;
export { _parse as parse };
function format(args) {
  return __format(args);
}
const _format = format;
export { _format as format };
function makeUrl(args) {
  const parsed = parse(args.url);
  parsed.query;
  delete parsed.search;
  parsed.query = args.query || {};
  parsed.hash = args.hash;
  return format(parsed);
}
const _makeUrl = makeUrl;
export { _makeUrl as makeUrl };
function removeBaseUrl(str) {
  const parsed = parse(str);
  delete parsed.protocol;
  delete parsed.host;
  delete parsed.hostname;
  parsed.slashes = false;
  return format(parsed);
}
const _removeBaseUrl = removeBaseUrl;
export { _removeBaseUrl as removeBaseUrl };
function isRelativeUrl(relativeUrl) {
  const parsed = parse(relativeUrl);
  return Boolean(!parsed.host && !parsed.hostname);
}
const _isRelativeUrl = isRelativeUrl;
export { _isRelativeUrl as isRelativeUrl };
function setBaseUrl(args) {
  const parsed = parse(args.relativeUrl);
  const baseUrlParsed = parse(args.baseUrl);
  parsed.protocol = baseUrlParsed.protocol;
  parsed.host = baseUrlParsed.host;
  parsed.hostname = baseUrlParsed.hostname;
  return format(parsed);
}
const _setBaseUrl = setBaseUrl;
export { _setBaseUrl as setBaseUrl };
function replacePathname(args) {
  const parsed = parse(args.url);
  delete parsed.path;
  parsed.pathname = args.pathname;
  return format(parsed);
}
const _replacePathname = replacePathname;
export { _replacePathname as replacePathname };
function resolve(baseUrl, pathname) {
  return replacePathname({ url: baseUrl, pathname });
}
const _resolve = resolve;
export { _resolve as resolve };
function removeQueryParam(str, param) {
  const parsed = parse(str);
  delete parsed.search;
  delete parsed.query[param];
  return format(parsed);
}
const _removeQueryParam = removeQueryParam;
export { _removeQueryParam as removeQueryParam };
function addQueryParams(str, query) {
  const parsed = parse(str);
  delete parsed.search;
  parsed.query = { ...parsed.query, ...query };
  return format(parsed);
}
const _addQueryParams = addQueryParams;
export { _addQueryParams as addQueryParams };
const hostBlacklist = {
  "thumpmagical.top": true,
  "geoloc8.com": true,
  "kutabminaj.top": true,
  "cutisbuhano.xyz": true,
  "bhapurimillat.xyz": true,
  "kingoffightermens.top": true,
  "boxgeneral.xyz": true,
  "ahnd.ga": true,
  "steptossmessage.top": true,
  "earthdiscover.xyz": true,
  "sopecasniteroi.com.br": true,
  "clangchapshop.xyz": true,
};
function sanitizeUrl(args) {
  const { str, allowNoProtocol } = args;
  if (!str || typeof str !== "string") {
    return;
  }
  try {
    const parsed = parse(str);
    if (parsed.host && hostBlacklist[parsed.host]) {
      return;
    }
    if (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:" ||
      parsed.protocol === "mailto:" ||
      parsed.protocol === "itms-apps:" ||
      parsed.protocol === "tel:" ||
      (allowNoProtocol && !parsed.protocol)
    ) {
      return str;
    }
  } catch (err) {
    return;
  }
}
const _sanitizeUrl = sanitizeUrl;
export { _sanitizeUrl as sanitizeUrl };
function removeUrlFromString(str) {
  return (str || "").replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
}
const _removeUrlFromString = removeUrlFromString;
export { _removeUrlFromString as removeUrlFromString };
