import * as cType from "content-type";
const cDispo = require("content-disposition");
import { HttpPipe, request } from "funkster-http";

export interface ContentHeaders {
  contentType: cType.MediaType | void;
  contentLength: number | void;
  contentLanguage: string | void;
  contentEncoding: string | void;
  contentLocation: string | void;
  contentDisposition: any | void;
}

function parse<T>(name: string, transform: (value: string) => T, headers: any) {
  const value = headers[name];
  return value ? transform(value) : null;
}

export function parseRequestContentHeaders(handler: (headers: ContentHeaders) => HttpPipe): HttpPipe {
  return request(req => {
    const contentType = parse<cType.MediaType>("content-type", cType.parse, req.headers);
    const contentLength = parse<number>("content-length", x => parseInt(x, 10), req.headers);
    const contentLanguage = parse<string>("content-language", x => x, req.headers);
    const contentEncoding = parse<string>("content-encoding", x => x, req.headers);
    const contentLocation = parse<string>("content-location", x => x, req.headers);
    const contentDisposition = parse<any>("content-disposition", cDispo.parse, req.headers);

    const parsedHeaders: ContentHeaders = {
      contentType,
      contentLength,
      contentLanguage,
      contentEncoding,
      contentLocation,
      contentDisposition
    };

    return handler(parsedHeaders);
  });
}
