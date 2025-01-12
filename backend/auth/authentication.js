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
exports.authenticateAsUser = exports.testSolid = void 0;
const solid_client_authn_node_1 = require("@inrupt/solid-client-authn-node");
const solid_client_1 = require("@inrupt/solid-client");
require("dotenv/config");
const testSolid = (_a) => __awaiter(void 0, [_a], void 0, function* ({ request, response, }) {
    try {
        const res = yield (0, exports.authenticateAsUser)();
        response.status(200).send(res);
    }
    catch (error) {
        console.warn(error);
        response.status(500).send(error);
    }
});
exports.testSolid = testSolid;
// const loginWithUsernameAndPassword = async () => {
//   const client = new SolidNodeClient({
//     appUrl: "http://localhost:3000",
//   });
//   const res = await client.login({
//     idp: "https://solidcommunity.net", // e.g. https://solidcommunity.net
//     username: "michielvh",
//     password: "&businessMwoan89%",
//   });
//   console.log(res);
//   return client;
// };
const authenticateAsUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const session = new solid_client_authn_node_1.Session();
    yield session.login({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        clientName: "WebshopAPI",
        oidcIssuer: "https://login.inrupt.com",
    });
    return session;
});
exports.authenticateAsUser = authenticateAsUser;
const testReadResource = (session) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(session.info.webId);
    const myDataset = yield (0, solid_client_1.getSolidDataset)("https://michielvh2.solidcommunity.net/order-history/order-history.ttl", {
        fetch: session.fetch,
    });
    return myDataset;
});
