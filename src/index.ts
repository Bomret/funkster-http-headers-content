import cDispo = require("content-disposition");
import cType = require("content-type");
import { HttpPipe, request, setHeader } from "funkster-http";

export type ContentEncoding =
    "gzip"
    | "compress"
    | "deflate"
    | "identity"
    | "br";

export interface ContentType extends cType.MediaType { };
export interface ContentDisposition {
    type?: string;
    parameters?: any;
};

export interface ContentHeaders {
    contentType?: ContentType;
    contentLength?: number;
    contentLanguage?: string;
    contentEncoding?: ContentEncoding;
    contentLocation?: string;
    contentDisposition?: ContentDisposition;
}

function parse<T>(name: string, transform: (value: string) => T, headers: any) {
    const value = headers[name];
    return value ? transform(value) : null;
}

export function parseContentHeaders(handler: (headers: ContentHeaders) => HttpPipe): HttpPipe {
    return request(req => {
        const contentType = parse<ContentType>("content-type", cType.parse, req.headers);
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

export function setContentType(type: string | ContentType): HttpPipe {
    if (typeof type === "string") {
        return setHeader("Content-Type", type);
    } else {
        return setHeader("Content-Type", cType.format(type));
    }
}

export function setContentDisposition(
    filenameOrOptions?: string | ContentDisposition,
    options?: ContentDisposition): HttpPipe {
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
