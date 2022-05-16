import onDeathSignal from 'death';
import { AppAPI } from './types/app_api';
import * as database from './mysql_database/db_core';

function closeApi(api: AppAPI): Promise<void> {
  return new Promise((fulfill, reject) => {
    if (!api.server) {
      return fulfill();
    }

    api.server.close((err) => {
      if (err) {
        return reject(err);
      }

      return fulfill();
    });
  });
}

export function initExitSignalHandler(api: AppAPI) {
  onDeathSignal(() => {
    Promise.all([database.close(), closeApi(api)])
      .catch((err) => {
        console.warn(err);
        process.exit(1);
      })
      .then(() => {
        process.exit(0);
      });
  });
}
