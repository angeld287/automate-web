import * as cron from 'node-cron';
import Log from '../middlewares/Log';

class NodeCron {
    public scheduledTask: cron.ScheduledTask;

    constructor(keywords: Array<string>) {
        this.scheduledTask = this.createJob(); 
    }

    private createJob(): cron.ScheduledTask {
        return cron.schedule('* * * * *', () =>  {
            Log.info(`The job has been created!`);
          }, {
            scheduled: false
          })
    }

    public startPotentialKeywordsSearchJob(){
        this.scheduledTask.start();
        Log.info(`The job has been started!`);
    }

    public stopProcess(){
        this.scheduledTask.stop();
    }
}

export default NodeCron;