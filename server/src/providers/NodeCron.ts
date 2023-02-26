import * as cron from 'node-cron';
import Log from '../middlewares/Log';

class NodeCron {
    public scheduledTask: cron.ScheduledTask;

    constructor(keywords: Array<string>, job: string | ((now: Date | "manual" | "init") => void)) {
        this.scheduledTask = this.createJob(keywords, job); 
    }

    private createJob(keywords: Array<string>, job: string | ((now: Date | "manual" | "init") => void)): cron.ScheduledTask {
        return cron.schedule('* * * * *', job, {
            scheduled: false
          })
    }

    public startPotentialKeywordsSearchJob(){
        this.scheduledTask.start();
        Log.error(`The job has been started!`);
    }

    public stopProcess(){
        this.scheduledTask.stop();
    }
}

export default NodeCron;