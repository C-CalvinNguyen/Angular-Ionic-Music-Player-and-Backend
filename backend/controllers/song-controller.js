const fs = require('fs')
const path = require('path')
const Song = require('../models/song.js')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { resolve } = require('path');
ffmpeg.setFfmpegPath(ffmpegPath);

function convert(file,  finalPath, name,format, bitrate) {
    return new Promise(function( res, rej ) {

    let filename = `${name}.${format}`

    ffmpeg(file.path)
    .toFormat(format)
    .audioBitrate(bitrate)
    .on('error', (err) => {
        rej(err)
    })
    .on('end', () => {
        res(`converted ${bitrate}`)
    })
    .save(path.join(finalPath, format ,bitrate, filename))
    })
}

function makeSubDirMp3(finalPath) {

    fs.mkdir(path.join(finalPath, 'mp3', '320'), {recursive: true}, (err) => {
        if (err != null) {
            console.log(err)
        } 
    })

    fs.mkdir(path.join(finalPath, 'mp3', '256'), {recursive: true}, (err) => {
        if (err != null) {
            console.log(err)
        } 
    })

    fs.mkdir(path.join(finalPath, 'mp3', '128'), {recursive: true}, (err) => {
        if (err != null) {
            console.log(err)
        } 
    })
}

/*
function makeSubDirOgg(finalPath) {
    
    fs.mkdir(path.join(finalPath, 'ogg', '256'), {recursive: true}, (err) => {
        if (err != null) {
            console.log(err)
        } 
    })

    fs.mkdir(path.join(finalPath, 'ogg', '128'), {recursive: true}, (err) => {
        if (err != null) {
            console.log(err)
        } 
    })

}
*/

function makeSubDirWav(finalPath) {

    fs.mkdir(path.join(finalPath, 'wav'), {recursive: true}, (err) => {
        if (err != null) {
            console.log(err)
        } 
    })

}

function convertSong(file, ext, finalPath, filename) {

    // if wav convert to mp3 -> ogg and copy file to wav subdir
    if (ext == "wav") {
        
        // Move file to proper location
        makeSubDirMp3(finalPath)
        //makeSubDirOgg(finalPath)
        makeSubDirWav(finalPath)

        fs.copyFile(file.path, path.join(finalPath, ext, (filename+'.wav')), (err) => {
            if (err != null) {
                console.log(err)
            }
        })

        Promise.all([
            convert(file, finalPath, filename, 'mp3', '320'),
            convert(file, finalPath, filename, 'mp3', '256'),
            convert(file, finalPath, filename, 'mp3', '128')
        ]).then(() => {
            fs.unlink(file.path, (err) => {
                if (err != null) {
                    console.log(err)
                } else {
                    console.log('deleted temp file')
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    // if mp3 create mp3 subfolders and convert
    if (ext == 'mp3') {
        makeSubDirMp3(finalPath)
        
        Promise.all([
        convert(file, finalPath, filename, 'mp3', '320'),
        convert(file, finalPath, filename, 'mp3', '256'),
        convert(file, finalPath, filename, 'mp3', '128')
        ]).then(() => {
            fs.unlink(file.path, (err) => {
                if (err != null) {
                    console.log(err)
                } else {
                    console.log('deleted temp file')
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    /*
    if (ext == 'ogg') {
        makeSubDirOgg(finalPath)
    }
    */
}

// Called when Adding A Song (Multipart/FormData Using Multer)
const addSong = async (req, res) => {

    let fileArray = req.file.originalname.split('.')
    let ext = fileArray.pop()

    let finalPath = path.join(__dirname, '..', 'resources', 'audio', req.user._id.toString(), req.body.title)
    
    let tempSong = Song()
    tempSong.title = req.body.title
    tempSong.artists = req.body.artists
    tempSong.genres = req.body.genres
    tempSong.audioPath = finalPath
    tempSong.userId = req.user._id.toString()
    await tempSong.save()

    fs.mkdir(finalPath, {recursive: true}, (err) => {
        if (err != null) {
            return res.status(400).json({'message': err})
        } else {
            convertSong(req.file, ext, finalPath, req.body.title)
        }
    })

    return res.status(200).json({'message': 'directory created'})
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

// TO DO Check if query id, format and bitrate is in place
const get_audio = async (req, res) => {


    let songId = req.query.s.toString()
    let format = ''
    if (!req.query.form) {
        format = 'mp3'
    } else {
        format = req.query.form.toString()
    }
    let bitrate = ''
    if (!req.query.bit) {
        bitrate = '128'
    } else {
        bitrate = req.query.bit.toString()
    }

    const songFind = await Song.findOne({_id: songId})
    let songPath = ''

    let filename = `${songFind.title}.${format}`
    //console.log(path.join(songFind.audioPath, format, bitrate, filename))

    if (format == 'wav') {
        songPath = path.join(songFind.audioPath, format, filename)
    } else {
        songPath = path.join(songFind.audioPath, format, bitrate, filename)
    }

    const range = req.headers.range
    //const songPath = path.join(songFind.audioPath, format, bitrate, filename)
    //const songPath = '../resources/audio/1/PerituneMaterial_Harvest6_loop.mp3'
    const songSize = fs.statSync(songPath).size

    const chunkSize = 1 * 1e+6
    //const chunkSize = 5.12 * 1e+5 // 512kbps
    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + chunkSize, songSize - 1)

    const contentLength = end - start + 1
    
    console.log("range: " + range + ", contentLength: ", + contentLength)

    const headers = {
        "Content-Range": `bytes ${start} - ${end}/${songSize}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": `audio/${format}`
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