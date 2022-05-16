import express from 'express';
import helmet from 'helmet';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import Constants from './constants';
import { AppAPI } from './types/app_api';
import { uncaughtError } from './middleware/uncaught_error';
import { wildcard404 } from './routes/misc/wildcard_404';

import SourceMapSupport from 'source-map-support';
import { initExitSignalHandler } from './exit_signal_handler';
import { attachUser, deleteUser, getUsers, patchUser, postUser } from './routes/kasper_api';

SourceMapSupport.install();

const port = process.env.PORT || 3001;

const api = express() as AppAPI;

/* Core middleware */

api.use(helmet());
api.use(pino({ enabled: Constants.IS_PRODUCTION }));
api.use(cookieParser());
api.use(express.json({ limit: '50mb' }));

/* Project Vendor Connector */
api.get(
  '/kasper/users',
  getUsers,
);
api.post(
  '/kasper/users',
  postUser,
);
api.patch(
  '/kasper/users/:userId',
  attachUser,
  patchUser
);
api.delete(
  '/kasper/users/:userId',
  attachUser,
  deleteUser
);

/* Wildcard route */

api.get('*', wildcard404);

/* Top level error handler */

api.use(uncaughtError);

api.server = api.listen(port, () => {
  console.log('Started');
});

initExitSignalHandler(api);

export { api };