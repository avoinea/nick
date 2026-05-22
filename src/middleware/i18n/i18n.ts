/**
 * I18n middleware.
 * @module middleware/i18n/i18n
 */

// Type imports
import type { Request } from '../../types';

// External imports
import type { Response, NextFunction } from 'express';

// Internal imports
import { intl, languages } from '../../helpers/i18n/i18n';
import models from '../../models';

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
