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
        <input
            type="text"
            placeholder="Task Name"
            name="taskName"
        />
        <br/>

        <input
            type="text"
            placeholder="Task Category"
            name="taskCategory"
        />
        <br/>

        <input
            type="text"
            placeholder="Task Description"
            name="taskDescription"
        />
        <br/>
        <br/>
      </div>
    );
  }

  objectifySession(formData) {
    // TODO: may want to convert directly to mongoose model here
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
        <button className="btn formButton" onClick={this.addTask}>+Task</button>
        <button className="btn formButton" onClick={this.removeTask}>-Task</button>
        <form onSubmit={this.onSubmit}>
        <input
            type="text"
            placeholder="Session Name"
            name="sessionName"
        />
        <br/>

        <input
            type="text"
            placeholder="Session Category"
            name="sessionCategory"
        />
        <br/>

        <input
            type="text"
            placeholder="Session Description"
            name="sessionDescription"
        />
        <br/>
        <br/>

        {this.tasks()}
        <button type="submit" className="btn formButton">Save</button>
        </form>
      </React.Fragment>
        );
		}
	}