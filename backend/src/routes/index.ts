import { Router } from "express";
import admin from "./admin";
import user from "./user";
import token from "./token";


const router = Router();

export default () => {
    token(router);
    admin(router);
    user(router);
    return router;
}