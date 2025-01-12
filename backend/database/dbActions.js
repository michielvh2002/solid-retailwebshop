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
exports.getAllUsers = exports.getUserByWebId = exports.upsertUser = void 0;
const initDb_1 = require("./initDb");
const upsertUser = (webid, permissions) => {
    const db = (0, initDb_1.getDatabaseConnection)();
    const query = `
    INSERT INTO users (webid, read_d, write_d, read_o, write_o, isactive)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(webid) DO UPDATE SET
      read_d = excluded.read_d,
      write_d = excluded.write_d,
      read_o = excluded.read_o,
      write_o = excluded.write_o,
      isactive = excluded.isactive;
  `;
    const params = [
        webid,
        permissions.demographic.read,
        permissions.demographic.write,
        permissions.orderhistory.read,
        permissions.orderhistory.write,
        true,
    ];
    db.run(query, params, function (err) {
        if (err) {
            console.error("Error upserting user:", err.message);
            return false;
        }
        else {
            console.log("User upserted successfully:", webid);
            return true;
        }
    });
    return true;
};
exports.upsertUser = upsertUser;
const getUserByWebId = (webid) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, initDb_1.getDatabaseConnection)();
    const query = `
    SELECT * 
    FROM users 
    WHERE webid = ?;
  `;
    return new Promise((resolve, reject) => {
        db.get(query, [webid], (err, row) => {
            if (err) {
                console.error("Error retrieving user by webid:", err.message);
                reject(err); // Reject the promise with the error
            }
            else {
                resolve(row); // Resolve the promise with the retrieved row
            }
        });
    });
});
exports.getUserByWebId = getUserByWebId;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, initDb_1.getDatabaseConnection)();
    const query = `
    SELECT * 
    FROM users;
  `;
    return new Promise((resolve, reject) => {
        db.all(query, (err, row) => {
            if (err) {
                console.error("Error retrieving user by webid:", err.message);
                reject(err); // Reject the promise with the error
            }
            else {
                resolve(row); // Resolve the promise with the retrieved row
            }
        });
    });
});
exports.getAllUsers = getAllUsers;
