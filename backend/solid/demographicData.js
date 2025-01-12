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
exports.getDemographicdata = void 0;
const extendedProfileHelpers_1 = require("./extendedProfileHelpers");
const permissions_1 = require("../controllers/permissions");
const solid_client_1 = require("@inrupt/solid-client");
const getDemographicdata = (webid, session) => __awaiter(void 0, void 0, void 0, function* () {
    const profiles = yield (0, extendedProfileHelpers_1.fetchExtendedProfiles)(webid, session.fetch);
    const storageRdf = "http://www.w3.org/ns/pim/space#storage";
    const storageUrl = yield (0, permissions_1.getLocationFromProfile)(profiles, storageRdf);
    if (!storageUrl) {
        throw Error("Unable to determine storage URL.");
    }
    // Check /retaildata/demographic.ttl
    const demographicUrl = `${storageUrl}retaildata/demographic.ttl`;
    const result = yield getBirthDateFromDataset(demographicUrl, session.fetch);
    return result;
});
exports.getDemographicdata = getDemographicdata;
function getBirthDateFromDataset(datasetUrl, fetch) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch the dataset containing the Person
            const dataset = yield (0, solid_client_1.getSolidDataset)(datasetUrl, { fetch });
            // Get all the "things" (resources) from the dataset
            const things = (0, solid_client_1.getThingAll)(dataset);
            if (things.length === 0) {
                throw new Error("Person resource not found in dataset.");
            }
            for (const thing of things) {
                // Retrieve the 'birthDate' using getStringNoLocale (for literals)
                const birthDate = (0, solid_client_1.getDate)(thing, "https://schema.org/birthDate");
                if (birthDate) {
                    return birthDate;
                }
                else {
                    console.log("Birthdate not found.");
                    return null;
                }
            }
        }
        catch (error) {
            console.error("Error fetching birthdate:", error);
            throw error;
        }
    });
}
