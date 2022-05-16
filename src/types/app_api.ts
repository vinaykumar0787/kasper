import express from 'express';
import { Server } from 'http';

export interface AppAPI extends express.Express {
  server?: Server;
}
