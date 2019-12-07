import React from 'react';

export class TimerUI extends React.Component {
  // TODO: need to generate new stopwatches -> stopwatch factory
  // a stopwatch per session, instead of a stopwatch with a history
  // keep track of pauses/stops, counter
  constructor(props) {
    super(props);

    let session = this.props.data;
    this.state = ({
        session: session,
        current_time: 0,
    });
  }

  start = () => {
      var interval = setInterval(this.update, 1000);
      this.state.session.startTimer(interval);
  }

  stop = () => {
      var current_time = this.state.session.pauseTimer();
      this.setState({current_time: current_time});
  }

  checkStatus = (res) => {
    return res;
  }

  end = () => {
      let session = this.state.session.endTimer();
      this.setState({session: session});
      this.setState({current_time: 0});

      fetch('timerdb/addsessiontimer', {
        method: 'POST',
        headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          session:this.state.session,
        })
      })
        .then(this.checkStatus);
  }
  
  update = () => {
      let current_time = this.state.session.updateTimer();
      this.setState({current_time: current_time});
  }

  render() {
    return (
      <div>
        <h1>{this.state.current_time/1000}</h1>
        <button className="btn timerButton" onClick={this.start}>Start</button>
        <button className="btn timerButton" onClick={this.stop}>Stop</button>
        <button className="btn timerButton" onClick={this.end}>End</button>
      </div>
    );
  }
}