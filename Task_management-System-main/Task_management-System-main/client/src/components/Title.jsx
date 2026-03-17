import clsx from "clsx";
import React from 'react';
export const Title = ({title, className}) => {
  return (
      <h2 className={clsx("text-2xl font-semibold ", className)}>
          {title}
    </h2>
  )
}
