import * as node from 'node-schedule';
import Log from '../middlewares/Log';

class NodeJob {
    public scheduledTask: node.Job;

    constructor() {}

    public startJob(uniqueName: string, job: node.JobCallback) {
        const date = new Date();
        date.setSeconds(date.getSeconds() + 30);
        this.scheduledTask = node.scheduleJob(uniqueName, date, job)
        Log.info(`The job has been started!`);
    }

    public stopJob(uniqueName: string){
        this.scheduledTask = node.scheduledJobs[uniqueName];
        this.scheduledTask.cancel();
    }

    public getDetails(uniqueName: string){
        this.scheduledTask = node.scheduledJobs[uniqueName];
        
        return {
            nextInvocation: this.scheduledTask.nextInvocation()
        }
    }
}

export default NodeJob;