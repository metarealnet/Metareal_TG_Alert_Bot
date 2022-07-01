const axios = require('axios')                  // make request
const { saveToJSON } = require('./helpers')     // save response in JSON

// DefiLlama All Protocols
async function getAllProtocols() {
    const url = "https://api.llama.fi/protocols"
    const resp = await axios.get(url)
    saveToJSON('./modules/data/', "allProtocols", resp.data)
    return resp.data
}

// DefiLlama All Chians
async function getAllChains(){
    const url = "https://api.llama.fi/chains"
    const resp = await axios.get(url)
    saveToJSON('./modules/data/', "allChains", resp.data)
    return resp.data
}

// DefiLlama Protocols and Chians (...)
async function getAllProtocolsWithChains() {
    const url = "https://api.llama.fi/lite/protocols2"
    const headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "accept-encoding":"br",
            // "cache-control": "max-age=0",
            // "if-modified-since": "Thu, 23 Jun 2022 06:20:40 GMT",
            // "if-none-match": "\"0c47f6cbf8a32bbdf179254936cbd87b\"",
            "sec-ch-ua": "\"(Not(A:Brand\";v=\"8\", \"Chromium\";v=\"100\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            // "upgrade-insecure-requests": "1"
    }
    const resp = await axios.get(url, {headers:headers})
    console.log(resp)
    saveToJSON('./modules/data/', "protocolsWithChains", resp.data)

}

// get TOP best and worst tvl changes
async function getTopTVLChanges() {
    // const allProtocols = await getAllProtocols()
    const allProtocols = require('./data/allProtocols.json')
    const bigEnough = allProtocols.filter(x => x.tvl > 1000000)     // filter for MC over 1MM

    bigEnough.forEach(x => {
        if (x.tvl > 999 && x.tvl <= 999999) {
            x.tvl = (x.tvl / 1000).toFixed(2) + 'k'
        } else if (x.tvl > 999999 && x.tvl <= 999999999) {
            x.tvl = (x.tvl / 1000000).toFixed(2) + 'M'
        }
        else if (x.tvl > 999999999 && x.tvl <= 999999999999) {
            x.tvl = (x.tvl / 1000000000).toFixed(2) + 'B'
        }
    })
    // take 20 bests and worsts to check for >30% threshold
    const best = bigEnough.sort((a, b) => { return b.change_1d - a.change_1d }).slice(0, 5)
    const worst = bigEnough.sort((a, b) => { return a.change_1d - b.change_1d }).slice(0, 5)

    // 
    const biggestChainTVL = (x) => { 
        const chains = Object.values(x.chains)
        const chainsTvlKeys = Object.keys(x.chainTvls)
        const validChainsNames = chainsTvlKeys.filter(c => chains.find(cn => cn== c))
        const validChainsTvls = validChainsNames.map(y => x.chainTvls[y] )
        const biggest = Math.max(...validChainsTvls)

        const chain = Object.keys(x.chainTvls).filter( y =>x.chainTvls[y] == biggest)
        return chain[0]
    }
    best.forEach(x => {
        x.dominantChain = biggestChainTVL(x)
    })
    worst.forEach(x => {
        x.dominantChain = biggestChainTVL(x)
    })

    // console.log('top TVL gainers ----------------------')
    // best.forEach(x => { console.log(`${x.name}: ${x.change_1d.toFixed(1)}% - ${x.dominantChain} - ${x.tvl.toFixed()} - ${x.mcap}`) })
    // console.log('top TVL losers ----------------------')
    // worst.forEach(x => { console.log(`${x.name}: ${x.change_1d.toFixed(1)}% - ${x.dominantChain} - ${x.tvl.toFixed()} - ${x.mcap}`) })
    
    // toString and fix decimal
    best.map(x => {
        x.change_1d = x.change_1d.toFixed(2)
    })
    worst.map(x => {
        x.change_1d = x.change_1d.toFixed(2)
    })

    const topTVLobj = {
        'best': best,
        'worst': worst
    }
    return topTVLobj
}

module.exports = {
    getAllProtocols,
    getAllChains,
    getTopTVLChanges
}

/**
 * What do we want?
 * top biggest gainers and losers tvl
 * across chains as well
 * dashboards for these kinds of data
 */



//  fetch("https://api.llama.fi/lite/protocols2", {
    
//   });