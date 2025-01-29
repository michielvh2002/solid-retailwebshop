import type { Retailer } from '@/types/retailer'
import {
  createAcl,
  getResourceAcl,
  getSolidDatasetWithAcl,
  hasAccessibleAcl,
  hasFallbackAcl,
  hasResourceAcl,
  saveAclFor,
  setAgentResourceAccess,
} from '@inrupt/solid-client'
import { getStorageUrl } from './login'
import { getFromTypeIndex } from './typeIndexHelper'

const orderHistoryRdf = 'https://schema.org/Order'
const orderItemRdf = 'https://schema.org/OrderItem'
const productRdf = 'https://schema.org/Product'
const offerRdf = 'https://schema.org/Offer'

export const createAclFor = async (instanceUrl: string, webid: string, fetch: any) => {
  const ds = await getSolidDatasetWithAcl(instanceUrl, { fetch: fetch })
  if (hasResourceAcl(ds)) {
    return
  }
  let dsWithAcl = createAcl(ds)
  dsWithAcl = setAgentResourceAccess(dsWithAcl, webid, {
    read: true,
    append: true,
    write: true,
    control: true,
  })

  return await saveAclFor(ds, dsWithAcl, { fetch: fetch })
}

export const editOrderHistoryAclForAgent = async (
  webId: string,
  retailAccessInfo: Retailer,
  fetch: any,
) => {
  const orderUrls = await getFromTypeIndex(webId, orderHistoryRdf, false, fetch)
  const orderItemUrls = await getFromTypeIndex(webId, orderItemRdf, false, fetch)
  const productUrls = await getFromTypeIndex(webId, productRdf, false, fetch)
  const offerUrls = await getFromTypeIndex(webId, offerRdf, false, fetch)
  const orderHistoryDocs: Array<string> = [
    orderUrls[0],
    orderItemUrls[0],
    productUrls[0],
    offerUrls[0],
  ]
  orderHistoryDocs.forEach(async (doc: string) => {
    const datasetWithAcl = await getSolidDatasetWithAcl(doc, { fetch: fetch })
    let resourceAcl

    if (!hasResourceAcl(datasetWithAcl)) {
      if (!hasAccessibleAcl(datasetWithAcl)) {
        throw new Error(
          'The current user does not have permission to change access rights to this Resource.',
        )
      }
      if (!hasFallbackAcl(datasetWithAcl)) {
        throw new Error(
          'The current user does not have permission to see who currently has access to this Resource.',
        )
      }
      resourceAcl = await createAclFor(doc, webId, fetch)
    } else {
      resourceAcl = getResourceAcl(datasetWithAcl)
    }

    const updatedAcl = setAgentResourceAccess(
      resourceAcl!,
      retailAccessInfo.webId,
      retailAccessInfo.orderHistory,
    )
    await saveAclFor(datasetWithAcl, updatedAcl, { fetch: fetch })
  })
}

export const editDemographicAclForAgent = async (
  webId: string,
  retailAccessInfo: Retailer,
  fetch: any,
) => {
  const baseUrl = await getStorageUrl(webId)
  const demographicUrl = baseUrl + '/retaildata/demographic.ttl'
  await createAclFor(demographicUrl, webId, fetch)
  const datasetWithAcl = await getSolidDatasetWithAcl(demographicUrl, { fetch: fetch })
  let resourceAcl

  if (!hasResourceAcl(datasetWithAcl)) {
    if (!hasAccessibleAcl(datasetWithAcl)) {
      throw new Error(
        'The current user does not have permission to change access rights to this Resource.',
      )
    }
    if (!hasFallbackAcl(datasetWithAcl)) {
      throw new Error(
        'The current user does not have permission to see who currently has access to this Resource.',
      )
    }
    resourceAcl = await createAclFor(demographicUrl, webId, fetch)
  } else {
    resourceAcl = getResourceAcl(datasetWithAcl)
  }

  const updatedAcl = setAgentResourceAccess(
    resourceAcl!,
    retailAccessInfo.webId,
    retailAccessInfo.demographics,
  )
  await saveAclFor(datasetWithAcl, updatedAcl, { fetch: fetch })
}
