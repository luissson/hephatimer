var Stopwatch = require("./stopwatch");

class Session {
    constructor(name, category, description)
    {
        this.sessionName = name;
        this.sessionCategory = category;
        this.sessionDescription = description;

        this.stopwatch = new Stopwatch();
        this.start = undefined;
        this.end = undefined;
        this.duration = undefined;
        this.tasks = [];
        this.pauses = [];

    }

    pauseTimer() {
        let current_time = this.stopwatch.stop();
        this.pauses.push(Date.now())
        return current_time;
    };

    startTimer(interval) {
        this.stopwatch.start(interval);

        let startTime = this.stopwatch.startTime;
        startTime = startTime & startTime; // conver to 32bit
    };

    endTimer(){
        var summary = this.stopwatch.end();
        this.start = summary[0];
        this.end = summary[1];
        this.duration = summary[2];
        return this;
    };

    updateTimer() {
        return this.stopwatch.update();
    };

    toString() {
        let sessionInfo = `session: name: ${this.sessionName}, category: ${this.sessionCategory}, description: ${this.sessionDescription}`;
        var taskInfo = '; tasks: ';
        for(var task of this.tasks){
            taskInfo += task.toString();
        }
        return sessionInfo + taskInfo;
    }

};

class Task {
    constructor(name, category, description){
        this.taskName = name;
        this.taskCategory = category;
        this.taskDescription = description;
    };

    save(){
        return true;
    };

    toString() {
        return `name: ${this.taskName}, category: ${this.taskCategory}, description: ${this.taskDescription}`;
    };
}

module.exports = {Session, Task};