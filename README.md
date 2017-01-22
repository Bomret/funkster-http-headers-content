# funkster-http-headers-content

[![npm](https://img.shields.io/npm/v/funkster-http-headers-content.svg?style=flat-square)](https://www.npmjs.com/package/funkster-http-headers-content)
[![node](https://img.shields.io/node/v/funkster-http-headers-content.svg?style=flat-square)](http://nodejs.org/download/)
[![npm](https://img.shields.io/npm/dt/funkster-http-headers-content.svg?style=flat-square)](https://www.npmjs.com/package/funkster-http-headers-content)
[![Travis](https://img.shields.io/travis/Bomret/funkster-http-headers-content.svg?style=flat-square)](https://travis-ci.org/Bomret/funkster-http-headers-content)

![Icon](./icon.png)

Funkster is a compositional server library. This package contains combinators to parse and set the HTTP Content-\* headers.

Additional examples of how to build HTTP server apis with funkster can be found [here](https://github.com/Bomret/funkster-http-examples).

> [Typscript](http://www.typescriptlang.org/) is used to illustrate the examples.

## Install
```bash
$ npm install funkster-http-headers-accept
```

## Build
```bash
$ npm install && npm run build
```

## Test
```bash
$ npm run test
```

## Parsing the Accept\* headers from a request
This module uses the [content-type](https://www.npmjs.com/package/content-type) and [content-disposition](https://www.npmjs.com/package/content-disposition) packages under the hood so essentially the same api applies for the parsing and setting the `Content-Type` (using `mediaType` instead of `type` for readability) and `Content-Disposition` headers.

The parsed headers object has the following type:
```javascript
{
  type?: {
    mediaType: string,
    parameters?: Object
  },
  length?: number,
  language?: string,
  encoding?: string,
  location?: string,
  disposition?: {
    type?: string,
    parameters?: Object
  } 
}
```

### Example:
```javascript
import * as http from 'http';
import { parseContentHeaders } from 'funkster-http-headers-content';
import { asRequestListener, Ok } from 'funkster-http';

const echoEncoding = parseContentHeaders(contentHeaders => Ok(contentHeaders.encoding));
const server = http.createServer(asRequestListener(echoEncoding));

// start the node HTTP server and send e.g. a GET with the Content-Encoding header set to 'gzip'.
```

## Setting the Content-* headers of the response
The following combinators are available for setting the respective content headers.

- `setContentType(type: string | ContentType)`: *See [content-type](https://www.npmjs.com/package/content-type) for the parameters.*
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

const sendJsonContentType = setContentType({ mediaType: "application/json", parameters: { charset: "utf-8" } });
const server = http.createServer(asRequestListener(sendJsonContentType));

// start the node HTTP server and send e.g. a GET.
```

## Meta
Icon [funky](https://thenounproject.com/search/?q=funky&i=72105) by [iconsmind.com](https://thenounproject.com/imicons/) from the Noun Project.
