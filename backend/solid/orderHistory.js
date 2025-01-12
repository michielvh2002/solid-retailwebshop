"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersFromPod = exports.writeOrderToPod = void 0;
const vocab_common_rdf_1 = require("@inrupt/vocab-common-rdf");
const solid_client_1 = require("@inrupt/solid-client");
const extendedProfileHelpers_1 = require("./extendedProfileHelpers");
const permissions_1 = require("../controllers/permissions");
const publicTypeIndexRdf = "http://www.w3.org/ns/solid/terms#publicTypeIndex";
const writeOrderToPod = (orderItems, webid, session) => __awaiter(void 0, void 0, void 0, function* () {
    const profiles = yield (0, extendedProfileHelpers_1.fetchExtendedProfiles)(webid, session.fetch);
    const typeIndexDatasetUrl = yield (0, permissions_1.getLocationFromProfile)(profiles, publicTypeIndexRdf);
    const typeIndex = yield (0, solid_client_1.getSolidDataset)(typeIndexDatasetUrl, {
        fetch: session.fetch,
    });
    const offerFileUrl = (0, permissions_1.resolveResourceFromTypeIndex)(typeIndex, "https://schema.org/Offer");
    const productFileUrl = (0, permissions_1.resolveResourceFromTypeIndex)(typeIndex, "https://schema.org/Product");
    const orderItemFileUrl = (0, permissions_1.resolveResourceFromTypeIndex)(typeIndex, "https://schema.org/OrderItem");
    const orderFileUrl = (0, permissions_1.resolveResourceFromTypeIndex)(typeIndex, "https://schema.org/Order");
    const orderItemUrls = [];
    for (const orderItem of orderItems) {
        const offerThingUrl = yield generateOffer(orderItem.product.price, orderItem.product.currency, offerFileUrl, session.fetch);
        const productUrl = yield generateProduct(orderItem.product.name, orderItem.product.category, offerThingUrl, productFileUrl, session.fetch);
        const orderItemUrl = yield generateOrderItem(orderItem.quantity, productUrl, orderItemFileUrl, session.fetch);
        orderItemUrls.push(orderItemUrl);
    }
    const order = yield generateOrder(orderItemUrls, session.info.webId, orderFileUrl, session.fetch);
});
exports.writeOrderToPod = writeOrderToPod;
const generateOffer = (price, currency, path, fetch) => __awaiter(void 0, void 0, void 0, function* () {
    let dataset = yield (0, solid_client_1.getSolidDataset)(path, { fetch: fetch });
    const offer = (0, solid_client_1.buildThing)((0, solid_client_1.createThing)())
        .addUrl(vocab_common_rdf_1.RDF.type, "https://schema.org/Offer")
        .setDecimal("https://schema.org/price", price)
        .setStringNoLocale("https://schema.org/priceCurrency", currency)
        .build();
    dataset = (0, solid_client_1.setThing)(dataset, offer);
    try {
        const savedSolidDataset = yield (0, solid_client_1.saveSolidDatasetAt)(path, dataset, {
            fetch: fetch,
        });
        let thingUrl = offer.url;
        thingUrl = thingUrl.substring(thingUrl.lastIndexOf("/") + 1);
        return path + "#" + thingUrl;
    }
    catch (error) {
        throw error;
    }
});
const generateProduct = (productName, productCategory, offerUrl, path, fetch) => __awaiter(void 0, void 0, void 0, function* () {
    let dataset = yield (0, solid_client_1.getSolidDataset)(path, { fetch: fetch });
    const product = (0, solid_client_1.buildThing)((0, solid_client_1.createThing)())
        .addUrl(vocab_common_rdf_1.RDF.type, "https://schema.org/Product")
        .addStringNoLocale("https://schema.org/name", productName)
        .addStringNoLocale("https://schema.org/category", productCategory)
        .addUrl("https://schema.org/offers", offerUrl)
        .build();
    dataset = (0, solid_client_1.setThing)(dataset, product);
    try {
        const savedSolidDataset = yield (0, solid_client_1.saveSolidDatasetAt)(path, dataset, {
            fetch: fetch,
        });
        let thingUrl = product.url;
        thingUrl = thingUrl.substring(thingUrl.lastIndexOf("/") + 1);
        return path + "#" + thingUrl;
    }
    catch (error) {
        throw error;
    }
});
const generateOrderItem = (quantity, productUrl, path, fetch) => __awaiter(void 0, void 0, void 0, function* () {
    let dataset = yield (0, solid_client_1.getSolidDataset)(path, { fetch: fetch });
    const orderItem = (0, solid_client_1.buildThing)((0, solid_client_1.createThing)())
        .addUrl(vocab_common_rdf_1.RDF.type, "https://schema.org/OrderItem")
        .setInteger("https://schema.org/orderQuantity", quantity)
        .addUrl("https://schema.org/orderedItem", productUrl)
        .build();
    dataset = (0, solid_client_1.setThing)(dataset, orderItem);
    try {
        const savedSolidDataset = yield (0, solid_client_1.saveSolidDatasetAt)(path, dataset, {
            fetch: fetch,
        });
        let thingUrl = orderItem.url;
        thingUrl = thingUrl.substring(thingUrl.lastIndexOf("/") + 1);
        return path + "#" + thingUrl;
    }
    catch (error) {
        throw error;
    }
});
const generateOrder = (orderItemUrls, retailerWebId, path, fetch) => __awaiter(void 0, void 0, void 0, function* () {
    let dataset = yield (0, solid_client_1.getSolidDataset)(path, { fetch: fetch });
    let order = (0, solid_client_1.buildThing)((0, solid_client_1.createThing)())
        .addUrl(vocab_common_rdf_1.RDF.type, "https://schema.org/Order")
        .addDatetime("https://schema.org/orderDate", new Date())
        .addUrl("https://schema.org/seller", retailerWebId);
    orderItemUrls.forEach((itemUrl) => {
        order = order.addUrl("https://schema.org/orderedItem", itemUrl);
    });
    const updatedOrder = order.build();
    dataset = (0, solid_client_1.setThing)(dataset, updatedOrder);
    try {
        const savedSolidDataset = yield (0, solid_client_1.saveSolidDatasetAt)(path, dataset, {
            fetch: fetch,
        });
        let thingUrl = updatedOrder.url;
        thingUrl = thingUrl.substring(thingUrl.lastIndexOf("/") + 1);
        return path + "#" + thingUrl;
    }
    catch (error) {
        throw error;
    }
});
const getOrdersFromPod = (webid, session) => __awaiter(void 0, void 0, void 0, function* () {
    const profiles = yield (0, extendedProfileHelpers_1.fetchExtendedProfiles)(webid, session.fetch);
    const typeIndexDatasetUrl = yield (0, permissions_1.getLocationFromProfile)(profiles, publicTypeIndexRdf);
    const typeIndex = yield (0, solid_client_1.getSolidDataset)(typeIndexDatasetUrl, {
        fetch: session.fetch,
    });
    const orderFileUrl = (0, permissions_1.resolveResourceFromTypeIndex)(typeIndex, "https://schema.org/Order");
    try {
        const orders = yield getOrderDetails(orderFileUrl, session.fetch);
        return orders;
    }
    catch (error) {
        console.error("Error fetching order details:", error);
    }
});
exports.getOrdersFromPod = getOrdersFromPod;
function getOrderDetails(orderUrl, fetch) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataset = yield (0, solid_client_1.getSolidDataset)(orderUrl, { fetch });
        const orders = (0, solid_client_1.getThingAll)(dataset);
        const fullOrders = yield Promise.all(orders.map((order) => __awaiter(this, void 0, void 0, function* () {
            const orderedItems = (0, solid_client_1.getUrlAll)(order, "https://schema.org/orderedItem");
            const orderedItemsDetails = yield Promise.all(orderedItems.map((itemUrl) => getOrderItemDetails(itemUrl, fetch)));
            return {
                type: (0, solid_client_1.getUrlAll)(order, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
                orderDate: (0, solid_client_1.getDatetime)(order, "https://schema.org/orderDate"),
                seller: (0, solid_client_1.getUrlAll)(order, "https://schema.org/seller"),
                orderedItems: orderedItemsDetails,
            };
        })));
        return fullOrders;
    });
}
function getOrderItemDetails(itemUrl, fetch) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataset = yield (0, solid_client_1.getSolidDataset)(itemUrl, { fetch });
        const item = (0, solid_client_1.getThing)(dataset, itemUrl);
        if (!item) {
            return { url: itemUrl }; // Return URL if no details found
        }
        const orderItemDetails = {
            type: (0, solid_client_1.getUrlAll)(item, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            orderQuantity: (0, solid_client_1.getInteger)(item, "https://schema.org/orderQuantity") || null,
            product: null,
        };
        const productUrl = (0, solid_client_1.getUrl)(item, "https://schema.org/orderedItem");
        if (productUrl) {
            const productDetails = yield getProductDetails(productUrl, fetch);
            orderItemDetails.product = productDetails;
        }
        return orderItemDetails;
    });
}
function getProductDetails(productUrl, fetch) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataset = yield (0, solid_client_1.getSolidDataset)(productUrl, { fetch });
        const product = (0, solid_client_1.getThing)(dataset, productUrl);
        if (!product) {
            return { url: productUrl }; // Return URL if no details found
        }
        const productDetails = {
            type: (0, solid_client_1.getUrlAll)(product, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            name: (0, solid_client_1.getStringNoLocale)(product, "https://schema.org/name"),
            category: (0, solid_client_1.getStringNoLocale)(product, "https://schema.org/category"),
            offer: null,
        };
        const offerUrl = (0, solid_client_1.getUrl)(product, "https://schema.org/offers");
        if (offerUrl) {
            const offerDetails = yield getOfferDetails(offerUrl, fetch);
            productDetails.offer = offerDetails;
        }
        return productDetails;
    });
}
function getOfferDetails(offerUrl, fetch) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataset = yield (0, solid_client_1.getSolidDataset)(offerUrl, { fetch });
        const offer = (0, solid_client_1.getThing)(dataset, offerUrl);
        if (!offer) {
            return { url: offerUrl }; // Return URL if no details found
        }
        return {
            type: (0, solid_client_1.getUrlAll)(offer, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            price: (0, solid_client_1.getDecimal)(offer, "https://schema.org/price") || null,
            priceCurrency: (0, solid_client_1.getStringNoLocale)(offer, "https://schema.org/priceCurrency") || null,
        };
    });
}
