import express from 'express';
import { KasperUser } from './user/user';

export interface AppRequest extends express.Request {
    user: KasperUser;
}
