import React, { Component } from 'react';
import './App.css';
import {Session, Task} from './data/activity.js'
import {SessionForm} from './components/sessionForm.js'
import {SessionUI} from './components/sessionUI.js'
import {TimerUI} from './components/timerUI.js'
import { Stopwatch } from './data/stopwatch';


class App extends Component {
  constructor(props){
    super(props);
    var testSession = new Session("testSession", "A test session", "A session for testing");
    var task_one = new Task("Task One", "Test", "A test task.");
    var task_two = new Task("Task Two", "Test", "A test task.");
    var task_three = new Task("Task Three", "Test", "A test task.");
    var test_tasks = [];
    test_tasks.push(task_one, task_two, task_three);
    testSession.setTasks(test_tasks);

    this.state = {
      sessionsLoaded: false,
      sessions: [],
      active_timer: [],
    };

    // this.state.sessions.push(testSession); // add a test session by default for testing
  }

  componentDidMount() {
    var sessions = this.fetchSessions();
    this.setState({sessions:sessions});
  }

  checkStatus = (res) => {
    return res.json();
  }
  
  parseResponse = (res) => {
    return res;
  }

  handleSessionFormSubmit = sessionObj => {
    const data = this.state.sessions;
    data.push(sessionObj.session);
    this.setState({sessionsLoaded: true, sessions: data});

    fetch('timerdb/savesession', {
      method: 'POST',
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        session:sessionObj.session,
      })
    })
      .then(this.checkStatus)
  }

  handleSessionUISubmit = sessionID => {
    // make TimerUI for session obj
    this.setActiveTimer(sessionID);
  }

  setActiveTimer = sessionID => {
    // want to attach stopwatch to session here
    // always create a fresh stopwatch, kill prev instance if exists
    var selectedSession = this.state.sessions[sessionID];
    selectedSession.stopwatch = new Stopwatch();

    var active_timer =
    <TimerUI
      data={selectedSession} // TODO: fetch from mongodb w query
      onClick={this.handleTimerUIClick}
    />;
    this.setState({active_timer: active_timer})
  }

  showTimerUI = () => {
    if(this.state.active_timer)
    {
      return this.state.active_timer;
    }
  }

  ConvertSessionModel = (seshModel) => {
    var session = new Session(seshModel.sessionName, seshModel.sessionCategory, seshModel.sessionDescription);
    var numTasks = seshModel.tasks.length;
    var tasks = [];
    if(numTasks > 0){
      for(let i = 0; i < numTasks; i++){
        let task = seshModel.tasks[i];
        tasks.push(new Task(task.taskName, task.taskCategory, task.taskDescription));
      }
    session.setTasks(tasks);
    }
    return session
  }

  fetchSessions = () => {
    // fetch sessions from mongodb, convert to session object
    var sessions=[];
    fetch('timerdb/getallsessions')
      .then(this.checkStatus)
      .then(r => {
        if(r.sessions){
          for(let i = 0; i < r.sessions.length; i++){
            // let seshObj = r.sessions[i];
            let seshObj = this.ConvertSessionModel(r.sessions[i])
            sessions.push(seshObj);
          }
          this.setState({sessionsLoaded:true});
      }
      });

      return sessions;
  }

  showSessionUI = () => {
    if(this.state.sessionsLoaded){
      return <SessionUI data = {this.state.sessions} onClick={this.handleSessionUISubmit}/>;
    }
  }

  render() {
    return (
      <div className="App">

        <SessionForm 
            data={this.state.sessions}
            onSubmit={this.handleSessionFormSubmit}
          />

        {this.showSessionUI()}

        {this.showTimerUI()}

      </div>
    );
  }
}

export default App;