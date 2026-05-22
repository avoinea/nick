/**
 * I18n middleware.
 * @module middleware/i18n/i18n
 */

// Type imports
import type { Request } from '../../types';

// External imports
import { createIntl, createIntlCache, IntlShape } from '@formatjs/intl';
import { remove, zipObject } from 'es-toolkit/array';
import type { Response, NextFunction } from 'express';
import fs from 'fs';

// Internal imports
import config from '../../helpers/config/config';
import models from '../../models';

const localesDir = config.settings.localesDir;

// Get available language files
const languages = fs.existsSync(localesDir)
  ? remove(fs.readdirSync(localesDir), (value) => value.endsWith('.json')).map(
      (value) => value.replace(/.json/, ''),
    )
  : [];

// Create i18n cache
const intlCache = zipObject(
  languages,
  languages.map(() => createIntlCache()),
) as Record<string, any>;

// Load i18n files
const intl = zipObject(
  languages,
  languages.map((language) =>
    createIntl(
      {
        locale: language,
        messages: fs.existsSync(`${localesDir}/${language}.json`)
          ? JSON.parse(
              fs.readFileSync(`${localesDir}/${language}.json`, 'utf8'),
            )
          : {},
      },
      intlCache[language],
    ),
  ),
) as Record<string, IntlShape>;

// Export middleware
export async function i18n(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const Controlpanel = models.get('Controlpanel');

  // Fetch settings
  const controlpanel = await Controlpanel.fetchById('language');
  const settings = controlpanel.data;

  req.i18n = (id: string, ...rest: any[]) => {
    // Check if id is specified
    if (!id) {
      return '';
    }

    // Negotiate language
    let language =
      req.acceptsLanguages(...settings.available_languages) ||
      settings.default_language;

    // Check if language is available
    if (!languages.includes(language)) {
      language = settings.default_language;
    }

    // Translate message
    return intl[language].formatMessage({ id, defaultMessage: id }, ...rest);
  };
  next();
}
