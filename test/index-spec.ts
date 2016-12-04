import { Ok, asRequestListener } from "funkster-http";
import * as http from "http";
import * as request from "supertest";

import { parseAccepts } from "../src";

describe("When the client sends a request", () => {
  const pipe = parseAccepts(acc => Ok(JSON.stringify(acc.types())));

  const server = http.createServer(asRequestListener(pipe));

  describe("and does not send an Accept header", () => {
    it("should parse the wildcard type", () =>
      request(server)
        .get("/")
        .expect(200, JSON.stringify(["*/*"])));
  });

  describe("and accepts only json", () => {
    it("should parse application/json", () =>
      request(server)
        .get("/")
        .accept("application/json")
        .expect(200, JSON.stringify(["application/json"])));
  });

  describe("and accepts json and html", () => {
    it("should parse application/json and text/html", () =>
      request(server)
        .get("/")
        .accept("application/json, text/html")
        .expect(200, JSON.stringify(["application/json", "text/html"])));
  });
});
