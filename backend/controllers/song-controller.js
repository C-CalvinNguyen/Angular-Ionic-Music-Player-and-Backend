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

        // Create Song For DB
        let tempSong = Song()
        tempSong.title = req.body.title
        tempSong.artists = req.body.artists
        tempSong.genres = req.body.genres
        tempSong.path = path.join(tempPath, req.file.originalname)
        tempSong.userId = req.user._id.toString()
        await tempSong.save()

        //console.log(tempSong)
        //console.log(tempPath)
        //console.log(req.file)

        // Save to local folder (TO DO call convertSong instead)
        fs.mkdir(tempPath, {recursive: true}, async (err) => {
            
            if (err != null) {
                return res.status(400).json({'message': err})
            } else {

                fs.writeFile(path.join(tempPath, req.file.originalname), req.file.buffer, (err) => {
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

// Updates Title, Artists, and Genres TO DO: GET Song id based on req param
const updateSong = async (req, res) => {

    try {

        const songFind = await Song.findOne({_id: req.body.songId})
        console.log(songFind)

        // Checks if user id in the song matches the user id from request
        if (req.user._id.toString() != songFind.userId) {

            return res.status(403).json({'message': 'Not Authorized, Wrong User'})
            
        } else {

            if (!req.body.title == false) {
                if (req.body.title != songFind.title) {
                    songFind.title = req.body.title
                }
            }
    
            if (!req.body.artists == false) {
                if (req.body.artists != songFind.artists) {
                    songFind.artists = req.body.artists
                }
            }
    
            if (!req.body.genres == false) {
                if (req.body.genres != songFind.genres) {
                    songFind.genres = req.body.genres
                }
            }
    
            await songFind.save()
    
            return res.status(200).json({'message': 'Song Updated'})

        }

    } catch (err) {
        return res.status(400).json(err)
    }

}

// Deletes Song From Database, & Local Storage, Takes Song ID and User ID For Authentication, GET SONG ID ON REQ PARAM
const deleteSong = async (req, res) => {

    console.log(req.body)

    if (!req.body.songId) {
        return res.status(400).json(err)
    }

    try {

        const songFind = await Song.findOne({_id: req.body.songId})

        if (req.user._id.toString() != songFind.userId) {

            return res.status(403).json({'message': 'Not Authorized, Wrong User'})
            
        } else {
        

            let tempPath = songFind.path.split(path.sep)
            tempPath.pop()
            tempPath.pop()
            let pathString = tempPath.join(path.sep)
            let deleteId = songFind._id.toString()

            fs.rm(pathString, {recursive: true, force: true}, async (err) => {
                if (err != null && !err == false) {
                    console.log(err)
                    return res.status(400).json({'message': err})
                } else {
                    console.log(err)
                    await Song.deleteOne({_id: req.body.songId, userId: songFind.userId})
                    return res.status(200).json({'message': 'Deleted'})
                }
            })
        }


    } catch (err) {
        return res.status(400).json(err)
    }


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
    addSong,
    updateSong,
    deleteSong
}