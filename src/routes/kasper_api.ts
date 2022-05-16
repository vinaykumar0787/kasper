import assert from 'assert';
import express from 'express';
import { catchRouteErrors } from './route_error_decorator';
import ErrorCodes from '../error_codes';
import { UserDatabase } from '../mysql_database/user_database';
import { UserOrchestrator } from '../orchestrators/user_orchestrator';
import { AppRequest } from '../types/app_request';
import { KasperUser } from '../types/user/user';
import { KasperUserUpdate } from '../types/user/user_update';

const database = new UserDatabase();
const orchestrator = new UserOrchestrator(database);

class UserRoutes {
  /// <summary>
  ///   Method to Attach User to Request for further processing in request pipeline chain
  /// </summary>
  @catchRouteErrors
  static async attachUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const appReq = req as AppRequest;
    const userId = Number.parseInt(req.params.userId);
    assert(!Number.isNaN(userId));
    const otherUser = await orchestrator.getUserById(userId);

    if (otherUser) {
      appReq.user = otherUser;
      return next();
    } else {
      return res.status(404).json({
        message: 'User not found.',
        code: ErrorCodes.NOT_FOUND,
      });
    }
  }

  /// <summary>
  ///   Method to Get all Users in ordered format by rank
  /// </summary>
  @catchRouteErrors
  static async getUsers(_req: express.Request, res: express.Response) {

    const users = await orchestrator.getAllUsers();

    return res.status(200).json(users);
  }

  /// <summary>
  ///   Method to Delete a specific user
  /// </summary>
  @catchRouteErrors
  static async deleteUser(req: express.Request, res: express.Response) {
    const appReq = req as AppRequest;
    const user = appReq.user;

    assert(user, 'User is not attached to the request');

    await orchestrator.deleteUser(user.id);
    res.status(204).json({});
  }

  /// <summary>
  ///   Method to Patch User's name and rank
  /// </summary>
  @catchRouteErrors
  static async patchUser(req: express.Request, res: express.Response) {
    const appReq = req as AppRequest;
    const user = appReq.user;

    assert(user, 'User is not attached to the request');

    const userUpdate = new KasperUserUpdate(
      req.body,
      user
    );
    const updatedUser = await orchestrator.updateUser(userUpdate);

    return res.status(200).json(updatedUser);
  }

  /// <summary>
  ///   Method to create a new User
  /// </summary>
  @catchRouteErrors
  static async postUser(req: express.Request, res: express.Response) {

    const userCreate = new KasperUser(req.body);
    const newUser = await orchestrator.createUser(userCreate);

    return res.status(201).json(newUser);
  }
}

export const postUser = UserRoutes.postUser;
export const patchUser = UserRoutes.patchUser;
export const attachUser = UserRoutes.attachUser;
export const getUsers = UserRoutes.getUsers;
export const deleteUser = UserRoutes.deleteUser;
