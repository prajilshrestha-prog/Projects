import Task from "../models/task.js";
import mongoose from "mongoose";
const priorityOrder = {
  high: 1,
  medium: 2,
  normal: 3,
  low: 4,
};

export const getLast10Tasks = async (req, res) => {
  try {
    const { isAdmin, userId } = req.user;
    const query = { isTrashed: false };

    if (!isAdmin) {
      query.team = { $all: [new mongoose.Types.ObjectId(userId)] };
    }

    let tasks = await Task.find(query)
      .populate({ path: "team", select: "name title email" })
      .sort({ createdAt: -1 })
      .lean();

    tasks.sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 5;
      const priorityB = priorityOrder[b.priority] || 5;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    const last10Task = tasks.slice(0, 10);

    res.status(200).json({
      status: true,
      last10Task,
    });
  } catch (error) {
    console.error("Error fetching last 10 tasks:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch last 10 tasks",
    });
  }
};