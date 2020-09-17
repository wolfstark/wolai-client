import { parse, format } from "url";
function forceConsistentEndingSlash(args) {
  if (args.src.endsWith("/")) {
    if (args.dest.endsWith("/")) {
      return args.dest;
    } else {
      return args.dest + "/";
    }
  } else {
    if (args.dest.endsWith("/")) {
      return args.dest.slice(0, args.dest.length - 1);
    } else {
      return args.dest;
    }
  }
}
function getSchemeUrl(args) {
  const parsed = parse(args.httpUrl, true);
  parsed.protocol = args.protocol + ":";
  parsed.port = undefined;
  parsed.host = undefined;
  const schemeUrl = format(parsed);
  return forceConsistentEndingSlash({
    src: args.httpUrl,
    dest: schemeUrl,
  });
}
const _getSchemeUrl = getSchemeUrl;
export { _getSchemeUrl as getSchemeUrl };
function getHttpUrl(args) {
  const parsedBaseURL = parse(args.baseUrl);
  const parsed = parse(args.schemeUrl, true);
  parsed.protocol = parsedBaseURL.protocol;
  parsed.port = parsedBaseURL.port;
  parsed.host = parsedBaseURL.host;
  const httpUrl = format(parsed);
  return forceConsistentEndingSlash({
    src: args.schemeUrl,
    dest: httpUrl,
  });
}
const _getHttpUrl = getHttpUrl;
export { _getHttpUrl as getHttpUrl };
function fixSchemeUrl(args) {
  if (!args.url.startsWith(args.protocol + ":")) {
    return args.url;
  }
  const parsedBaseUrl = parse(args.baseUrl, true);
  const parsed = parse(args.url, true);
  if (parsed.hostname === parsedBaseUrl.hostname) {
    return args.url;
  }
  return args.url.replace(`${args.protocol}://*`, `${args.protocol}:/`);
}
const _fixSchemeUrl = fixSchemeUrl;
export { _fixSchemeUrl as fixSchemeUrl };
