const { callAllEndpoints } = require('../modules/callAllEndpoints')
const { sendAllTables } = require('../modules/createAndSend')
const { sendTable, sendMessage } = require('../modules/telegram')

var i = 0
async function sendTest() {

    try {
        await sendMessage('Metareal Bot Alpha Updates')
        // update json data
        await callAllEndpoints()

        // send updates
        await sendAllTables()
    } catch (e) {
        i++
        if (i == 3) {
            process.exit(1)
        }
        sendMessage(e.message)
        sendTest()
    }
}

// Start bot
sendTest()