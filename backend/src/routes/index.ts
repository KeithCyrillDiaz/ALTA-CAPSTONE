import { Router } from "express";
import admin from "./admin";
import user from "./user";

const router = Router();

export default () => {
    admin(router);
    user(router);
    return router;
}