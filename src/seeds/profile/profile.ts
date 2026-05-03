import type { Knex } from 'knex';
import { fileExists } from '../../helpers/fs/fs';
import { stripI18n } from '../../helpers/i18n/i18n';
import { omit } from 'es-toolkit/object';

import models from '../../models';

export const seedProfile = async (
  trx: Knex.Transaction,
  profilePath: string,
): Promise<void> => {
  const Profile = models.get('Profile');
  if (await fileExists(`${profilePath}/metadata`)) {
    const profile = stripI18n(
      (await import(`${profilePath}/metadata`)).default,
    );
    await Profile.deleteById(profile.id, trx);
    await Profile.create(omit(profile, ['upgrade']), {}, trx);
    console.log('Profile imported');
  }
};
