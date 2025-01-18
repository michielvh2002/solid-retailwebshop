import {
  buildThing,
  createSolidDataset,
  getResourceAcl,
  getSolidDataset,
  getSolidDatasetWithAcl,
  getThingAll,
  getUrlAll,
  getUrl,
  hasAccessibleAcl,
  hasFallbackAcl,
  hasResourceAcl,
  saveSolidDatasetAt,
  setAgentResourceAccess,
  setThing,
  type SolidDataset,
} from '@inrupt/solid-client'
import { fetchExtendedProfiles } from './extendedProfileHelpers'
import { RDF } from '@inrupt/vocab-common-rdf'
import { SOLID } from '@inrupt/vocab-solid'
import { createAclFor } from './aclHelper'

const publicTypeIndexRdf = 'http://www.w3.org/ns/solid/terms#publicTypeIndex'
const privateTypeIndexRdf = 'http://www.w3.org/ns/solid/terms#privateTypeIndex'

export const getFromTypeIndex = async (
  webId: string,
  rdfClass: string,
  isPrivate: boolean,
  fetch: any,
): Promise<string[]> => {
  const profiles = await fetchExtendedProfiles(webId, fetch)
  const typeIndexUrl = retrieveTypeIndexUrl(profiles, isPrivate)
  const typeIndexDataSet = await getSolidDataset(typeIndexUrl, { fetch: fetch })
  const things = getThingAll(typeIndexDataSet)
  const urls = []
  for (const thing of things) {
    const forClass = getUrl(thing, 'http://www.w3.org/ns/solid/terms#forClass')
    if (forClass === rdfClass) {
      const url = getUrl(thing, 'http://www.w3.org/ns/solid/terms#instance')
      if (url) urls.push(url)
    }
  }
  return urls
}

export const registerInTypeIndex = async (
  webId: string,
  rdfClass: string,
  instanceUrl: string,
  name: string,
  isPrivate: boolean,
  fetch: any,
) => {
  const profiles = await fetchExtendedProfiles(webId, fetch)
  const typeIndexUrl = retrieveTypeIndexUrl(profiles, isPrivate)
  await createAclFor(typeIndexUrl, webId, fetch)
  let typeIndex = await getSolidDataset(typeIndexUrl, { fetch: fetch })

  const thing = buildThing({ name: name })
    .addUrl(RDF.type, SOLID.TypeRegistration)
    .addUrl(SOLID.forClass, rdfClass)
    .addUrl(SOLID.instance, instanceUrl)
    .build()
  typeIndex = setThing(typeIndex, thing)

  const solidDataset = createSolidDataset()
  await saveSolidDatasetAt(typeIndexUrl, typeIndex, { fetch: fetch })
  await saveSolidDatasetAt(instanceUrl, solidDataset, { fetch: fetch })
  await createAclFor(instanceUrl, webId, fetch)
}

const retrieveTypeIndexUrl = (profiles: Array<SolidDataset>, isPrivate: boolean): string => {
  for (let i = 0; i < profiles.length; i++) {
    const things = getThingAll(profiles[i])
    const typeIndex = things.flatMap((thing) =>
      getUrlAll(thing, isPrivate ? privateTypeIndexRdf : publicTypeIndexRdf),
    )
    if (typeIndex.length > 0) {
      return typeIndex[0]
    }
  }
  throw new Error('No typeindex found')
}

export const giveAccessToTypeIndex = async (
  webId: string,
  agentWebId: string,
  isPrivate: boolean,
  fetch: any,
) => {
  const profiles = await fetchExtendedProfiles(webId, fetch)
  const typeIndexUrl = retrieveTypeIndexUrl(profiles, isPrivate)
  const typeIndex = await getSolidDatasetWithAcl(typeIndexUrl, { fetch: fetch })
  let resourceAcl
  if (!hasResourceAcl(typeIndex)) {
    if (!hasAccessibleAcl(typeIndex)) {
      throw new Error(
        'The current user does not have permission to change access rights to this Resource.',
      )
    }
    if (!hasFallbackAcl(typeIndex)) {
      throw new Error(
        'The current user does not have permission to see who currently has access to this Resource.',
      )
    }
    resourceAcl = await createAclFor(typeIndexUrl, webId, fetch)
  } else {
    resourceAcl = getResourceAcl(typeIndex)
  }
  const updatedAcl = setAgentResourceAccess(resourceAcl!, agentWebId, {
    read: true,
    write: false,
    append: false,
    control: false,
  })
}
