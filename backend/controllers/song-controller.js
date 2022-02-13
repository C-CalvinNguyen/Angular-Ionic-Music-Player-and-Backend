const fs = require('fs')
const path = require('path')
const Song = require('../models/song.js')

function convertSong(song) {

}

// Called when Adding A Song (Multipart/FormData Using Multer)
const addSong = async (req, res) => {

    // Checks if fields exist
    if (!req.body.title || !req.body.artists) {
        return res.status(400).json({'message': 'Please enter title & artists'})
    }

    try {

        // Split the file name and the extension
        let fileArray = req.file.originalname.split('.')
        let ext = fileArray.pop()
        let fileLoc = fileArray.join('.')

        // Set the File Path, _id / filename / format / file
        let tempPath = path.join(__dirname, '..', 'resources', 'audio', req.user._id.toString(), fileLoc, ext)

        let tempSong = Song()
        tempSong.title = req.body.title
        tempSong.artists = req.body.artists
        tempSong.genres = req.body.genres
        tempSong.path = path.join(tempPath, req.file.originalname)
        await tempSong.save()

        //console.log(tempSong)
        //console.log(tempPath)        
        //return res.status(200).json({'message': 'File written to path'})

        //console.log(req.file)

        await fs.mkdir(tempPath, {recursive: true}, async (err) => {
            if (err != null) {
                return res.status(400).json({'message': err})
            } else {

                await fs.writeFile(path.join(tempPath, req.file.originalname), req.file.buffer, (err) => {
                    if (err) {
                        console.log(err)
                        return res.status(400).json({'message': err})
                    } else {
                        return res.status(200).json({'message': 'File written to path'})
                    }
                })
            }
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

const manageSong = async (req, res) => {

}

const deleteSong = async (req, res) => {

}

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
    get_audio,
    addSong
}