import * as acc from "accepts";
import { HttpPipe, request } from "funkster-http";

export function parseAcceptHeaders(handler: (accepts: acc.Accepts) => HttpPipe): HttpPipe {
  return request(req => {
    const parsedAccepts = acc(req);
    return handler(parsedAccepts);
  });
}
