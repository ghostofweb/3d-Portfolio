import { Router } from "express";
import { patDog, getPatCount } from "../service/Mascot.service.js";

export const MascotRouter = Router();

MascotRouter.post("/pat", patDog);
MascotRouter.get("/pats", getPatCount);
