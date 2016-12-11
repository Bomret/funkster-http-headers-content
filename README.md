# funkster-http-headers-content

[![npm](https://img.shields.io/npm/v/funkster-http-headers-content.svg)](https://www.npmjs.com/package/funkster-http-headers-content)
[![node](https://img.shields.io/node/v/funkster-http-headers-content.svg)](http://nodejs.org/download/)
[![npm](https://img.shields.io/npm/dt/funkster-http-headers-content.svg)](https://www.npmjs.com/package/funkster-http-headers-content)
[![Known Vulnerabilities](https://snyk.io/test/github/bomret/funkster-http-headers-content/badge.svg)](https://snyk.io/test/github/bomret/funkster-http-headers-content)
[![bitHound](https://img.shields.io/bithound/code/github/Bomret/funkster-http-headers-content.svg)](https://www.bithound.io/github/Bomret/funkster-http-headers-content)
[![Travis](https://travis-ci.org/Bomret/funkster-http-headers-content.svg?branch=master)](https://travis-ci.org/Bomret/funkster-http-headers-content)

Funkster is a compositional server library. This package contains combinators to parse and set the HTTP Content-\* headers.

## Install
```bash
$ npm install funkster-http-headers-accept
```

[Typscript](http://www.typescriptlang.org/) is used to illustrate the examples.

## Parsing the Accept\* headers from a request
This module uses the [content-type](https://www.npmjs.com/package/content-type) and [content-disposition](https://www.npmjs.com/package/content-disposition) packages so essentially the same api applies for the parsing and setting the `Content-Type` and `Content-Disposition` headers.

The parsed headers object has the following type:
```javascript
{
  contentType?: {
    type: string,
    parameters: Object
  },
  contentLength?: number,
  contentLanguage?: string,
  contentEncoding?: string,
  contentLocation?: string,
  contentDisposition?: {
    type: string,
    parameters: Object
  } 
}
```

### Example:
```javascript
import * as http from 'http';
import { parseContentHeaders } from 'funkster-http-headers-content';
import { asRequestListener, Ok } from 'funkster-http';

const echoEncoding = parseContentHeaders(headers => Ok(headers.contentEncoding));
const server = http.createServer(asRequestListener(echoEncoding));

// start the node HTTP server and send e.g. a GET with the Content-Encoding header set to 'gzip'.
```

## Setting the Content-* headers of the response
The following combinators are available for setting the respective content headers.

- `setContentType(type: string | MediaType)`: *Uses the same api as [content-type](https://www.npmjs.com/package/content-type).*
- `setContentDisposition(filenameOrOptions?: string | Options, options?: Options)`: *Uses the same api as [content-disposition](https://www.npmjs.com/package/content-disposition).*
- `setContentLength(length: number)`
- `setContentLanguage(language: string)`
- `setContentEncoding(encoding: string)`: *The `encoding` parameter should be one of ["gzip", "compress", "deflate", "identity", "br"]*
- `setContentLocation(location: string)`

### Example
```javascript
import * as http from 'http';
import { setContentType } from 'funkster-http-headers-content';
import { asRequestListener, Ok } from 'funkster-http';

const sendJsonContentType = setContentType({ type: "application/json", parameters: { charset: "utf-8" } });
const server = http.createServer(asRequestListener(sendJsonContentType));

// start the node HTTP server and send e.g. a GET.
```
