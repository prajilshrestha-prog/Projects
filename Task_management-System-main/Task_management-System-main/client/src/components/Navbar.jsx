import React from 'react';
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { UserAvatar } from './UserAvatar';
import { setOpenSidebar } from "../redux/slices/authSlice";

export const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className='flex justify-end items-center bg-white dark:bg-[#1f1f1f] px-4 py-3 2xl:py-4 sticky z-10 top-0 shadow-sm border-b border-gray-200 dark:border-gray-800'>
  <div className='flex gap-2 items-center'>
        <UserAvatar />
  </div>
</div>

  );
};
