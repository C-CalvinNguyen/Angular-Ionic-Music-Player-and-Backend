const fs = require('fs')
const path = require('path')

const get_audio = async (req, res) => {

    const range = req.headers.range
    const songPath = path.join(__dirname, '..', 'resources', 'audio', '1', 'PerituneMaterial_Harvest6_loop.mp3')
    //const songPath = '../resources/audio/1/PerituneMaterial_Harvest6_loop.mp3'
    const songSize = fs.statSync(songPath).size

    const chunkSize = 5.12 * 1e+5 // 512kbps
    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + chunkSize, songSize - 1)

    const contentLength = end - start + 1
    
    console.log("range: " + range + ", contentLength: ", + contentLength)

    const headers = {
        "Content-Range": `bytes ${start} - ${end}/${songSize}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": 'audio/mp3'
    }
    
    console.log(headers)

    res.writeHead(206, headers)

    const stream = fs.createReadStream(songPath, {start, end})
    stream.pipe(res)

}

/*
// Temporary Code Example Given

app.get('/video', (req, res) => {
    
    const range = req.headers.range
    const videoPath = './resources/video/20171215_209724174_Creative.mp4'
    const videoSize = fs.statSync(videoPath).size

    const chunkSize = 1 * 1e+6
    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + chunkSize, videoSize - 1)

    const contentLength = end - start + 1
    
    const headers = {
        "Content-Range": `bytes ${start} - ${end}/${videoSize}`,
        "Accet-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": 'video/mp4'
    }
    res.writeHead(206, headers)

    const stream = fs.createReadStream(videoPath, {start, end})
    stream.pipe(res)

})
*/

module.exports = {
    get_audio
}