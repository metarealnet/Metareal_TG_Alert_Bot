/**
 * find chat info on
 * https://api.telegram.org/bot${key}/getUpdates
 */

const tgInfo = require('../utils/sensitive/tgBotsKeys.json')
const axios = require("axios")

const MAIN_URL = "https://api.telegram.org/"
const MARKDOWN = 'parse_mode=MarkdownV2&disable_web_page_preview=True'
const BOTKEY = tgInfo.keys.metareal_bot
const CHAT_ID = tgInfo.chatIds.botboi

async function sendMessage(msg) {
    msg = escapeCharacters(msg)
    const send_url = `${MAIN_URL}bot${BOTKEY}/sendMessage?chat_id=${CHAT_ID}&text=${msg}&${MARKDOWN}`
    console.log(send_url)
    const resp = await axios.get(send_url)
}
async function sendTable(table) {
    const t = escapeCharacters(table)
    const msg = `
    <pre>
${table}
    </pre>
    `
    const HTML = "parse_mode=HTML"
    const send_url = `${MAIN_URL}bot${BOTKEY}/sendMessage?chat_id=${CHAT_ID}&text=${msg}&${HTML}`
    // console.log(send_url)
    const resp = await axios.get(send_url)
}

function createHyperlink(text, url) {
    const hyperlink = `__[${text}](${url})__`
    return hyperlink
}
function escapeCharacters(msg) {
    msg = msg.replaceAll('.', '\\.')
    msg = msg.replaceAll(',', '\\,')
    msg = msg.replaceAll('_', '\\_')
    msg = msg.replaceAll('(', '\\(')
    msg = msg.replaceAll(')', '\\)')
    msg = msg.replaceAll('#', '\\#')
    msg = msg.replaceAll('!', '\\!')
    msg = msg.replaceAll('+', '\\+')
    msg = msg.replaceAll('-', '\\-')
    msg = msg.replaceAll('=', '\\=')
    msg = msg.replaceAll('"', '\\"')
    msg = msg.replaceAll('{', '\\{')
    msg = msg.replaceAll('}', '\\}')
    msg = msg.replaceAll('|', '\\|')

    return msg
}

module.exports = {
    sendMessage,
    sendTable
}