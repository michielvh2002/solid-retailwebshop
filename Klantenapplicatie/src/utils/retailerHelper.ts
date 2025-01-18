import type { Retailer } from '@/types/retailer'
import {
  createThing,
  deleteSolidDataset,
  getSolidDataset,
  getThing,
  removeThing,
  saveSolidDatasetAt,
  setThing,
} from '@inrupt/solid-client'
import { getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { convertRetailersRdfToTs, convertRetailerTsToRdf } from './rdfHelper'
import { editDemographicAclForAgent, editOrderHistoryAclForAgent } from './aclHelper'
import { getStorageUrl } from './login'

export const getRegisteredRetailers = async (): Promise<Array<Retailer>> => {
  const session = getDefaultSession()
  if (!session.info.isLoggedIn) throw new Error('User is not logged in')
  const fetch = session.fetch
  const webId = session.info.webId!
  const baseUrl = await getStorageUrl(webId)
  const instanceUrl = baseUrl + '/retailer-access/retailer-access.ttl'
  const dataset = await getSolidDataset(instanceUrl, { fetch: fetch })
  const retailers = convertRetailersRdfToTs(dataset)
  return retailers
}

export const updateRegisteredRetailers = async (retailers: Array<Retailer>) => {
  const session = getDefaultSession()

  if (!session.info.isLoggedIn) throw new Error('User is not logged in')
  const fetch = session.fetch
  const webId = session.info.webId!

  retailers.forEach(async (retailer) => {
    await editOrderHistoryAclForAgent(webId, retailer, fetch)
    await editDemographicAclForAgent(webId, retailer, fetch)
  })

  const baseUrl = await getStorageUrl(webId)
  const instanceUrl = baseUrl + '/retailer-access/retailer-access.ttl'
  let dataset = await getSolidDataset(instanceUrl, { fetch: fetch })

  const retailersToRdf = convertRetailerTsToRdf(retailers)
  retailersToRdf.forEach((thing) => {
    dataset = setThing(dataset, thing)
  })
  await saveSolidDatasetAt(instanceUrl, dataset, { fetch: fetch })
}

export const deleteRetailer = async (retailer: Retailer) => {
  retailer.demographics.append = false
  retailer.demographics.write = false
  retailer.demographics.read = false
  retailer.demographics.control = false

  retailer.orderHistory.append = false
  retailer.orderHistory.write = false
  retailer.orderHistory.read = false
  retailer.orderHistory.control = false
  const session = getDefaultSession()
  if (!session.info.isLoggedIn) throw new Error('User is not logged in')
  const fetch = session.fetch
  const webId = session.info.webId!
  const baseUrl = await getStorageUrl(webId)
  const instanceUrl = baseUrl + '/retailer-access/retailer-access.ttl'
  await updateRegisteredRetailers([retailer])

  let dataset = await getSolidDataset(instanceUrl, { fetch: fetch })
  const thing = createThing({ name: retailer.name })
  dataset = removeThing(dataset, thing.url)
  await saveSolidDatasetAt(instanceUrl, dataset, { fetch: fetch })
}
