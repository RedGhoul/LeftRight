const Queue = require('bull')
const { setQueues, BullAdapter } = require('bull-board')

const mainqq = new Queue()

setQueues([
    new BullAdapter(mainqq)
]);
