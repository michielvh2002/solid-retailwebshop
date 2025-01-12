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
exports.fetchExtendedProfiles = void 0;
const solid_client_1 = require("@inrupt/solid-client");
const vocab_common_rdf_1 = require("@inrupt/vocab-common-rdf");
const fetchExtendedProfiles = (url_1, fetch_1, ...args_1) => __awaiter(void 0, [url_1, fetch_1, ...args_1], void 0, function* (url, fetch, visited = new Set()) {
    if (visited.has(url)) {
        return [];
    }
    visited.add(url);
    try {
        const dataset = yield (0, solid_client_1.getSolidDataset)(url, { fetch: fetch });
        const things = (0, solid_client_1.getThingAll)(dataset);
        const seeAlsoUrls = things.flatMap((thing) => {
            const urls = (0, solid_client_1.getUrlAll)(thing, vocab_common_rdf_1.RDFS.seeAlso);
            return urls;
        });
        // Recursively fetch profiles linked via rdfs:seeAlso
        const childProfiles = [];
        for (const seeAlsoUrl of seeAlsoUrls) {
            const childProfile = yield (0, exports.fetchExtendedProfiles)(seeAlsoUrl, fetch, visited);
            childProfiles.push(...childProfile);
        }
        // Return the current dataset along with any child profiles
        return [dataset, ...childProfiles];
    }
    catch (error) {
        console.error(`Error fetching or parsing profile at ${url}:`, error.message);
        return [];
    }
});
exports.fetchExtendedProfiles = fetchExtendedProfiles;
