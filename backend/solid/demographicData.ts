import { Session } from "@inrupt/solid-client-authn-node";
import { fetchExtendedProfiles } from "./extendedProfileHelpers";
import { getLocationFromProfile } from "../controllers/permissions";
import { getDate, getSolidDataset, getThingAll } from "@inrupt/solid-client";

export const getDemographicdata = async (webid: string, session: Session) => {
  const profiles = await fetchExtendedProfiles(webid, session.fetch);
  const storageRdf = "http://www.w3.org/ns/pim/space#storage";

  const storageUrl = await getLocationFromProfile(profiles, storageRdf);
  if (!storageUrl) {
    throw Error("Unable to determine storage URL.");
  }

  // Check /retaildata/demographic.ttl
  const demographicUrl = `${storageUrl}retaildata/demographic.ttl`;
  const result = await getBirthDateFromDataset(demographicUrl, session.fetch);
  return result;
};

async function getBirthDateFromDataset(datasetUrl: string, fetch: any) {
  try {
    // Fetch the dataset containing the Person
    const dataset = await getSolidDataset(datasetUrl, { fetch });

    // Get all the "things" (resources) from the dataset
    const things = getThingAll(dataset);

    if (things.length === 0) {
      throw new Error("Person resource not found in dataset.");
    }

    for (const thing of things) {
      // Retrieve the 'birthDate' using getStringNoLocale (for literals)
      const birthDate = getDate(thing, "https://schema.org/birthDate");

      if (birthDate) {
        return birthDate;
      } else {
        console.log("Birthdate not found.");
        return null;
      }
    }
  } catch (error) {
    console.error("Error fetching birthdate:", error);
    throw error;
  }
}
