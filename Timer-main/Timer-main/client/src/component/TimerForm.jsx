import { useState } from "react";

function TimerForm(props) {
  const [title, setTitle] = useState(props.title || "");
  const [project, setProject] = useState(props.project || "");
  const submitText = props.id ? "Update" : "Create";

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleProjectChange = (e) => setProject(e.target.value);

  const handleSubmit = () => {
    props.onFormSubmit({
      id: props.id,
      title,
      project,
    });
  };

  return (
    <div className="timer-form">
      <div className="field">
        <label>Title</label>
        <input type="text" value={title} onChange={handleTitleChange} />
      </div>

      <div className="field">
        <label>Project</label>
        <input type="text" value={project} onChange={handleProjectChange} />
      </div>

      <div className="buttons">
        <button className="save" onClick={handleSubmit}>
          {submitText}
        </button>
        <button className="cancel" onClick={props.onFormClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default TimerForm;
