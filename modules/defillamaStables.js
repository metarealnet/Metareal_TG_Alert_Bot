const axios = require('axios')
const { saveToJSON } = require('./helpers')

const stablecoinOverviewURL = "https://uemu821wp6.execute-api.us-east-1.amazonaws.com/dev/peggeds?includeChains=true&includePrices=true"
const stablecoinChainsURL = "https://uemu821wp6.execute-api.us-east-1.amazonaws.com/dev/peggedcharts/${chain}?peggedAsset=${coingecko_id}"

async function getStablecoinOverView() {
    const resp = await axios.get(stablecoinOverviewURL)
    const data = resp.data.peggedAssets
    // const data = require('./data/stablecoinsOverview.json')
    data.forEach(x => { //((current / previous) -1 ) *100
        x.change_1d = ((x.circulating.peggedUSD / x.circulatingPrevDay.peggedUSD) - 1) * 100
        const change_1d_num = x.circulating.peggedUSD - x.circulatingPrevDay.peggedUSD
        x.change_1d_num = change_1d_num.toFixed(2)
        const absChange = Math.abs(change_1d_num)
        if (absChange > 999 && absChange <= 999999) {
            x.change_1d_num = (change_1d_num / 1000).toFixed(2) + 'k'
        } else if (absChange > 999999 && absChange <= 999999999) {
            x.change_1d_num = (change_1d_num / 1000000).toFixed(2) + 'M'
        }
        else if (absChange > 999999999 && absChange <= 999999999999) {
            x.change_1d_num = (change_1d_num / 1000000000).toFixed(2) + 'B'
        }

        x.chains.forEach(c => {
            x.chainCirculating[c].change_1d = ((x.chainCirculating[c].current.peggedUSD / x.chainCirculating[c].circulatingPrevDay.peggedUSD) - 1) * 100
            x.chainCirculating[c].circulatingPct = (x.chainCirculating[c].current.peggedUSD / x.circulating.peggedUSD * 100).toFixed(2)
        })
    })
    saveToJSON('./modules/data/', 'stablecoinsOverview', data)
    return data
}

function getBiggestSupplyChanges() {
    const allData = require('./data/stablecoinsOverview.json')
    const best = allData.sort((a, b) => { return b.change_1d - a.change_1d }).slice(0, 5)
    const worst = allData.sort((a, b) => { return a.change_1d - b.change_1d }).slice(0, 5)
    return { best, worst }
}

function getBiggestSupplyChangesObj() {
    const { best, worst } = getBiggestSupplyChanges()
    const bestObj = best.map(x => {
        return {
            symbol: x.symbol,
            change_1d_num: x.change_1d_num,
            change_1d: x.change_1d.toFixed(2)
        }
    })
    const worstObj = worst.map(x => {
        return {
            symbol: x.symbol,
            change_1d_num: x.change_1d_num,
            change_1d: x.change_1d.toFixed(2)
        }
    })
    return { bestObj, worstObj }

}

function getBiggestChangesChain(symbol) {
    const allData = require('./data/stablecoinsChains.json').peggedAssets
    const sc = allData.filter(x => { return x.symbol === symbol })[0]
    console.log(sc.chains.length)

    const dayChanges = sc.chains.map(x => {
        sc.chainCirculating[x]["changePrevDay"] = ((sc.chainCirculating[x].current.peggedUSD / sc.chainCirculating[x].circulatingPrevDay.peggedUSD) - 1) * 100
        sc.chainCirculating[x]["chain"] = x
        return sc.chainCirculating[x]
    })
    const worst = dayChanges.sort((a, b) => { return a.changePrevDay - b.changePrevDay })

    console.log(worst.length)
    // console.log(sc)
    console.log(worst)
}

module.exports = {
    getStablecoinOverView,
    getBiggestSupplyChangesObj
}

/**
 * NOTES ON THE DATA 
 * - 2 endpoints to get necessary data
 * 1. stablecoinOverviewURL
 *  - get high level data for stablecoins
 * 2. stablecoinChains
 *  - lower level data for each stablecoin and each chain
 */

/**
 * WHAT DATA DO I WANT?
 * - get biggest gainers and losers
 */

/**
 * https://uemu821wp6.execute-api.us-east-1.amazonaws.com/dev/peggeds?includeChains=true&includePrices=true 
 * and 
 * https://uemu821wp6.execute-api.us-east-1.amazonaws.com/dev/peggedcharts/${chain}?peggedAsset=${coingecko_id} 
 */
