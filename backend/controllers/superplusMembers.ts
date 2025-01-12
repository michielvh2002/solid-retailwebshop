import { Request, Response } from "express";
import { authenticateAsUser } from "../auth/authentication";
import verifySolidToken from "../auth/verifyToken";
import { checkAccess } from "./permissions";
import { getAllUsers, getUserByWebId, upsertUser } from "../database/dbActions";
import { OrderItem } from "../types/orderItem";
import { getOrdersFromPod, writeOrderToPod } from "../solid/orderHistory";
import { getDemographicdata } from "../solid/demographicData";
import { getSolidDataset } from "@inrupt/solid-client";
export const signUp = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const webid = await verifySolidToken(request);
  const session = await authenticateAsUser();
  const result = await checkAccess(webid, session);

  if (!result.demographic.read || !result.orderhistory.read) {
    response.status(400).json({
      error:
        "Delhaize should have at least read permissions on order history and demographic data",
    });
  }
  const succeeded = upsertUser(webid, result);
  if (succeeded) {
    response.status(200).send("success");
  } else {
    response.status(500).send("failed");
  }
};

export const getSuperplusMembers = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const res = await getAllUsers();
  return response.status(200).json(res);
};

export const handleOrder = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const order: Array<OrderItem> = request.body;
  const webid = await verifySolidToken(request);
  const session = await authenticateAsUser();
  const user = await getUserByWebId(webid);
  if (!user) return;

  if (user["write_o"]) {
    try {
      //write to pod
      await writeOrderToPod(order, webid, session);
    } catch (error: any) {
      if (error.statusCode === 403 || error.statusCode === 401) {
        const perms = await checkAccess(webid, session);
        upsertUser(webid, perms);
      }
    }
  }
  //verder verwerken van de bestelling
};

export const getOrderFromPod = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const webid = request.query.webid as string;
  if (!webid) {
    response.status(400).send("No webid provided");
    return;
  }
  const session = await authenticateAsUser();
  const user = await getUserByWebId(webid);
  const result = await getOrdersFromPod(webid, session);
  response.status(200).json(result);
  if (user["read_o"]) {
    try {
      const result = await getOrdersFromPod(webid, session);
      response.status(200).json(result);
      return;
    } catch (error: any) {
      if (error.statusCode === 403 || error.statusCode === 401) {
        const perms = await checkAccess(webid, session);
        upsertUser(webid, perms);
        response
          .status(200)
          .send("We don't have permissions to execute this action");
      }
    }
  }
};

export const getDemographicDataFromPod = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const webid = request.query.webid as string;
  if (!webid) {
    response.status(400).send("No webid provided");
    return;
  }
  const session = await authenticateAsUser();
  const user = await getUserByWebId(webid);
  if (user.read_d) {
    try {
      const result = await getDemographicdata(webid, session);
      response.status(200).json(result);
      return;
    } catch (error: any) {
      if (error.statusCode === 403 || error.statusCode === 401) {
        const perms = await checkAccess(webid, session);
        upsertUser(webid, perms);
        response
          .status(200)
          .send("We don't have permissions to execute this action");
      }
    }
  }
};
