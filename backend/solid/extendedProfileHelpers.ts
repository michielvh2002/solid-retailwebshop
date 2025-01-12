import { getSolidDataset, getThingAll, getUrlAll, type SolidDataset } from '@inrupt/solid-client'
import { RDFS } from '@inrupt/vocab-common-rdf'

export const fetchExtendedProfiles = async (
  url: string,
  fetch: any,
  visited = new Set(),
): Promise<Array<SolidDataset>> => {
  if (visited.has(url)) {
    return []
  }

  visited.add(url)

  try {
    const dataset = await getSolidDataset(url, { fetch: fetch })
    const things = getThingAll(dataset)
    const seeAlsoUrls = things.flatMap((thing) => {
      const urls = getUrlAll(thing, RDFS.seeAlso)
      return urls
    })

    // Recursively fetch profiles linked via rdfs:seeAlso
    const childProfiles = []
    for (const seeAlsoUrl of seeAlsoUrls) {
      const childProfile = await fetchExtendedProfiles(seeAlsoUrl, fetch, visited)
      childProfiles.push(...childProfile)
    }

    // Return the current dataset along with any child profiles
    return [dataset, ...childProfiles]
  } catch (error: any) {
    console.error(`Error fetching or parsing profile at ${url}:`, error.message)
    return []
  }
}
