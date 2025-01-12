import { RDF } from "@inrupt/vocab-common-rdf";
import { OrderItem } from "../types/orderItem";
import {
  buildThing,
  createThing,
  getSolidDataset,
  saveSolidDatasetAt,
  setThing,
  getThing,
  getUrlAll,
  getDatetime,
  getThingAll,
  getDecimal,
  getStringNoLocale,
  getUrl,
  getInteger,
} from "@inrupt/solid-client";
import { fetchExtendedProfiles } from "./extendedProfileHelpers";
import { Session } from "@inrupt/solid-client-authn-node";
import {
  getLocationFromProfile,
  resolveResourceFromTypeIndex,
} from "../controllers/permissions";
const publicTypeIndexRdf = "http://www.w3.org/ns/solid/terms#publicTypeIndex";

export const writeOrderToPod = async (
  orderItems: Array<OrderItem>,
  webid: string,
  session: Session
) => {
  const profiles = await fetchExtendedProfiles(webid, session.fetch);
  const typeIndexDatasetUrl = await getLocationFromProfile(
    profiles,
    publicTypeIndexRdf
  );
  const typeIndex = await getSolidDataset(typeIndexDatasetUrl!, {
    fetch: session.fetch,
  });
  const offerFileUrl = resolveResourceFromTypeIndex(
    typeIndex,
    "https://schema.org/Offer"
  );
  const productFileUrl = resolveResourceFromTypeIndex(
    typeIndex,
    "https://schema.org/Product"
  );
  const orderItemFileUrl = resolveResourceFromTypeIndex(
    typeIndex,
    "https://schema.org/OrderItem"
  );
  const orderFileUrl = resolveResourceFromTypeIndex(
    typeIndex,
    "https://schema.org/Order"
  );
  const orderItemUrls: string[] = [];
  for (const orderItem of orderItems) {
    const offerThingUrl = await generateOffer(
      orderItem.product.price,
      orderItem.product.currency,
      offerFileUrl!,
      session.fetch
    );
    const productUrl = await generateProduct(
      orderItem.product.name,
      orderItem.product.category,
      offerThingUrl,
      productFileUrl!,
      session.fetch
    );
    const orderItemUrl = await generateOrderItem(
      orderItem.quantity,
      productUrl!,
      orderItemFileUrl!,
      session.fetch
    );
    orderItemUrls.push(orderItemUrl);
  }
  const order = await generateOrder(
    orderItemUrls,
    session.info.webId!,
    orderFileUrl!,
    session.fetch
  );
};

const generateOffer = async (
  price: number,
  currency: string,
  path: string,
  fetch: any
) => {
  let dataset = await getSolidDataset(path, { fetch: fetch });

  const offer = buildThing(createThing())
    .addUrl(RDF.type, "https://schema.org/Offer")
    .setDecimal("https://schema.org/price", price)
    .setStringNoLocale("https://schema.org/priceCurrency", currency)
    .build();

  dataset = setThing(dataset, offer);
  try {
    const savedSolidDataset = await saveSolidDatasetAt(path, dataset, {
      fetch: fetch,
    });
    let thingUrl: string = offer.url;
    thingUrl = thingUrl.substring(thingUrl.lastIndexOf("/") + 1);
    return path + "#" + thingUrl;
  } catch (error) {
    throw error;
  }
};

const generateProduct = async (
  productName: string,
  productCategory: string,
  offerUrl: string,
  path: string,
  fetch: any
) => {
  let dataset = await getSolidDataset(path, { fetch: fetch });

  const product = buildThing(createThing())
    .addUrl(RDF.type, "https://schema.org/Product")
    .addStringNoLocale("https://schema.org/name", productName)
    .addStringNoLocale("https://schema.org/category", productCategory)
    .addUrl("https://schema.org/offers", offerUrl)
    .build();

  dataset = setThing(dataset, product);
  try {
    const savedSolidDataset = await saveSolidDatasetAt(path, dataset, {
      fetch: fetch,
    });
    let thingUrl: string = product.url;
    thingUrl = thingUrl.substring(thingUrl.lastIndexOf("/") + 1);
    return path + "#" + thingUrl;
  } catch (error) {
    throw error;
  }
};

const generateOrderItem = async (
  quantity: number,
  productUrl: string,
  path: string,
  fetch: any
) => {
  let dataset = await getSolidDataset(path, { fetch: fetch });

  const orderItem = buildThing(createThing())
    .addUrl(RDF.type, "https://schema.org/OrderItem")
    .setInteger("https://schema.org/orderQuantity", quantity)
    .addUrl("https://schema.org/orderedItem", productUrl)
    .build();

  dataset = setThing(dataset, orderItem);
  try {
    const savedSolidDataset = await saveSolidDatasetAt(path, dataset, {
      fetch: fetch,
    });
    let thingUrl: string = orderItem.url;
    thingUrl = thingUrl.substring(thingUrl.lastIndexOf("/") + 1);
    return path + "#" + thingUrl;
  } catch (error) {
    throw error;
  }
};

