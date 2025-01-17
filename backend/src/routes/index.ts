import { Router } from "express";
import admin from "./admin";
import user from "./user";
import token from "./token";
import file from "./file";



const router = Router();

export default () => {
    token(router);
    admin(router);
    user(router);
    file(router);
    return router;
}