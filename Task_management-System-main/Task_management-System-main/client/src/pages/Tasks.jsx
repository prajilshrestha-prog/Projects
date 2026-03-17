import { useState } from 'react';
import { FaList } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';
import { MdGridView } from "react-icons/md";
import { useParams } from 'react-router-dom';
import { BoardView } from '../components/BoardView.jsx';
import Button from '../components/Button.jsx';
import { Tabs } from '../components/Tabs.jsx';
import AddTask from '../components/task/AddTask.jsx';
import Table from '../components/task/Table.jsx';
import TaskTitle from '../components/TaskTitle.jsx';
import { Title } from '../components/Title.jsx';
import { useGetAllTaskQuery } from '../redux/slices/api/taskApiSilice.js';
const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  {title:"List View",icon:<FaList />}

]
const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams()
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  const status = params?.status || "";
  const { data, isLoading } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: ""
  });
  if (isLoading) {
    return <h1>Loading...</h1>
  }
  return (
      <div className='w-full'>
        <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />      

        {
          !status && (
          <Button onClick={()=>setOpen(true)}
            label="Create Task" icon={<IoMdAdd className='text-lg'/>}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
            />
          )}
        </div>
      
    <Tabs
  tabs={TABS}
  setSelected={setSelected}
  panels={[
    <>
      {!status && (
        <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
          <TaskTitle label="To Do" className={TASK_TYPE.todo} />
          <TaskTitle label="In Progress" className={TASK_TYPE["in progress"]} />
          <TaskTitle label="completed" className={TASK_TYPE.completed} />
        </div>
      )}
      <BoardView tasks={data?.tasks} />
    </>,
    <Table tasks={data?.tasks} />
  ]}
></Tabs>
      <AddTask open={open} setOpen={setOpen} />
      </div>
    )
    }

export default Tasks; 
