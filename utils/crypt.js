import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

/**
 *
 * @param {String} password
 * @returns { {salt:String,password:String} }
 * @description generate a hash and a password
 * 
 */

export function GetHashAndSalt(password) {
  const salt = randomBytes(32).toString("base64");
  const hash = scryptSync(password, salt, 128, {
    N: 16384,
    p: 8,
    r: 2,
  }).toString("base64");
  return { salt: salt, password: hash };
}

/**
 *
 * @param {String} password 
 * @param {String} hash
 * @param {String} salt
 * @returns {Boolean}
 * @description compare the given password with the hash
 * 
 */
export function CompareHashAndPass(password, hash, salt) {
  const HashedPassBuffer = scryptSync(password, salt, 128, {
    N: 16384,
    p: 8,
    r: 2,
  });
  const StoredBuffer = Buffer.from(hash, "base64");
  return timingSafeEqual(HashedPassBuffer, StoredBuffer);
}
