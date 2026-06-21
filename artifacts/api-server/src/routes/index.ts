import { Router, type IRouter } from "express";
import healthRouter from "./health";
import eventsRouter from "./events";
import configRouter from "./config";

const router: IRouter = Router();

router.use(healthRouter);
router.use(eventsRouter);
router.use(configRouter);

export default router;
