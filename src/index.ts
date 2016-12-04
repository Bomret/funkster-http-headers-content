import * as acc from "accepts";
import { HttpPipe, request } from "funkster-http";

export function parseAccepts(handler: (accepts: acc.Accepts) => HttpPipe): HttpPipe {
  return request(req => {
    const parsedAccepts = acc(req);
    return handler(parsedAccepts);
  });
}
