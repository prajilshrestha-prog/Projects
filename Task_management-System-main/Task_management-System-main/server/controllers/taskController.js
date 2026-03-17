import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";
import asyncHandler from "express-async-handler";

export const createTask = async (req, res) => {
  try {
    const { userId } = req.user;
        const { title, team, stage, date, priority, assets } = req.body;

          let text = "New Task has been assigned to you"
    if (team?.length > 1) {
        text=text+ ` and ${team.length-1} others`
        }
        
        text =
      text +
            ` The task priority is set a ${priority} priority, so check and act accordingly. The task date is ${new Date(date).toDateString()}. Thank you!!!`;
    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };
    const task = await Task.create({
            title,
            team,
            stage:stage.toLowerCase(),
            date,
            priority:priority.toLowerCase(),
      assets,
            activities:activity,
        });
        await Notice.create({
            team,
            text,
            task: task._id,
        });
        res.status(200).json({ status: true,task, message: "Task created successfully." });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
  
};


export const postTaskActivity = async (req, res) => {
    try {
 const { id } = req.params;
  const { userId } = req.user;
  const { type, activity } = req.body;
    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };
    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
    try {
      const { userId, isAdmin } = req.user;
      console.log(isAdmin)
        const allTasks = isAdmin ? await Task.find({
            isTrashed: false,
        }).populate({
            path: "team",
            select: "name role title email",
          }).sort({ _id: -1 })
 : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
                .sort({ _id: -1 });
        
        const users = await User.find({ isActive: true })
      .select("name title role isActive createdAt")
      .limit(10)
      .sort({ _id: -1 });

        //group task by stage and calculate counts
        const groupedTasks = allTasks?.reduce((result, task) => {
            const stage = task.stage;

            if (!result[stage]) {
                result[stage] = 1;
            } else {
                result[stage] += 1;
            }
            return result;
        }, {});
        const graphData = Object.entries(
            allTasks?.reduce((result, task) => {
                const { priority } = task;
                result[priority] = (result[priority] || 0) + 1;
                return result;
            }, {}))
            .map(([name, total]) => ({ name, total }));
             const totalTasks = allTasks.length;
        const last10Task = allTasks?.slice(0, 10);

        const summary = {
            totalTasks,
            last10Task,
            users: isAdmin ? users : [],
            task: groupedTasks,
graphData,
        };
        res.status(200).json({
            status: true,
            message: "Successfully",
            ...summary,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
}
};

export const getTasks = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { stage, isTrashed } = req.query;

    const query = {
      isTrashed: isTrashed === "true",
    };

    if (stage) {
      query.stage = stage;
    }

    if (!isAdmin) {
      query.team = { $all: [userId] };
    }

    const tasks = await Task.find(query)
      .populate({ path: "team", select: "name title email" })
      .sort({ _id: -1 });

    res.status(200).json({ status: true, tasks });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};



export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, date, team, stage, priority, assets, links, description } =
    req.body;

  try {
    const task = await Task.findById(id);

    let newLinks = [];

    if (links) {
      newLinks = links.split(",");
    }

    task.title = title;
    task.date = date;
    task.priority = priority.toLowerCase();
    task.assets = assets;
    task.stage = stage.toLowerCase();
    task.team = team;
    task.links = newLinks;
    task.description = description;

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task updated successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});


export const trashTask = async (req, res) => {

  try {
      const { id } = req.params;

    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(id);

      resp.isTrashed = false;

      resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const softDeleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndUpdate(id, { isTrashed: true });
    res.status(200).json({ message: "Task moved to trash successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to soft delete task.", error });
  }
};



















export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    const newTask = await Task.create({
      ...task,
      title: task.title+" - Duplicate",
    });

    newTask.team = task.team;
    newTask.subTasks = task.subTasks;
    newTask.assets = task.assets;
    newTask.priority = task.priority;
    newTask.stage = task.stage;

    await newTask.save();
    let text = "New task has been assigned to you";
    if (team.team?.length > 1) {
      text = text + ` and ${task.team?.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${
        task.priority
      } priority, so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!!!`;
      
    await Notice.create({
      team: newTask.team,
      text,
      task: newTask._id,
    });

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate({
        path: "team",
        select: "name title role email",
      }).populate({
        path: "activities.by",
        select: "name",
      }).sort({ _id: -1 });

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const createSubTask = async (req, res) => {
    try {
  const { title, tag, date } = req.body;
  const { id } = req.params;


    const newSubTask = {
      title,
      date,
      tag,
    };

    const task = await Task.findById(id);

    task.subTasks.push(newSubTask);

    await task.save();

    res.status(200).json({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};
