import {Session, Task} from '../data/activity.js'
import React from 'react';

export class SessionForm extends React.Component {
  constructor(props){
    super(props);

    this.state = ({
      numTasks : 1,
      minTasks: 1,
      maxTasks: 10,
    })
  }

  tasks = () => {
    let allTasks = [];
    let numTasks = this.state.numTasks;
    for(let i = 0; i < numTasks; i++){
      allTasks.push(this.addTaskInputs(i));
    }
    return allTasks;
  }

  addTask = () => {
      if(this.state.numTasks < this.state.maxTasks)
      {
        let numTasks = this.state.numTasks;
        this.setState({numTasks: numTasks + 1});
      }
  }

  removeTask = () => {
      if(this.state.minTasks < this.state.numTasks)
      {
        let numTasks = this.state.numTasks;
        this.setState({numTasks: numTasks - 1});
      }
  }

  addTaskInputs(i){
    return (
      <div key={i} className="taskForm" id={`tasksForm_${i}`}>
        <label>Task {i+1}</label>
        <input
            className="form-control taskInput"
            type="text"
            placeholder="Name"
            name="taskName"
        />
        <input
            className="form-control taskInput"
            type="text"
            placeholder="Category"
            name="taskCategory"
        />
        <input
            className="form-control taskInput"
            type="text"
            placeholder="Description"
            name="taskDescription"
        />
      </div>
    );
  }

  objectifySession(formData) {
    let sessionData = formData.target;

    var session = new Session(
      sessionData.sessionName.value,
      sessionData.sessionCategory.value,
      sessionData.sessionDescription.value
    );

    var tasks = [];
    let numTasks = this.state.numTasks;
    if(numTasks > 1)
    {
      for (let i = 0; i < numTasks; i++)
      {
        let task = new Task(sessionData.taskName[i].value, sessionData.taskCategory[i].value, sessionData.taskDescription[i].value);
        tasks.push(task);
      }
    } else {
        let task = new Task(sessionData.taskName.value, sessionData.taskCategory.value, sessionData.taskDescription.value);
        tasks.push(task);
    }
    session.setTasks(tasks);
    return session;
  }

  onSubmit = event => {
    event.preventDefault();
    var session = this.objectifySession(event);
    this.props.onSubmit({session: session});
  }

	render() {
		return (
			<React.Fragment>
        <form onSubmit={this.onSubmit}>
          <div className="sessionFormInner row form-group">
            <div className="col">
              <label>Session</label>
              <input
                  className="form-control sessionInput"
                  type="text"
                  placeholder="Name"
                  name="sessionName"
              />
              <input
                  className="form-control sessionInput"
                  type="text"
                  placeholder="Category"
                  name="sessionCategory"
              />
              <input
                  className="form-control sessionInput"
                  type="text"
                  placeholder="Description"
                  name="sessionDescription"
              />
            </div>
          </div>

          <div className="taskFormInner row form-group">
              <div className="col">
                {this.tasks()}
              </div>
          </div>

          <div className="row">
            <div className="btn taskButton" onClick={this.addTask}>+Task</div>
            <div className="btn taskButton" onClick={this.removeTask}>-Task</div>
          </div>

          <div className="row">
            <button type="submit" className="btn saveButton">Save</button>
          </div>
        </form>

      </React.Fragment>
        );
		}
	}