const generateOrder = async (
  orderItemUrls: Array<string>,
  retailerWebId: string,
  path: string,
  fetch: any
) => {
  let dataset = await getSolidDataset(path, { fetch: fetch });
  let order = buildThing(createThing())
    .addUrl(RDF.type, "https://schema.org/Order")
    .addDatetime("https://schema.org/orderDate", new Date())
    .addUrl("https://schema.org/seller", retailerWebId);
  orderItemUrls.forEach((itemUrl) => {
    order = order.addUrl("https://schema.org/orderedItem", itemUrl);
  });

  const updatedOrder = order.build();
  dataset = setThing(dataset, updatedOrder);
  try {
    const savedSolidDataset = await saveSolidDatasetAt(path, dataset, {
      fetch: fetch,
    });
    let thingUrl: string = updatedOrder.url;
    thingUrl = thingUrl.substring(thingUrl.lastIndexOf("/") + 1);
    return path + "#" + thingUrl;
  } catch (error) {
    throw error;
  }
};

export const getOrdersFromPod = async (webid: string, session: Session) => {
  const profiles = await fetchExtendedProfiles(webid, session.fetch);
  const typeIndexDatasetUrl = await getLocationFromProfile(
    profiles,
    publicTypeIndexRdf
  );
  const typeIndex = await getSolidDataset(typeIndexDatasetUrl!, {
    fetch: session.fetch,
  });
  const orderFileUrl = resolveResourceFromTypeIndex(
    typeIndex,
    "https://schema.org/Order"
  );

  try {
    const orders = await getOrderDetails(orderFileUrl!, session.fetch);
    return orders;
  } catch (error) {
    console.error("Error fetching order details:", error);
  }
};

async function getOrderDetails(orderUrl: string, fetch: any) {
  const dataset = await getSolidDataset(orderUrl, { fetch });
  const orders = getThingAll(dataset);

  const fullOrders = await Promise.all(
    orders.map(async (order) => {
      const orderedItems = getUrlAll(order, "https://schema.org/orderedItem");
      const orderedItemsDetails = await Promise.all(
        orderedItems.map((itemUrl) => getOrderItemDetails(itemUrl, fetch))
      );

      return {
        type: getUrlAll(
          order,
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        ),
        orderDate: getDatetime(order, "https://schema.org/orderDate"),
        seller: getUrlAll(order, "https://schema.org/seller"),
        orderedItems: orderedItemsDetails,
      };
    })
  );

  return fullOrders;
}

async function getOrderItemDetails(itemUrl: string, fetch: any) {
  const dataset = await getSolidDataset(itemUrl, { fetch });
  const item = getThing(dataset, itemUrl);

  if (!item) {
    return { url: itemUrl }; // Return URL if no details found
  }

  const orderItemDetails: any = {
    type: getUrlAll(item, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
    orderQuantity: getInteger(item, "https://schema.org/orderQuantity") || null,
    product: null,
  };

  const productUrl = getUrl(item, "https://schema.org/orderedItem");
  if (productUrl) {
    const productDetails = await getProductDetails(productUrl, fetch);
    orderItemDetails.product = productDetails;
  }

  return orderItemDetails;
}

async function getProductDetails(productUrl: string, fetch: any) {
  const dataset = await getSolidDataset(productUrl, { fetch });
  const product = getThing(dataset, productUrl);

  if (!product) {
    return { url: productUrl }; // Return URL if no details found
  }

  const productDetails: any = {
    type: getUrlAll(product, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
    name: getStringNoLocale(product, "https://schema.org/name"),
    category: getStringNoLocale(product, "https://schema.org/category"),
    offer: null,
  };

  const offerUrl = getUrl(product, "https://schema.org/offers");
  if (offerUrl) {
    const offerDetails = await getOfferDetails(offerUrl, fetch);
    productDetails.offer = offerDetails;
  }

  return productDetails;
}

async function getOfferDetails(offerUrl: string, fetch: any) {
  const dataset = await getSolidDataset(offerUrl, { fetch });
  const offer = getThing(dataset, offerUrl);

  if (!offer) {
    return { url: offerUrl }; // Return URL if no details found
  }

  return {
    type: getUrlAll(offer, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
    price: getDecimal(offer, "https://schema.org/price") || null,
    priceCurrency:
      getStringNoLocale(offer, "https://schema.org/priceCurrency") || null,
  };
}
