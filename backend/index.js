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
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const authentication_1 = require("./auth/authentication");
const permissions_1 = require("./controllers/permissions");
const superplusMembers_1 = require("./controllers/superplusMembers");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
app.use(cors());
app
    .get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, authentication_1.testSolid)({ request: req, response: res });
}))
    .get("/orderhistory", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, superplusMembers_1.getOrderFromPod)({ request: req, response: res });
}))
    .get("/demographicdata", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, superplusMembers_1.getDemographicDataFromPod)({ request: req, response: res });
}))
    .get("/superplusmembers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, superplusMembers_1.getSuperplusMembers)({ request: req, response: res });
}))
    .get("/checkPermissions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, permissions_1.checkPermissions)({ request: req, response: res });
}))
    .post("/signUp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, superplusMembers_1.signUp)({ request: req, response: res });
}))
    .post("/checkout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, superplusMembers_1.handleOrder)({ request: req, response: res });
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
