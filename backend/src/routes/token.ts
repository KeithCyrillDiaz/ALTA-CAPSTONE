import { Router } from "express";
import { getAccessToken } from "../controllers/token/accessTokenController";


export default (router: Router) => {
    router.get("/getAccessToken", getAccessToken);
}