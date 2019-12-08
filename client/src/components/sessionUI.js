import React  from 'react';

const StopwatchItem = (prop, i) => (
<li>
  Start Datetime: {prop.stopwatch.startDate} <br/>
  End Datetime: {prop.stopwatch.endDate} <br/>
  Duration: {prop.stopwatch.duration}
</li>
);

const StopwatchList = (props, i) => (
      <ol className="stopwatch-list">
        <h5>Saved Timers</h5>
        {props.stopwatches.map((stopwatch, i) => <StopwatchItem stopwatch={stopwatch} key={i} />)}
      </ol>);
  
export class SessionUI extends React.Component{
  constructor(props) {
    super(props);

    this.state = ({
      stopwatchesLoaded: false,
      stopwatches: []
    });
  }
  // Display session object field values
  // Display timer for session object

  handleSubmit = (event) => {
    // display timer for this session
    const id = event.target.id;
    this.printStopwatches(this.props.data[id]);
    this.props.onClick(id);
  }

  printSessionObj = (sessionObj) => {
    var printString = sessionObj.sessionName;
    var tasks = sessionObj.tasks;
    for(let i = 0; i < sessionObj.tasks.length; i++){
      printString += " || " + tasks[i].taskName;
    }
    return printString;
  }

  printStopwatches = async function(sessionObj){
    await fetch('timerdb/getstopwatches?name=' + sessionObj.sessionName)
      .then(r => r.json())
      .then(r => {
        if(r.session[0].timers.length > 0){ // index 0 implies we expect 1 result from api
          this.setState({stopwatches: r.session[0].timers, stopwatchesLoaded: true});
          } else {
          this.setState({stopwatches: [], stopwatchesLoaded: false});
          }
      });
  }

  showSession = i => {
    return (
    <div key={i}>
      <button className="btn btn-primary seshButton" id={i} onClick={this.handleSubmit}>
      {this.printSessionObj(this.props.data[i])}
      </button>
    </div>
    );
  }

  stopwatches() {
    var stopwatches = [];
    if(this.state.stopwatchesLoaded){
      stopwatches.push(<StopwatchList stopwatches={this.state.stopwatches} />);
    }

    return stopwatches;
  }

  sessions() {
    let numSessions = this.props.data.length;
    let sessionsInfo = [];
    for( let i = 0; i < numSessions; i++){
      sessionsInfo.push(this.showSession(i));
    }
    return sessionsInfo;
  }

  render() {
    return(
      <div className="sessionsUI">
        <div className="row">
          {this.sessions()}
        </div>

        <div className="row">
          {this.stopwatches()}
        </div>
      </div>
    )
  }
}