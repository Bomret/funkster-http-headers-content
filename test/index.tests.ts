import { compose } from 'funkster-core'
import { asRequestListener, Ok } from 'funkster-http'
import * as http from 'http'
import * as request from 'supertest'

import {
  parseContentHeaders,
  setContentDisposition,
  setContentEncoding,
  setContentLanguage,
  setContentLength,
  setContentLocation,
  setContentType
} from '../src'

describe('When parsing the Content headers from a request', () => {
  describe('and analyzing the Content-Type', () => {
    const pipe = parseContentHeaders((content) => Ok(JSON.stringify(content.type)))
    const server = http.createServer(asRequestListener(pipe))

    describe('and none is set', () =>
      it('should parse null', () =>
        request(server)
          .get('/')
          .expect(200)
          .expect(JSON.stringify(null))))

    describe('and application/json; charset=utf-8 is set', () =>
      it('should parse the correct information', () =>
        request(server)
          .get('/')
          .type('application/json; charset=utf-8')
          .expect(200)
          .expect(JSON.stringify({
            mediaType: 'application/json',
            parameters: {
              charset: 'utf-8'
            }
          }))))
  })

  describe('and analyzing the Content-Length', () => {
    const pipe = parseContentHeaders((content) => Ok(JSON.stringify(content.length)))
    const server = http.createServer(asRequestListener(pipe))

    describe('and none is set', () =>
      it('should parse null', () =>
        request(server)
          .get('/')
          .expect(200)
          .expect(JSON.stringify(null))))

    describe('and 246 is set', () =>
      it('should parse the correct information', () =>
        request(server)
          .get('/')
          .set('Content-Length', '246')
          .expect(200)
          .expect(JSON.stringify(246))))
  })

  describe('and analyzing the Content-Language', () => {
    const pipe = parseContentHeaders((content) => Ok(JSON.stringify(content.language)))
    const server = http.createServer(asRequestListener(pipe))

    describe('and none is set', () =>
      it('should parse null', () =>
        request(server)
          .get('/')
          .expect(200)
          .expect(JSON.stringify(null))))

    describe('and de-DE is set', () =>
      it('should parse the correct information', () =>
        request(server)
          .get('/')
          .set('Content-Language', 'de-DE')
          .expect(200)
          .expect(JSON.stringify('de-DE'))))
  })

  describe('and analyzing the Content-Encoding', () => {
    const pipe = parseContentHeaders((content) => Ok(JSON.stringify(content.encoding)))
    const server = http.createServer(asRequestListener(pipe))

    describe('and none is set', () =>
      it('should parse null', () =>
        request(server)
          .get('/')
          .expect(200)
          .expect(JSON.stringify(null))))

    describe('and gzip is set', () =>
      it('should parse the correct information', () =>
        request(server)
          .get('/')
          .set('Content-Encoding', 'gzip')
          .expect(200)
          .expect(JSON.stringify('gzip'))))
  })

  describe('and analyzing the Content-Location', () => {
    const pipe = parseContentHeaders((content) => Ok(JSON.stringify(content.location)))
    const server = http.createServer(asRequestListener(pipe))

    describe('and none is set', () =>
      it('should parse null', () =>
        request(server)
          .get('/')
          .expect(200)
          .expect(JSON.stringify(null))))

    describe('and /some.html is set', () =>
      it('should parse the correct information', () =>
        request(server)
          .get('/')
          .set('Content-Location', '/some.html')
          .expect(200)
          .expect(JSON.stringify('/some.html'))))
  })

  describe('and analyzing the Content-Disposition', () => {
    const pipe = parseContentHeaders((content) => Ok(JSON.stringify(content.disposition)))
    const server = http.createServer(asRequestListener(pipe))

    describe('and none is set', () => {
      it('should parse null', () =>
        request(server)
          .get('/')
          .expect(200)
          .expect(JSON.stringify(null)))
    })

    describe('and "attachment; filename=some.txt" is set', () => {
      it('should parse null', () =>
        request(server)
          .get('/')
          .set('Content-Disposition', 'attachment; filename="some.txt"')
          .expect(200)
          .expect(JSON.stringify({
            type: 'attachment',
            parameters: {
              filename: 'some.txt'
            }
          })))
    })
  })
})

describe('When setting the Content headers of a response', () => {
  describe('and setting the Content-Type to application/json via string', () => {
    const pipe = compose(setContentType('application/json'), Ok())
    const server = http.createServer(asRequestListener(pipe))

    it('should set the response header correctly', () =>
      request(server)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'application/json'))
  })

  describe('and setting the Content-Type to application/json via a MediaType object', () => {
    const pipe = compose(setContentType({ mediaType: 'application/json', parameters: { charset: 'utf-8' } }), Ok())
    const server = http.createServer(asRequestListener(pipe))

    it('should set the response header correctly', () =>
      request(server)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8'))
  })

  describe('and setting the Content-Disposition to attachment without any parameter', () => {
    const pipe = compose(setContentDisposition(), Ok())
    const server = http.createServer(asRequestListener(pipe))

    it('should set the response header correctly', () =>
      request(server)
        .get('/')
        .expect(200)
        .expect('Content-Disposition', 'attachment'))
  })

  describe('and setting the Content-Disposition to attachment via a options object', () => {
    const pipe = compose(setContentDisposition({ type: 'attachment' }), Ok())
    const server = http.createServer(asRequestListener(pipe))

    it('should set the response header correctly', () =>
      request(server)
        .get('/')
        .expect(200)
        .expect('Content-Disposition', 'attachment'))
  })

  describe('and setting the Content-Disposition to attachment; filename=some.txt via a options object', () => {
    const pipe = compose(setContentDisposition('some.txt', { type: 'attachment' }), Ok())
    const server = http.createServer(asRequestListener(pipe))

    it('should set the response header correctly', () =>
      request(server)
        .get('/')
        .expect(200)
        .expect('Content-Disposition', 'attachment; filename="some.txt"'))
  })

  describe('and setting the Content-Disposition to attachment; filename=some.txt via string', () => {
    const pipe = compose(setContentDisposition('some.txt'), Ok())
    const server = http.createServer(asRequestListener(pipe))

    it('should set the response header correctly', () =>
      request(server)
        .get('/')
        .expect(200)
        .expect('Content-Disposition', 'attachment; filename="some.txt"'))
  })

  describe('and setting the Content-Length to 246', () => {
    const pipe = compose(setContentLength(246), Ok())
    const server = http.createServer(asRequestListener(pipe))

    it('should set the response header correctly', () =>
      request(server)
        .get('/')
        .expect(200)
        .expect('Content-Length', '246'))
  })

  describe('and setting the Content-Language to de-DE', () => {
    const pipe = compose(setContentLanguage('de-DE'), Ok())
    const server = http.createServer(asRequestListener(pipe))

    it('should set the response header correctly', () =>
      request(server)
        .get('/')
        .expect(200)
        .expect('Content-Language', 'de-DE'))
  })

  describe('and setting the Content-Encoding to gzip', () => {
    const pipe = compose(setContentEncoding('gzip'), Ok())
    const server = http.createServer(asRequestListener(pipe))

    it('should set the response header correctly', () =>
      request(server)
        .get('/')
        .expect(200)
        .expect('Content-Encoding', 'gzip'))
  })

  describe('and setting the Content-Location to /some.html', () => {
    const pipe = compose(setContentLocation('/some.html'), Ok())
    const server = http.createServer(asRequestListener(pipe))

    it('should set the response header correctly', () =>
      request(server)
        .get('/')
        .expect(200)
        .expect('Content-Location', '/some.html'))
  })
})
