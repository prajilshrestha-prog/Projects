import express from 'express';
import { isAdminRoute, protectRoute } from '../middlewares/authMiddleware.js';
import {  createTask, dashboardStatistics, deleteRestoreTask, duplicateTask, getTask, getTasks, postTaskActivity, softDeleteTask, trashTask, updateTask } from '../controllers/taskController.js';
import { getLast10Tasks } from "../controllers/getLast10TasksController.js";

const router = express.Router();

router.post("/create", protectRoute, isAdminRoute, createTask);
router.get("/last-10", protectRoute, getLast10Tasks);
router.patch('/tasks/:id/soft-delete', softDeleteTask);

router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);
router.post("/activity/:id", protectRoute, postTaskActivity);


router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);

router.put("/update/:id", protectRoute, isAdminRoute, updateTask);
router.put("/:id", protectRoute, isAdminRoute, trashTask);

router.patch(
  "/delete/:id",
  deleteRestoreTask
);




export default router;

