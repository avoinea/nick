/**
 * Auth helper.
 * @module helpers/auth/auth
 */

// Type imports
import type { Request, User } from '../../types';

// External imports
import { isUndefined } from 'es-toolkit/predicate';
import jwt from 'jsonwebtoken';
import { Knex } from 'knex';

// Internal imports
import config from '../config/config';

/**
 * Check required permission.
 * @method hasPermission
 * @param {string[]} permissions Permissions of the current user.
 * @param {string} permission Permission to check.
 * @returns {boolean} True if you have permission.
 */
export function hasPermission(
  permissions: string[],
  permission: string,
): boolean {
  return isUndefined(permission) || permissions.includes(permission);
}

/**
 * Get user based on token.
 * @method getUserId
 * @param {Object} req Request object.
 * @returns {string} User id.
 */
export function getUserId(req: Request): string | undefined {
  // Check if auth token
  if (!req.token) {
    return 'anonymous';
  } else {
    let decoded;
    try {
      decoded = jwt.verify(req.token, config.settings.secret, {
        algorithms: ['HS256'],
      });
    } catch (_err) {
      return 'anonymous';
    }

    // Return user id
    return typeof decoded.sub === 'string' ? decoded.sub : undefined;
  }
}

/**
 * Add jwt token to user
 * @method addToken
 * @param {User} user User object.
 * @param {string} token Token to be added.
 * @param {Knex.Transaction} trx Knex Transaction
 */
export async function addToken(
  user: User,
  token: string,
  trx: Knex.Transaction,
): Promise<void> {
  // Get tokens
  let tokens = user.tokens || [];

  // Remove expired tokens
  tokens = tokens.filter((token) => {
    try {
      jwt.verify(token, config.settings.secret);
      return true;
    } catch (_err) {
      return false;
    }
  });

  // Add new token
  tokens.push(token);

  // Store tokens
  await user.update({ tokens }, trx);
}

/**
 * Remove jwt token from user
 * @method removeToken
 * @param {User} user User object.
 * @param {string} token Token to be removed.
 * @param {Knex.Transaction} trx Knex Transaction
 */
export async function removeToken(
  user: User,
  token: string,
  trx: Knex.Transaction,
): Promise<undefined> {
  // Get tokens
  let tokens = user.tokens || [];

  // Remove expired tokens
  tokens = tokens.filter(
    (tokenFromArray: string | undefined) => tokenFromArray !== token,
  );

  // Store tokens
  await user.update({ tokens }, trx);
}
