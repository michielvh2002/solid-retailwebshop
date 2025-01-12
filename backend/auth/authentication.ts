import { Request, Response } from "express";
import { Session } from "@inrupt/solid-client-authn-node";
import { getSolidDataset } from "@inrupt/solid-client";
import "dotenv/config";
export const testSolid = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  try {
    const res = await authenticateAsUser();
    response.status(200).send(res);
  } catch (error) {
    console.warn(error);
    response.status(500).send(error);
  }
};

// const loginWithUsernameAndPassword = async () => {
//   const client = new SolidNodeClient({
//     appUrl: "http://localhost:3000",
//   });
//   const res = await client.login({
//     idp: "https://solidcommunity.net", // e.g. https://solidcommunity.net
//     username: "michielvh",
//     password: "&businessMwoan89%",
//   });
//   console.log(res);
//   return client;
// };

export const authenticateAsUser = async (): Promise<Session> => {
  const session = new Session();
  await session.login({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    clientName: "WebshopAPI",
    oidcIssuer: "https://login.inrupt.com",
  });
  return session;
};

const testReadResource = async (session: Session) => {
  console.log(session.info.webId);
  const myDataset = await getSolidDataset(
    "https://michielvh2.solidcommunity.net/order-history/order-history.ttl",
    {
      fetch: session.fetch,
    }
  );
  return myDataset;
};
