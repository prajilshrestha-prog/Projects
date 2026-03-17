import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useCreateTaskMutation, useUpdateTaskMutation } from '../../redux/slices/api/taskApiSilice';
import Button from '../Button';
import ModalWrapper from '../ModalWrapper';
import SelectList from '../SelectList';
import Textbox from "../Textbox";
import { UserList } from './UserList';
import { toast } from 'sonner';

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
    title: "",
    date: "",
  },

  });
  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(task?.priority?.toUpperCase() || PRIORITY[2]);
useEffect(() => {
  if (task) {
    reset({
      title: task.title || "",
      date: task.date || "",
    });
    setStage(task.stage?.toUpperCase() || LISTS[0]);
    setPriority(task.priority?.toUpperCase() || PRIORITY[2]);
    setTeam(task.team || []);
  }
}, [task, reset]);
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const submitHandler = async (data) => {
    try {
      const newData = {
        ...data,
        team,
        stage,
        priority
      };
      const res = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap()
        : await createTask(newData).unwrap();

      toast.success(res.message);

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title
          as='h2'
          className='text-base font-bold leading-6 text-gray-900 mb-4'
        >
          {task ? "UPDATE TASK" : "ADD TASK"}
        </Dialog.Title>

        <div className='mt-2 flex flex-col gap-6'>
          <Textbox
            placeholder='Task title'
            type='text'
            name='title'
            label='Task Title'
            className='w-full rounded'
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />

          <UserList
            setTeam={setTeam}
            team={team}
          />

          <div className='flex gap-4'>
            <SelectList
              label='Task Stage'
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />
            <div className='w-full'>
              <Textbox
                placeholder='Date'
                type='date'
                name='date'
                label='Task Date'
                className='w-full rounded'
                register={register("date", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date.message : ""}
              />
            </div>
          </div>

          <SelectList
            label="Priority Level"
            lists={PRIORITY}
            selected={priority}
            setSelected={setPriority}
          />

          <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>
            <Button
              label='Submit'
              type='submit'
              className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto'
            />
            <Button
              type='button'
              className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
              onClick={() => setOpen(false)}
              label='Cancel'
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
