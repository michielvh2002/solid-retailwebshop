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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = void 0;
exports.checkAccess = checkAccess;
exports.getLocationFromProfile = getLocationFromProfile;
exports.resolveResourceFromTypeIndex = resolveResourceFromTypeIndex;
const verifyToken_1 = __importDefault(require("../auth/verifyToken"));
const solid_client_1 = require("@inrupt/solid-client");
const authentication_1 = require("../auth/authentication");
const extendedProfileHelpers_1 = require("../solid/extendedProfileHelpers");
const publicTypeIndexRdf = "http://www.w3.org/ns/solid/terms#publicTypeIndex";
const storageRdf = "http://www.w3.org/ns/pim/space#storage";
const checkPermissions = (_a) => __awaiter(void 0, [_a], void 0, function* ({ request, response, }) {
    try {
        const webid = yield (0, verifyToken_1.default)(request);
        const session = yield (0, authentication_1.authenticateAsUser)();
        const result = yield checkAccess(webid, session);
        response.status(200).json(result);
    }
    catch (error) {
        console.error(`Token verification failed: ${error.message}`);
        response
            .status(401)
            .json({ error: "Unauthorized: Invalid token or request" });
    }
});
exports.checkPermissions = checkPermissions;
function checkAccess(webid, session) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = {
            demographic: { read: false, write: false },
            orderhistory: { read: false, write: false },
        };
        try {
            const profiles = yield (0, extendedProfileHelpers_1.fetchExtendedProfiles)(webid, session.fetch);
            const storageUrl = yield getLocationFromProfile(profiles, storageRdf);
            if (!storageUrl) {
                console.error("Unable to determine storage URL.");
                return result;
            }
            const demographicUrl = `${storageUrl}retaildata/demographic.ttl`;
            result.demographic = yield checkResourceAccess(demographicUrl, session);
            const typeIndexDatasetUrl = yield getLocationFromProfile(profiles, publicTypeIndexRdf);
            if (!typeIndexDatasetUrl)
                return result;
            const typeIndex = yield (0, solid_client_1.getSolidDataset)(typeIndexDatasetUrl, {
                fetch: session.fetch,
            });
            if (!typeIndex) {
                console.error("Unable to retrieve type index dataset.");
                return result;
            }
            const schemas = [
                { schema: "https://schema.org/Order" },
                { schema: "https://schema.org/OrderItem" },
                { schema: "https://schema.org/Product" },
                { schema: "https://schema.org/Offer" },
            ];
            yield Promise.all(schemas.map((_a) => __awaiter(this, [_a], void 0, function* ({ schema }) {
                const url = resolveResourceFromTypeIndex(typeIndex, schema);
                if (url) {
                    result.orderhistory =
                        result.orderhistory && (yield checkResourceAccess(url, session));
                }
            })));
        }
        catch (error) {
            console.error("Error checking access:", error);
        }
        return result;
    });
}
function getLocationFromProfile(profiles, schema) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const profile of profiles) {
            const things = (0, solid_client_1.getThingAll)(profile);
            for (const thing of things) {
                const url = (0, solid_client_1.getUrl)(thing, schema);
                if (url)
                    return url;
            }
        }
        return null;
    });
}
function resolveResourceFromTypeIndex(typeIndexDataset, schema) {
    const things = (0, solid_client_1.getThingAll)(typeIndexDataset);
    for (const thing of things) {
        const forClass = (0, solid_client_1.getUrl)(thing, "http://www.w3.org/ns/solid/terms#forClass");
        if (forClass === schema) {
            return (0, solid_client_1.getUrl)(thing, "http://www.w3.org/ns/solid/terms#instance") || null;
        }
    }
    return null;
}
function checkResourceAccess(url, session) {
    return __awaiter(this, void 0, void 0, function* () {
        const access = { read: false, write: false };
        try {
            let dataset = yield (0, solid_client_1.getSolidDataset)(url, { fetch: session.fetch });
            access.read = true;
            dataset = (0, solid_client_1.setThing)(dataset, (0, solid_client_1.buildThing)().build());
            const res = yield (0, solid_client_1.saveSolidDatasetAt)(url, dataset, {
                fetch: session.fetch,
            });
            access.write = true;
        }
        catch (error) {
            if (error.statusCode === 404) {
                console.log(`File ${url} does not exist.`);
            }
            else {
                console.error(`Error accessing ${url}:`, error);
            }
        }
        return access;
    });
}
