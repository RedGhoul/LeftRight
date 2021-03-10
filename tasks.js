const Queue = require('bull')
const { setQueues, BullAdapter, router } = require('bull-board')
const puppeteer = require('puppeteer');
const mainqq = new Queue('mainqq', {
    redis: {
        port: 6379, host: '127.0.0.1', password: ''
    }
});
const { v4: uuidv4 } = require('uuid');
setQueues([
    new BullAdapter(mainqq)
]);
async function StartProcesses() {

    mainqq.process(function (job, done) {


        done();
    });
    const myJob = await mainqq.add(
        { foo: 'bar' },
        {
            repeat: {
                every: 10000,
            }
        }
    );

}

module.exports = {
    StartProcesses: StartProcesses,
    Router: router
}

