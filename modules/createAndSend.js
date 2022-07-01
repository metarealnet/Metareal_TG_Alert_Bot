
const { table } = require('table');
const { sendTable, sendMessage } = require('./telegram')
const { getTopTrending, getTopVelocity } = require('./coingeckoRelated')
const { getTopTVLChanges } = require('./defillamaTVL')
const { getBiggestSupplyChangesObj } = require('./defillamaStables')

// Send table for Coingecko Trending

// generate&send table functions from others

async function sendTrendingTable() {
    const trending = await getTopTrending()
    const trendingTrimmed = trending.map(x => {
        return {
            symbol: x.symbol,
            // priceChg: `<a href="https://www.coingecko.com/en/coins/${x.id}">${x.priceChange}</a>`,
            priceChg: x.priceChange,
            tvlChg: x.tvlChange,
            supplyChg: x.supplyChange,
            velocity: x.velocity,
        }
    })

    const tableHeader = `|------------Trending--------------|
| SYM  |prc-% |tvl-% |sply-%|vlcty |
|------|------|------|------|------|
`
    var bt = ''
    const body = trendingTrimmed.map(row => {
        const arr = Object.keys(row).map(key => row[key].padEnd(6, ' '))
        console.log(arr)
        const line = '|' + arr.join('|', arr)
        bt += line + '|\n'
        // console.log(bt)
    })
    const table = tableHeader + bt
    console.log(table)
    sendTable(table)
}

// Sending Table for DefiLlama top TVL changes
async function sendTopTVLTable() {
    const topTVLobj = await getTopTVLChanges()
    
    // Trim best and worst
    const topTVLobjBestTrimmed = topTVLobj.best.map(x => {
        return {
            symbol: (x.symbol != '-') ? x.symbol : x.name,
            tvlChg: x.change_1d,
            tvl: x.tvl,
            domChain: x.dominantChain,
        }
    })
    const topTVLobjWorstTrimmed = topTVLobj.worst.map(x => {
        return {
            symbol: (x.symbol != '-') ? x.symbol : x.name,
            tvlChg: x.change_1d,
            tvl: x.tvl,
            domChain: x.dominantChain,
        }
    })
    
    // create table
    const tableBestHeader = `|---------------Top Best TVL--------------|
|SYM       |TVL-%   |TVL-$     |domChain  |
|----------|--------|----------|----------|
`   
    var btBest = ''
    const bodyBest = topTVLobjBestTrimmed.map(row => {
        const arr = Object.keys(row).map(key => {
            if (key == 'symbol') {
                return row[key].padEnd(10, ' ')
            } else if (key == 'tvlChg') {
                return row[key].padEnd(8, ' ')
            } else if (key == 'tvl') {
                return row[key].padEnd(10, ' ')
            } else if (key == 'domChain') {
                return row[key].padEnd(10, ' ')
            }
        })
        console.log(arr)
        const line = '|' + arr.join('|', arr)
        btBest += line + '|\n'
    })
    btBest = btBest.substring(0, btBest.length - 1)   // remote last \n

    const tableWorstHeader = `
|--------------Top Worst TVL--------------|
|----------|--------|----------|----------|
`
    var btWorst = ''
    const bodyWorst = topTVLobjWorstTrimmed.map(row => {
        const arr = Object.keys(row).map(key => {
            if (key == 'symbol') {
                return row[key].padEnd(10, ' ')
            } else if (key == 'tvlChg') {
                return row[key].padEnd(8, ' ')
            } else if (key == 'tvl') {
                return row[key].padEnd(10, ' ')
            } else if (key == 'domChain') {
                return row[key].padEnd(10, ' ')
            }
        })
        console.log(arr)
        const line = '|' + arr.join('|', arr)
        btWorst += line + '|\n'
    })

    const table = tableBestHeader + btBest + tableWorstHeader + btWorst
    console.log(table)
    sendTable(table)
}

async function sendStablesTable() {
    const { bestObj, worstObj } = getBiggestSupplyChangesObj()
    // console.log(bestObj)
    // console.log('top TVL gainers ----------------------')
    // bestObj.forEach(x => { console.log(`${x.symbol}: ${x.change_1d_num} - ${x.change_1d}%`) })
    // console.log('top TVL losers ----------------------')
    // worst.forEach(x => { console.log(`${x.symbol}: ${x.change_1d.toFixed(2)}% - ${x.dominantChain} - ${x.tvl.toFixed(2)} - ${x.mcap}`) })
    const bestHeader = `|----TopStablesChange---|
| SYM  |supplyChg|sply-%|
|------|---------|------|
`
    const createLine = (row) => {
        const arr = Object.keys(row).map(key => {
            if (key == "change_1d_num") {
                return row[key].padEnd(9, ' ')
            } else {
                return row[key].padEnd(6, ' ')
            }
        })
        const line = '|' + arr.join('|', arr)
        return line
    }

    var bestBt = ''
    bestObj.forEach(row => {
        const line = createLine(row)
        bestBt += line + '|\n'
    })
    const worstHeader = `|-----------------------|
|--WorstStablesChange---|
|------|---------|------|
`
    var worstBt = ''
    worstObj.forEach(row => {
        const line = createLine(row)
        worstBt += line + '|\n'
    })
    const table = bestHeader + bestBt + worstHeader + worstBt
    console.log(table)
    sendTable(table)
}

async function sendTopVelocity() {
    const velocityObj = await getTopVelocity()
    const tableHeader = `|-------------------------Top Velocity-----------------------|
|NAME           |SYMBOL  |MC-$    |Vol-$   |PrcChg-%|Vel-%   |
|---------------|--------|--------|--------|--------|--------|
`
    var bt = ''
    const body = velocityObj.map(row => {
        const arr = Object.keys(row).map(key => {
            if (key == 'name') {
                return row[key].padEnd(15, ' ')
            } else if (key == 'symbol') {
                return row[key].padEnd(8, ' ')
            } else if (key == 'marketCap') {
                return row[key].padEnd(8, ' ')
            } else if (key == 'volume') {
                return row[key].padEnd(8, ' ')
            } else if (key == 'priceChange') {
                return row[key].padEnd(8, ' ')
            } else if (key == 'velocity') {
                return row[key].padEnd(8, ' ')
            }
        })
        //console.log(arr)
        const line = '|' + arr.join('|', arr)
        bt += line + '|\n'
    })
    const table = tableHeader + bt
    console.log(table)
    sendTable(table)
}

// Overall send (send all tables above in one function)
async function sendAllTables() {
    await sendTopTVLTable()
    await sendTrendingTable()
    // await sendStablesTable() // Stablecoins API down
    await sendTopVelocity()
}

module.exports = {
    sendAllTables
}