import type { Retailer } from '@/types/retailer'
import {
  getThing,
  getStringNoLocale,
  getBoolean,
  getSolidDataset,
  type SolidDataset,
  getThingAll,
  createThing,
  addBoolean,
  buildThing,
  type Thing,
} from '@inrupt/solid-client'

const RETAILER = {
  name: 'http://example.org/retailer#name',
  webId: 'http://example.org/retailer#webId',
  demographics: 'http://example.org/retailer#demographics',
  orderHistory: 'http://example.org/retailer#orderHistory',
  permissions: {
    read: 'http://example.org/permissions#read',
    append: 'http://example.org/permissions#append',
    write: 'http://example.org/permissions#write',
    control: 'http://example.org/permissions#control',
  },
}

export const convertRetailersRdfToTs = (retailerDataset: SolidDataset): Array<Retailer> => {
  const retailerThings = getThingAll(retailerDataset)
  const retailers: Array<Retailer> = []

  retailerThings.forEach((retailerThing) => {
    // Extract basic properties
    const name = getStringNoLocale(retailerThing, RETAILER.name) || ''
    const webIdValue = getStringNoLocale(retailerThing, RETAILER.webId) || ''

    // Extract demographics permissions
    const demographics = {
      read: getBoolean(retailerThing, `${RETAILER.demographics}#read`) || false,
      append: getBoolean(retailerThing, `${RETAILER.demographics}#append`) || false,
      write: getBoolean(retailerThing, `${RETAILER.demographics}#write`) || false,
      control: getBoolean(retailerThing, `${RETAILER.demographics}#control`) || false,
    }

    // Extract orderHistory permissions
    const orderHistory = {
      read: getBoolean(retailerThing, `${RETAILER.orderHistory}#read`) || false,
      append: getBoolean(retailerThing, `${RETAILER.orderHistory}#append`) || false,
      write: getBoolean(retailerThing, `${RETAILER.orderHistory}#write`) || false,
      control: getBoolean(retailerThing, `${RETAILER.orderHistory}#control`) || false,
    }

    // Construct the Retailer object
    const retailer: Retailer = {
      webId: webIdValue,
      name,
      demographics,
      orderHistory,
    }

    retailers.push(retailer)
  })
  return retailers
}

export const convertRetailerTsToRdf = (retailers: Array<Retailer>): Array<Thing> => {
  const things: Array<Thing> = []
  retailers.forEach((retailer) => {
    let retailerThing = buildThing(createThing({ name: retailer.name }))
    retailerThing = retailerThing
      .addStringNoLocale(RETAILER.webId, retailer.webId)
      .addStringNoLocale(RETAILER.name, retailer.name)

    //Demographics
    for (const [key, value] of Object.entries(retailer.demographics)) {
      retailerThing = retailerThing.addBoolean(`${RETAILER.demographics}#${key}`, value)
    }

    //OrderHistory
    for (const [key, value] of Object.entries(retailer.orderHistory)) {
      retailerThing = retailerThing.addBoolean(`${RETAILER.orderHistory}#${key}`, value)
    }
    things.push(retailerThing.build())
  })
  return things
}
