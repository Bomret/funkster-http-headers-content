import * as cDispo from "content-disposition";
import * as cType from "content-type";
import { HttpPipe, request, setHeader } from "funkster-http";

export type ContentEncoding =
  "gzip"
  | "compress"
  | "deflate"
  | "identity"
  | "br";

export interface ContentHeaders {
  contentType?: cType.MediaType;
  contentLength?: number;
  contentLanguage?: string;
  contentEncoding?: ContentEncoding;
  contentLocation?: string;
  contentDisposition?: any;
}

function parse<T>(name: string, transform: (value: string) => T, headers: any) {
  const value = headers[name];
  return value ? transform(value) : null;
}

export function parseContentHeaders(handler: (headers: ContentHeaders) => HttpPipe): HttpPipe {
  return request(req => {
    const contentType = parse<cType.MediaType>("content-type", cType.parse, req.headers);
    const contentLength = parse<number>("content-length", x => parseInt(x, 10), req.headers);
    const contentLanguage = parse<string>("content-language", x => x, req.headers);
    const contentEncoding = parse<ContentEncoding>("content-encoding", x => <ContentEncoding>x, req.headers);
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

export function setContentType(type: string | cType.MediaType): HttpPipe {
  if (typeof type === "string") {
    return setHeader("Content-Type", type);
  } else {
    return setHeader("Content-Type", cType.format(type));
  }
}

export function setContentDisposition(filenameOrOptions?: string | cDispo.Options, options?: cDispo.Options): HttpPipe {
  if (!filenameOrOptions) {
    return setHeader("Content-Disposition", cDispo());
  } else if (typeof filenameOrOptions === "string") {
    return setHeader("Content-Disposition", cDispo(filenameOrOptions, options));
  } else {
    return setHeader("Content-Disposition", cDispo(undefined, filenameOrOptions));
  }
}

export function setContentLength(length: number): HttpPipe {
  return setHeader("Content-Length", String(length));
}

export function setContentLanguage(language: string): HttpPipe {
  return setHeader("Content-Language", language);
}

export function setContentEncoding(encoding: ContentEncoding): HttpPipe {
  return setHeader("Content-Encoding", encoding);
}

export function setContentLocation(location: string): HttpPipe {
  return setHeader("Content-Location", location);
}
