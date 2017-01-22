import { NoParameterPropertiesWalker } from 'tslint/lib/rules/noParameterPropertiesRule'
import cDispo = require('content-disposition')
import cType = require('content-type')
import { HttpPipe, request, setHeader } from 'funkster-http'

export type ContentEncoding =
  'gzip'
  | 'compress'
  | 'deflate'
  | 'identity'
  | 'br'

export interface ContentType {
  mediaType: string
  parameters?: any
};

export interface ContentDisposition {
  type?: string
  parameters?: any
};

export interface ContentHeaders {
  disposition?: ContentDisposition
  encoding?: ContentEncoding
  language?: string
  length?: number
  location?: string
  type?: ContentType
}

function parse<T>(name: string, transform: (value: string) => T, headers: any) {
  const value = headers[name]
  return value ? transform(value) : null
}

function parseContentType(headers: any) {
  return parse<ContentType>('content-type', x => {
    const parsedType = cType.parse(x)
    return {
      mediaType: parsedType.type,
      parameters: parsedType.parameters
    }
  }, headers)
}

function parseContentLength (headers: any) {
  return parse<number>('content-length', x => parseInt(x, 10), headers)
}

function parseContentLanguage (headers: any) {
  return parse<string>('content-language', x => x, headers)
}

function parseContentEncoding (headers: any) {
  return parse<ContentEncoding>('content-encoding', x => <ContentEncoding> x, headers)
}

function parseContentLocation (headers: any) {
  return parse<string>('content-location', x => x, headers)
}

function parseContentDisposition (headers: any) {
  return parse<ContentDisposition>('content-disposition', cDispo.parse, headers)
}

export function parseContentHeaders(handler: (headers: ContentHeaders) => HttpPipe): HttpPipe {
  return request((req) => {
    const contentType = parseContentType(req.headers)
    const contentLength = parseContentLength(req.headers)
    const contentLanguage = parseContentLanguage(req.headers)
    const contentEncoding = parseContentEncoding(req.headers)
    const contentLocation = parseContentLocation(req.headers)
    const contentDisposition = parseContentDisposition(req.headers)

    const parsedHeaders: ContentHeaders = {
      disposition: contentDisposition,
      encoding: contentEncoding,
      language: contentLanguage,
      length: contentLength,
      location: contentLocation,
      type: contentType
    }

    return handler(parsedHeaders)
  })
}

export function setContentType(type: string | ContentType): HttpPipe {
  if (typeof type === 'string') {
    return setHeader('Content-Type', type)
  } else {
    const convertedContentType = {
      parameters: type.parameters,
      type: type.mediaType
    }
    return setHeader('Content-Type', cType.format(convertedContentType))
  }
}

export function setContentDisposition(
  filenameOrOptions?: string | ContentDisposition,
  options?: ContentDisposition): HttpPipe {
  if (!filenameOrOptions) {
    return setHeader('Content-Disposition', cDispo())
  } else if (typeof filenameOrOptions === 'string') {
    return setHeader('Content-Disposition', cDispo(filenameOrOptions, options))
  } else {
    return setHeader('Content-Disposition', cDispo(undefined, filenameOrOptions))
  }
}

export function setContentLength(length: number): HttpPipe {
  return setHeader('Content-Length', String(length))
}

export function setContentLanguage(language: string): HttpPipe {
  return setHeader('Content-Language', language)
}

export function setContentEncoding(encoding: ContentEncoding): HttpPipe {
  return setHeader('Content-Encoding', encoding)
}

export function setContentLocation(location: string): HttpPipe {
  return setHeader('Content-Location', location)
}
