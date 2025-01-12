import { Request, Response } from "express";
import verifySolidToken from "../auth/verifyToken";
import {
  buildThing,
  getSolidDataset,
  getThingAll,
  getUrl,
  saveSolidDatasetAt,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-node";
import { authenticateAsUser } from "../auth/authentication";
import { fetchExtendedProfiles } from "../solid/extendedProfileHelpers";
import { Permissions } from "../types/permissions";

const publicTypeIndexRdf = "http://www.w3.org/ns/solid/terms#publicTypeIndex";
const storageRdf = "http://www.w3.org/ns/pim/space#storage";

export const checkPermissions = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  try {
    const webid = await verifySolidToken(request);
    const session = await authenticateAsUser();
    const result = await checkAccess(webid, session);

    response.status(200).json(result);
  } catch (error: any) {
    console.error(`Token verification failed: ${error.message}`);
    response
      .status(401)
      .json({ error: "Unauthorized: Invalid token or request" });
  }
};

export async function checkAccess(webid: string, session: Session) {
  const result: Permissions = {
    demographic: { read: false, write: false },
    orderhistory: { read: false, write: false },
  };

  try {
    const profiles = await fetchExtendedProfiles(webid, session.fetch);

    const storageUrl = await getLocationFromProfile(profiles, storageRdf);
    if (!storageUrl) {
      console.error("Unable to determine storage URL.");
      return result;
    }

    const demographicUrl = `${storageUrl}retaildata/demographic.ttl`;
    result.demographic = await checkResourceAccess(demographicUrl, session);

    const typeIndexDatasetUrl = await getLocationFromProfile(
      profiles,
      publicTypeIndexRdf
    );
    if (!typeIndexDatasetUrl) return result;

    const typeIndex = await getSolidDataset(typeIndexDatasetUrl, {
      fetch: session.fetch,
    });
    if (!typeIndex) {
      console.error("Unable to retrieve type index dataset.");
      return result;
    }

    const schemas = [
      { schema: "https://schema.org/Order" },
      { schema: "https://schema.org/OrderItem" },
      { schema: "https://schema.org/Product" },
      { schema: "https://schema.org/Offer" },
    ];

    await Promise.all(
      schemas.map(async ({ schema }) => {
        const url = resolveResourceFromTypeIndex(typeIndex, schema);
        if (url) {
          result.orderhistory =
            result.orderhistory && (await checkResourceAccess(url, session));
        }
      })
    );
  } catch (error) {
    console.error("Error checking access:", error);
  }

  return result;
}

export async function getLocationFromProfile(
  profiles: Array<SolidDataset>,
  schema: string
): Promise<string | null> {
  for (const profile of profiles) {
    const things = getThingAll(profile);
    for (const thing of things) {
      const url = getUrl(thing, schema);
      if (url) return url;
    }
  }
  return null;
}
export function resolveResourceFromTypeIndex(
  typeIndexDataset: SolidDataset,
  schema: string
): string | null {
  const things = getThingAll(typeIndexDataset);
  for (const thing of things) {
    const forClass = getUrl(thing, "http://www.w3.org/ns/solid/terms#forClass");
    if (forClass === schema) {
      return getUrl(thing, "http://www.w3.org/ns/solid/terms#instance") || null;
    }
  }
  return null;
}

async function checkResourceAccess(url: string, session: Session) {
  const access = { read: false, write: false };

  try {
    let dataset = await getSolidDataset(url, { fetch: session.fetch });
    access.read = true;
    dataset = setThing(dataset, buildThing().build());
    const res = await saveSolidDatasetAt(url, dataset, {
      fetch: session.fetch,
    });
    access.write = true;
  } catch (error: any) {
    if (error.statusCode === 404) {
      console.log(`File ${url} does not exist.`);
    } else {
      console.error(`Error accessing ${url}:`, error);
    }
  }

  return access;
}
