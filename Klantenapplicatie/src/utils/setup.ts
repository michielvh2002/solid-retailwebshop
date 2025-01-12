import { getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { getFromTypeIndex, registerInTypeIndex } from './typeIndexHelper'
import {
  buildThing,
  createSolidDataset,
  getSolidDataset,
  getSolidDatasetWithAcl,
  getThingAll,
  getUrlAll,
  saveSolidDatasetAt,
  setThing,
} from '@inrupt/solid-client'
import { createAclFor } from './aclHelper'
import { RDF } from '@inrupt/vocab-common-rdf'
import { getStorageUrl } from './login'

const orderHistoryRdf = 'https://schema.org/Order'
const orderItemRdf = 'https://schema.org/OrderItem'
const productRdf = 'https://schema.org/Product'
const offerRdf = 'https://schema.org/Offer'
const demographicpath = '/retaildata/demographic.ttl'

export const setupPod = async (webId: string, birthDate: Date) => {
  const fetch = getDefaultSession().fetch

  //setup demographic info
  createDemographicsFile(webId, birthDate, fetch)

  //setup order-history
  const baseUrl = (await getStorageUrl(webId)) + 'order-history/'
  const orderUrls = await getFromTypeIndex(webId, orderHistoryRdf, false, fetch)
  const orderItemUrls = await getFromTypeIndex(webId, orderItemRdf, false, fetch)
  const productUrls = await getFromTypeIndex(webId, productRdf, false, fetch)
  const offerUrls = await getFromTypeIndex(webId, offerRdf, false, fetch)
  if (orderUrls.length === 0) {
    await registerInTypeIndex(
      webId,
      orderHistoryRdf,
      baseUrl + 'order-history.ttl',
      'order-history',
      false,
      fetch,
    )
  }
  if (orderItemUrls.length === 0) {
    await registerInTypeIndex(
      webId,
      orderItemRdf,
      baseUrl + 'order-item.ttl',
      'order-item',
      false,
      fetch,
    )
  }
  if (productUrls.length === 0) {
    await registerInTypeIndex(webId, productRdf, baseUrl + 'product.ttl', 'product', false, fetch)
  }
  if (offerUrls.length === 0) {
    await registerInTypeIndex(webId, offerRdf, baseUrl + 'offer.ttl', 'offer', false, fetch)
  }

  // andere
  //setup retailer access info
  await ensureRetailAccessInfoExists(webId, fetch)
}

const ensureRetailAccessInfoExists = async (webId: string, fetch: any) => {
  const baseUrl = await getStorageUrl(webId)
  const instanceUrl = baseUrl + '/retailer-access/retailer-access.ttl'
  try {
    const ds = await getSolidDataset(instanceUrl, { fetch: fetch })
    if (ds !== undefined && ds === null) {
      return
    }
  } catch (error: any) {
    if (error.statusCode === 404) {
      const newDs = createSolidDataset()
      await saveSolidDatasetAt(instanceUrl, newDs, { fetch: fetch })
      await createAclFor(instanceUrl, webId, fetch)
    }
  }
}

const createDemographicsFile = async (webId: string, birthDate: Date, fetch: any) => {
  const baseUrl = await getStorageUrl(webId)
  const instanceUrl = baseUrl + demographicpath
  try {
    const demographicset = await getSolidDatasetWithAcl(instanceUrl, { fetch: fetch })
    if (demographicset.graphs.default) return
  } catch (error: any) {
    if (error.statusCode !== 404) {
      return
    }
  }
  let solidDataset = createSolidDataset()
  const thing = buildThing({ name: 'me' })
    .addUrl(RDF.type, 'https://schema.org/Person')
    .addDate('https://schema.org/birthDate', birthDate)
    .build()
  solidDataset = setThing(solidDataset, thing)
  await saveSolidDatasetAt(instanceUrl, solidDataset, { fetch: fetch })
  await createAclFor(instanceUrl, webId, fetch)
}
