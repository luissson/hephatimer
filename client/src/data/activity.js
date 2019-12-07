import { Stopwatch } from "./stopwatch";
import { Mongoose } from "mongoose";

export class Session {
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

    hashName = name => {
        // code taken from
        // https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
        var hash = 0;
        if (name.length == 0) return hash;

        for(let i=0; i< name.length; i++){
            let char = name.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // convert to 32bit
        }

        return hash;
    }

    setTasks(tasks) {
        this.tasks = tasks;
    };

    pauseTimer = () => {
        let current_time = this.stopwatch.stop();
        this.pauses.push(Date.now())
        return current_time;
    }

    startTimer = interval => {
        this.stopwatch.start(interval);

        let startTime = this.stopwatch.startTime;
        startTime = startTime & startTime; // conver to 32bit
        this.trackId = parseInt(this.id + "" + startTime); // make 64 bit num from concat 2 32bits
    };

    endTimer = () => {
        var summary = this.stopwatch.end();
        this.start = summary[0];
        this.end = summary[1];
        this.duration = summary[2];
        return this;
    };

    updateTimer = () => {
        return this.stopwatch.update();
    }

    toString = () => {
        let sessionInfo = `session: name: ${this.name}, id: ${this.id}, category: ${this.category}, description: ${this.description}`;
        var taskInfo = '; tasks: ';
        for(var task of this.tasks){
            taskInfo += task.toString();
        }
        return sessionInfo + taskInfo;
    }

};

export class Task {
    constructor(name, category, description){
        this.taskName = name;
        this.taskCategory = category;
        this.taskDescription = description;
    }

    save = () => {
        return true;
    }

    hashName = name => {
        // code taken from
        // https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
        var hash = 0;
        if (name.length == 0) return hash;

        for(let i=0; i< name.length; i++){
            let char = name.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash;
        }

        return hash;
    }

    toString() {
        return `name: ${this.taskName}, id: ${this.taskId}, category: ${this.taskCategory}, description: ${this.taskDescription}`;
    }
}