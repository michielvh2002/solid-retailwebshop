import { getDatabaseConnection } from "./initDb";
import { Permissions } from "../types/permissions";

export const upsertUser = (
  webid: string,
  permissions: Permissions
): boolean => {
  const db = getDatabaseConnection();

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

  db.run(query, params, function (err: any) {
    if (err) {
      console.error("Error upserting user:", err.message);
      return false;
    } else {
      console.log("User upserted successfully:", webid);
      return true;
    }
  });
  return true;
};

export const getUserByWebId = async (webid: string): Promise<any> => {
  const db = getDatabaseConnection();

  const query = `
    SELECT * 
    FROM users 
    WHERE webid = ?;
  `;

  return new Promise((resolve, reject) => {
    db.get(query, [webid], (err: any, row: Object | null) => {
      if (err) {
        console.error("Error retrieving user by webid:", err.message);
        reject(err); // Reject the promise with the error
      } else {
        resolve(row); // Resolve the promise with the retrieved row
      }
    });
  });
};

export const getAllUsers = async (): Promise<any> => {
  const db = getDatabaseConnection();

  const query = `
    SELECT * 
    FROM users;
  `;

  return new Promise((resolve, reject) => {
    db.all(query, (err: any, row: Object | null) => {
      if (err) {
        console.error("Error retrieving user by webid:", err.message);
        reject(err); // Reject the promise with the error
      } else {
        resolve(row); // Resolve the promise with the retrieved row
      }
    });
  });
};
