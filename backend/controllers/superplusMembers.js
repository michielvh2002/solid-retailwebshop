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
exports.getDemographicDataFromPod = exports.getOrderFromPod = exports.handleOrder = exports.getSuperplusMembers = exports.signUp = void 0;
const authentication_1 = require("../auth/authentication");
const verifyToken_1 = __importDefault(require("../auth/verifyToken"));
const permissions_1 = require("./permissions");
const dbActions_1 = require("../database/dbActions");
const orderHistory_1 = require("../solid/orderHistory");
const demographicData_1 = require("../solid/demographicData");
const signUp = (_a) => __awaiter(void 0, [_a], void 0, function* ({ request, response, }) {
    const webid = yield (0, verifyToken_1.default)(request);
    const session = yield (0, authentication_1.authenticateAsUser)();
    const result = yield (0, permissions_1.checkAccess)(webid, session);
    if (!result.demographic.read || !result.orderhistory.read) {
        response.status(400).json({
            error: "Delhaize should have at least read permissions on order history and demographic data",
        });
    }
    const succeeded = (0, dbActions_1.upsertUser)(webid, result);
    if (succeeded) {
        response.status(200).send("success");
    }
    else {
        response.status(500).send("failed");
    }
});
exports.signUp = signUp;
const getSuperplusMembers = (_a) => __awaiter(void 0, [_a], void 0, function* ({ request, response, }) {
    const res = yield (0, dbActions_1.getAllUsers)();
    return response.status(200).json(res);
});
exports.getSuperplusMembers = getSuperplusMembers;
const handleOrder = (_a) => __awaiter(void 0, [_a], void 0, function* ({ request, response, }) {
    const order = request.body;
    const webid = yield (0, verifyToken_1.default)(request);
    const session = yield (0, authentication_1.authenticateAsUser)();
    const user = yield (0, dbActions_1.getUserByWebId)(webid);
    if (!user)
        return;
    if (user["write_o"]) {
        try {
            //write to pod
            yield (0, orderHistory_1.writeOrderToPod)(order, webid, session);
        }
        catch (error) {
            if (error.statusCode === 403 || error.statusCode === 401) {
                const perms = yield (0, permissions_1.checkAccess)(webid, session);
                (0, dbActions_1.upsertUser)(webid, perms);
            }
        }
    }
    //verder verwerken van de bestelling
});
exports.handleOrder = handleOrder;
const getOrderFromPod = (_a) => __awaiter(void 0, [_a], void 0, function* ({ request, response, }) {
    const webid = request.query.webid;
    if (!webid) {
        response.status(400).send("No webid provided");
        return;
    }
    const session = yield (0, authentication_1.authenticateAsUser)();
    const user = yield (0, dbActions_1.getUserByWebId)(webid);
    const result = yield (0, orderHistory_1.getOrdersFromPod)(webid, session);
    response.status(200).json(result);
    if (user["read_o"]) {
        try {
            const result = yield (0, orderHistory_1.getOrdersFromPod)(webid, session);
            response.status(200).json(result);
            return;
        }
        catch (error) {
            if (error.statusCode === 403 || error.statusCode === 401) {
                const perms = yield (0, permissions_1.checkAccess)(webid, session);
                (0, dbActions_1.upsertUser)(webid, perms);
                response
                    .status(200)
                    .send("We don't have permissions to execute this action");
            }
        }
    }
});
exports.getOrderFromPod = getOrderFromPod;
const getDemographicDataFromPod = (_a) => __awaiter(void 0, [_a], void 0, function* ({ request, response, }) {
    const webid = request.query.webid;
    if (!webid) {
        response.status(400).send("No webid provided");
        return;
    }
    const session = yield (0, authentication_1.authenticateAsUser)();
    const user = yield (0, dbActions_1.getUserByWebId)(webid);
    if (user.read_d) {
        try {
            const result = yield (0, demographicData_1.getDemographicdata)(webid, session);
            response.status(200).json(result);
            return;
        }
        catch (error) {
            if (error.statusCode === 403 || error.statusCode === 401) {
                const perms = yield (0, permissions_1.checkAccess)(webid, session);
                (0, dbActions_1.upsertUser)(webid, perms);
                response
                    .status(200)
                    .send("We don't have permissions to execute this action");
            }
        }
    }
});
exports.getDemographicDataFromPod = getDemographicDataFromPod;
