import React from 'react';
import { Tab } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export const Tabs = ({ tabs=[], setSelected, panels=[] }) => {
  return (
    <div className='w-full px-1 sm:px-0'>
      <Tab.Group onChange={setSelected}>
        <Tab.List className="flex space-x-6 rounded-xl p-1">
          {tabs.map((tab, index) => (
            <Tab key={tab.title}
              className={({ selected }) =>
                classNames(
                  "w-fit flex items-center outline-none gap- px-3 py-2.5 text-base font-medium leading-5 bg-white",
                  selected
                    ? "text-blue-700 border-b-2 border-blue-600"
                    : "text-gray-800 hover:text-blue-800"
                )
              }
            >
              {tab.icon}
              <span>{tab.title}</span>
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {panels.map((panel, i) => (
            <Tab.Panel key={i} className="w-full mt-2">
              {panel}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
