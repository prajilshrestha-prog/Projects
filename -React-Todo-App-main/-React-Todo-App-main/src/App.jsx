import { useState } from "react";
import { Task } from "./component/Task.jsx";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [taskName, setTask] = useState("");

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const addTask = () => {
    const newTask = {
      id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1,
      task: taskName,
      completed: false,
    };
    setTodoList([...todoList, newTask]);
    setTask("");
  };

  const deleteTask = (id) => {
    setTodoList(todoList.filter((task) => task.id !== id));
  };

  const completedTask = (id) => {
    setTodoList(
      todoList.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  };

  return (
    <div className="container">
      <div className="input">
        <input type="text" onChange={handleChange} value={taskName} />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="list">
        {todoList.map((value) => (
          <Task
            key={value.id}
            taskName={value.task}
            id={value.id}
            deleteTask={deleteTask}
            completed={value.completed}
            completedTask={completedTask}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
