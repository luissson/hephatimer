export class Stopwatch {
    constructor() {

      // variables for storing stopwatch meta data
      this.startDate = undefined;
      this.endDate = undefined;
      this.duration = undefined;

      // variables for computing time
      this.time = 0;
      this.offset = 0;
      this.startTime = 0;
      this.interval = undefined;
    }
  
  start = interval => {
    if(this.interval === undefined)
    {
      if(interval === undefined){
        this.interval = setInterval(this.update, 1000);
      }
      else {
        this.interval = interval;
      }

      let startDate = new Date();
      let startTime = startDate.getTime();

      this.startDate = startDate;
      this.startTime = startTime;
      this.offset = startTime;
    }
  };

  stop = () => {
    if(this.interval !== undefined)
    {
      clearInterval(this.interval);
      this.interval = undefined;

      return this.time;
    }
    else {
      if(this.time !== 0)
      {
        return this.time;
      }
      else {
        return -1000;
      }
    }
  }

  end = () => {
    if(this.interval !== undefined)
    {
      this.stop();

      let endDate = new Date();
      this.duration = (endDate.getTime() - this.startDate.getTime())/1000;
      this.endDate = endDate;

      let start = this.startDate;
      let end = this.endDate;
      let duration = this.duration;

      this.startDate = undefined;
      this.endDate = undefined;
      this.duration = undefined;

      this.time = 0;
      this.offset = 0;
      this.startTime = 0

      return [start, end, duration];
    }

    return {};
  }

  update = () => {
    let now = Date.now();
    let offset = this.offset;
    let delta = now - offset;
    let time = this.time;
    this.time = time + delta;
    this.offset = now;

    return this.time;
  }
}