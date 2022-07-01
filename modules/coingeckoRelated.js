const axios = require('axios')                  // make request
const { saveToJSON } = require('./helpers')     // save response in JSON

// Coingecko Overview API
async function getCoingeckoOverview() {
    const url_p1 = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page=1"
    const url_p2 = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page=2"
    // return 250 * 2 results by MC
    const resp_1 = await axios.get(url_p1)
    const resp_2 = await axios.get(url_p2)
    // join 2 pages
    data = resp_1.data.concat(resp_2.data)
    saveToJSON('./modules/data/', "coingeckoOverview", data)
}

// Coingecko Trending API
async function getTrending() {
    const url = "https://api.coingecko.com/api/v3/search/trending"
    // returns top 7 trending coins and ? trending exchanges (no exchange seen so far)
    const resp = await axios.get(url)
    saveToJSON('./modules/data/', "trending", resp.data)
}



// Create table object for top trending
async function getTopTrending() {
    // ID of the trendings
    const trending = require('./data/trending.json')
    const topCoinIDs = trending.coins.map(x => x.item.id)

    // Data of the trendings
    const coingeckoOverview = require('./data/coingeckoOverview.json')
    const trendingOverview = coingeckoOverview.filter(x => topCoinIDs.includes(x.id))
    trendingOverview.sort((a, b) => {
        return topCoinIDs.indexOf(a.id) - topCoinIDs.indexOf(b.id);
    })
    
    // Already have:    current_price, total_volume, market_cap
    // Adding:          tvl, velocity(Vol/MC)
    const allProtocols = require('./data/allProtocols.json')
    const allChains = require('./data/allChains.json')

    const trendingObject = trendingOverview.map(x => {
        // Chain data priority:
        //      overwrite protocol data with chain data if id repeats
        const prevMC = x.market_cap - x.market_cap_change_24h
        const prevPrice = x.current_price - x.price_change_24h
        const previousSupply = prevMC / prevPrice
        const o = {
            id: x.id,
            name: x.name,
            symbol: x.symbol.toUpperCase(),
            marketCap: x.market_cap,
            volume: x.total_volume,
            currentPrice: x.current_price.toFixed(1),
            priceChange: x.price_change_percentage_24h.toFixed(1),
            currentSupply: x.circulating_supply.toFixed(1),
            previousSupply: previousSupply.toFixed(1),
            supplyChange: (((x.circulating_supply / previousSupply) - 1) * 100).toFixed(1),
            tvl: 'NaN',
            tvlChange: 'NaN',
            velocity: ((x.total_volume / x.market_cap) * 100).toFixed(1),
        }
        
        matchLlamaProtocol = allProtocols.filter(y => x.id == y.gecko_id)
        matchLlamaChain = allChains.filter(y => x.id == y.gecko_id)
        
        if (matchLlamaProtocol.length) {
            o.tvl = typeof(matchLlamaProtocol[0].tvl) == 'number' ? matchLlamaProtocol[0].tvl.toFixed(1) : matchLlamaProtocol[0].tvl
            if (matchLlamaProtocol[0].change_1d) {
                o.tvlChange = typeof(matchLlamaProtocol[0].change_1d) == 'number' ? matchLlamaProtocol[0].change_1d.toFixed(1) : matchLlamaProtocol[0].change_1d
            }
        }
        if (matchLlamaChain.length) {
            o.tvl = typeof(matchLlamaChain[0].tvl) == 'number' ? matchLlamaChain[0].tvl.toFixed(1) : matchLlamaChain[0].tvl
        }
        return o
    })
    return trendingObject
}

// Create table object for top velocities
async function getTopVelocity() {
    const coingeckoOverview = require('./data/coingeckoOverview.json')
    let velocityObj = coingeckoOverview.map(x => {
        // const prevMC = x.market_cap - x.market_cap_change_24h
        // const prevPrice = x.current_price - x.price_change_24h
        // const previousSupply = prevMC / prevPrice
        const o = {
            // id: x.id,
            name: x.name,
            symbol: x.symbol.toUpperCase(),
            marketCap: x.market_cap,
            volume: x.total_volume,
            // currentPrice: x.current_price.toFixed(1),
            priceChange: x.price_change_percentage_24h ? x.price_change_percentage_24h.toFixed(1) : null,
            // currentSupply: x.circulating_supply.toFixed(1),
            // previousSupply: previousSupply.toFixed(1),
            // supplyChange: (((x.circulating_supply / previousSupply) - 1) * 100).toFixed(1),
            // tvl: 'NaN',
            // tvlChange: 'NaN',
            velocity: x.total_volume ? ((x.total_volume / x.market_cap) * 100).toFixed(1) : null,
        }
        return o
    })

    // Top 20 Vel && Vel > 50%
    velocityObj = velocityObj.sort((a, b) => { return b.velocity - a.velocity }).slice(0, 20)
    velocityObj = velocityObj.filter(x => x.velocity >= 50)
    
    // k, M, B
    velocityObj.forEach(x => {
        if (x.marketCap > 999 && x.marketCap <= 999999) {
            x.marketCap = (x.marketCap / 1000).toFixed(2) + 'k'
        } else if (x.marketCap > 999999 && x.marketCap <= 999999999) {
            x.marketCap = (x.marketCap / 1000000).toFixed(2) + 'M'
        }
        else if (x.marketCap > 999999999 && x.marketCap <= 999999999999) {
            x.marketCap = (x.marketCap / 1000000000).toFixed(2) + 'B'
        }

        if (x.volume > 999 && x.volume <= 999999) {
            x.volume = (x.volume / 1000).toFixed(2) + 'k'
        } else if (x.volume > 999999 && x.volume <= 999999999) {
            x.volume = (x.volume / 1000000).toFixed(2) + 'M'
        }
        else if (x.volume > 999999999 && x.volume <= 999999999999) {
            x.volume = (x.volume / 1000000000).toFixed(2) + 'B'
        }
    })
    return velocityObj
}

module.exports = {
    getCoingeckoOverview,
    getTrending,
    getTopTrending,
    getTopVelocity
}