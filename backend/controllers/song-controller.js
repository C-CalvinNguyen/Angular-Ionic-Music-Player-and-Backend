const fs = require('fs')
const path = require('path')

const get_audio = async (req, res) => {

    const range = req.headers.range
    const songPath = path.join(__dirname, '..', 'assets', 'audio', '1', 'PerituneMaterial_Harvest6_loop.mp3')
    //const songPath = '../resources/audio/1/PerituneMaterial_Harvest6_loop.mp3'
    const songSize = fs.statSync(songPath).size

    const chunkSize = 1 * 1e+6
    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + chunkSize, songSize - 1)

    const contentLength = end - start + 1
    
    const headers = {
        "Content-Range": `bytes ${start} - ${end}/${songSize}`,
        "Accet-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": 'audio/mp3'
    }
    res.writeHead(206, headers)

    const stream = fs.createReadStream(songPath, {start, end})
    stream.pipe(res)

}

module.exports = {
    get_audio
}