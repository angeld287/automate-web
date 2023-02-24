import * as cron from 'node-cron';

class NodeCron {
    public scheduledTask: cron.ScheduledTask;

    constructor(keywords: Array<string>) {
        this.scheduledTask = this.createJob();
    }

    private createJob(): cron.ScheduledTask {
        return cron.schedule('* * * * *', () =>  {
            console.log('stopped task');
          }, {
            scheduled: false
          })
    }

    public startPotentialKeywordsSearchJob(){
        this.scheduledTask.start();
    }

    public stopProcess(){
        this.scheduledTask.stop();
    }
}

export default NodeCron;