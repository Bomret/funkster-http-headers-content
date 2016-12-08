import { asRequestListener, Ok } from "funkster-http";
import * as http from "http";
import * as request from "supertest";

import { parseRequestContentHeaders } from "../src";

describe("When parsing the Content headers from a request", () => {
  describe("and analyzing the Content-Type", () => {
    const pipe = parseRequestContentHeaders(headers => Ok(JSON.stringify(headers.contentType)));
    const server = http.createServer(asRequestListener(pipe));

    describe("and none is set", () =>
      it("should parse 'null'", () =>
        request(server)
          .get("/")
          .expect(200, JSON.stringify(null))));

    describe("and 'application/json; charset=utf-8' is set", () =>
      it("should parse the correct information", () =>
        request(server)
          .get("/")
          .type("application/json; charset=utf-8")
          .expect(200, JSON.stringify({
            parameters: {
              charset: "utf-8"
            },
            type: "application/json"
          }))));
  });

  describe("and analyzing the Content-Length", () => {
    const pipe = parseRequestContentHeaders(headers => Ok(JSON.stringify(headers.contentLength)));
    const server = http.createServer(asRequestListener(pipe));

    describe("and none is set", () =>
      it("should parse 'null'", () =>
        request(server)
          .get("/")
          .expect(200, JSON.stringify(null))));

    describe("and '246' is set", () =>
      it("should parse the correct information", () =>
        request(server)
          .get("/")
          .set("Content-Length", "246")
          .expect(200, JSON.stringify(246))));
  });

  describe("and analyzing the Content-Language", () => {
    const pipe = parseRequestContentHeaders(headers => Ok(JSON.stringify(headers.contentLanguage)));
    const server = http.createServer(asRequestListener(pipe));

    describe("and none is set", () =>
      it("should parse 'null'", () =>
        request(server)
          .get("/")
          .expect(200, JSON.stringify(null))));

    describe("and 'de-DE' is set", () =>
      it("should parse the correct information", () =>
        request(server)
          .get("/")
          .set("Content-Language", "de-DE")
          .expect(200, JSON.stringify("de-DE"))));
  });

  describe("and analyzing the Content-Encoding", () => {
    const pipe = parseRequestContentHeaders(headers => Ok(JSON.stringify(headers.contentEncoding)));
    const server = http.createServer(asRequestListener(pipe));

    describe("and none is set", () =>
      it("should parse 'null'", () =>
        request(server)
          .get("/")
          .expect(200, JSON.stringify(null))));

    describe("and 'gzip' is set", () =>
      it("should parse the correct information", () =>
        request(server)
          .get("/")
          .set("Content-Encoding", "gzip")
          .expect(200, JSON.stringify("gzip"))));
  });

  describe("and analyzing the Content-Location", () => {
    const pipe = parseRequestContentHeaders(headers => Ok(JSON.stringify(headers.contentLocation)));
    const server = http.createServer(asRequestListener(pipe));

    describe("and none is set", () =>
      it("should parse 'null'", () =>
        request(server)
          .get("/")
          .expect(200, JSON.stringify(null))));

    describe("and '/some.html' is set", () =>
      it("should parse the correct information", () =>
        request(server)
          .get("/")
          .set("Content-Location", "/some.html")
          .expect(200, JSON.stringify("/some.html"))));
  });

  describe("and analyzing the Content-Disposition", () => {
    const pipe = parseRequestContentHeaders(headers => Ok(JSON.stringify(headers.contentDisposition)));
    const server = http.createServer(asRequestListener(pipe));

    describe("and none is set", () => {
      it("should parse 'null'", () =>
        request(server)
          .get("/")
          .expect(200, JSON.stringify(null)));
    });

    describe('and "attachment; filename=some.txt" is set', () => {
      it("should parse 'null'", () =>
        request(server)
          .get("/")
          .set("Content-Disposition", 'attachment; filename="some.txt"')
          .expect(200, JSON.stringify({
            type: "attachment",
            parameters: {
              filename: "some.txt"
            }
          })));
    });
  });
});
