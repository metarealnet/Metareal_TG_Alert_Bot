const fs = require('fs');

function saveToJSON(path, name, obj) {
    const saveJson = JSON.stringify(obj, null, 4)
    fs.writeFileSync(`${path}${name}.json`, saveJson, 'utf8', (err) => {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    saveToJSON
}