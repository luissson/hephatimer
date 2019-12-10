import React, { Component } from 'react';
import './App.css';
import {Session, Task} from './data/activity.js'
import {SessionForm} from './components/sessionForm.js'
import {SessionUI} from './components/sessionUI.js'
import {TimerUI} from './components/timerUI.js'
import {PlotsUI} from './components/plotsUI.js'
import { Stopwatch } from './data/stopwatch';
import { Helmet } from 'react-helmet'


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      sessionsLoaded: false,
      sessions: [],
      active_timer: [],
      active_plot:[],
      active_session: [],
    };
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
    this.setState({active_timer: [], active_plot:[], active_session: this.state.sessions[sessionID]}, () => {
      this.setActiveTimer();
      this.setActivePlot();
    });
  }

  handleTimerUIClick = () => {
    this.setState({active_timer: [], active_plot:[]})
  }

  setActivePlot(){
    let active_plot = <PlotsUI show="show" session={this.state.active_session}/>;
    this.setState({active_plot: active_plot});
  }

  setActiveTimer() {
    let active_timer =
      <TimerUI
        data={this.state.active_session}
        onClick={this.handleTimerUIClick}
      />;

    this.setState({active_timer: active_timer})
  }

  showTimerUI = () => {
    return this.state.active_timer;
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

  render() {
    return (
      <>
        <Helmet>
          <title>Hephatimer</title>
        </Helmet>

        <div className="App">
          <div className="row">

            <div className="col-4">
              <h5>Session Form:</h5> 
              <SessionForm 
                  data={this.state.sessions}
                  onSubmit={this.handleSessionFormSubmit}
              />
            </div>

            <div className="col-4">
              <div className="row">
                <div className="col">
                  <SessionUI 
                    data = {this.state.sessions}
                    onClick={this.handleSessionUISubmit}
                   />
                </div>
              </div>
            </div>

            <div className="col-4">
              {this.state.active_timer}
            </div>

          </div>

          <div className="row">
            <div className="col">
              {this.state.active_plot}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;