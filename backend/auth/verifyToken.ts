import { createSolidTokenVerifier } from "@solid/access-token-verifier";
import { Request, Response } from "express";

const solidOidcAccessTokenVerifier = createSolidTokenVerifier();

async function verifySolidToken(req: Request) {
  const authorizationHeader = req.headers.authorization;
  const dpopHeader = req.headers.dpop as string;
  const requestMethod: any = req.method;
  const requestURL = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  if (!authorizationHeader) {
    throw Error("Auth header is undefined");
  }

  const { webid: webId } = await solidOidcAccessTokenVerifier(
    authorizationHeader,
    {
      header: dpopHeader,
      method: requestMethod,
      url: requestURL,
    }
  );

  return webId;
}

export default verifySolidToken;
