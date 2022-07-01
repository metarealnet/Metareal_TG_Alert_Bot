const { getAllProtocols, getAllChains } = require('./defillamaTVL')
const { getCoingeckoOverview, getTrending } = require('./coingeckoRelated')
const { getStablecoinOverView } = require('./defillamaStables')

// Get all API
async function callAllEndpoints() {
    await getAllProtocols()
    console.log('got all protocols')
    await getAllChains()
    console.log('got all chains')
    await getCoingeckoOverview()
    console.log('got all CG')
    await getTrending()
    console.log('got all trending')
    // await getStablecoinOverView() // Stablecoins API down
    // console.log('got all stables')
}

module.exports = {
    callAllEndpoints  
}