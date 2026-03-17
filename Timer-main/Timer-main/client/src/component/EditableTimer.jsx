import { useState } from "react";
import Timer from "./Timer";
import TimerForm from "./TimerForm";


function EditableTimer(props) {
  const [editFormOpen, setEditFormOpen] = useState(false);
  const handleEditClick = () => {
    setEditFormOpen(true);
}
const handleFormClose = () => {
    setEditFormOpen(false);
}
const handleSubmit = (timer) => {
props.onFormSubmit(timer);
    setEditFormOpen(false);
};

  if (editFormOpen) {
    return (
      <TimerForm
          id={props.id}     
        title={props.title}
        project={props.project}
onFormSubmit={handleSubmit}
onFormClose={handleFormClose}
      />
    );
  } else {
    return (
      <Timer
        id={props.id}
        title={props.title}
        project={props.project}
        elapsed={props.elapsed}
        runningSince={props.runningSince}
        onEditClick={handleEditClick}
        onTrashClick={props.onTrashClick}
        onStartClick={props.onStartClick}
        onStopClick={props.onStopClick}
      />
    );
  }
}

export default EditableTimer;
