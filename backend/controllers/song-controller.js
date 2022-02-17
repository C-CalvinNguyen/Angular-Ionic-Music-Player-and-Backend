const fs = require('fs')
const path = require('path')
const Song = require('../models/song.js')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);


/*
===============================================================================
    Converts file in temp folder using ffmpeg
        save converted file to finalPath/format/bitrate/
===============================================================================
*/
function convert(file, finalPath, title, format, bitrate) {
    
    return new Promise(function( res, rej ) {
        
        // new file name is ${title}.${format}
        let filename = `${title}.${format}`

        // Convert using ffmpeg to specific format & bitrate
        ffmpeg(file.path)
        .toFormat(format)
        .audioBitrate(bitrate)
        .on('error', (err) => {
            rej(err)
        })
        .on('end', () => {
            res(`converted ${bitrate}`)
        })
        .save(path.join(finalPath, format, bitrate, filename))
    })
}


/*
===============================================================================
    Makes sub directories 
        for format (file extension type) & bitrate (320, 256, 128)
===============================================================================
*/
function makeSubDir(finalPath, format, bitrate) {

    fs.mkdir(path.join(finalPath, format, bitrate), {recursive: true}, (err) => {
        if (err != null) {
            console.log(err)
        } 
    })

}


/*
===============================================================================
    Called when converting songs
        wav -> ogg & mp3 (various bitrates)
        mp3 -> mp3 (various bitrates)
        ogg -> ogg (various bitrates)
    Delete temp file after conversion
===============================================================================
*/
function convertSong(file, ext, finalPath, title) {
    return new Promise(function (res, rej) {
        // If tempfile is WAV create subdirectories & convert (WAV, MP3, OGG)
    if (ext == "wav") {
        
        // make MP3 & OGG subdirectories
        makeSubDir(finalPath, 'mp3', '320')
        makeSubDir(finalPath, 'mp3', '256')
        makeSubDir(finalPath, 'mp3', '128')
        makeSubDir(finalPath, 'ogg', '256')
        makeSubDir(finalPath, 'ogg', '128')

        // make wav subdirectory and copy file into it
        fs.mkdir(path.join(finalPath, 'wav'), {recursive: true}, (err) => {
            if (err != null) {
                console.log(err)
            } else {
                fs.copyFile(file.path, path.join(finalPath, ext, (title+'.wav')), (err) => {
                    if (err != null) {
                        console.log(err)
                    }
                })
            }
        })

        // Convert temp file into formats, then delete file after conversion
        Promise.all([
            convert(file, finalPath, title, 'mp3', '320'),
            convert(file, finalPath, title, 'mp3', '256'),
            convert(file, finalPath, title, 'mp3', '128'),
            convert(file, finalPath, title, 'ogg', '256'),
            convert(file, finalPath, title, 'ogg', '128')
        ])
        .then(() => {
            fs.unlink(file.path, (err) => {
                if (err != null) {
                    console.log(err)
                } else {
                    console.log('deleted temp file')
                    res()
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    // if tempfile is MP3 or OGG create subdirectories & convert (MP3, OGG)
    if (ext == 'mp3' || ext == 'ogg') {

        // make MP3 & OGG subdirectories
        makeSubDir(finalPath, 'mp3', '320')
        makeSubDir(finalPath, 'mp3', '256')
        makeSubDir(finalPath, 'mp3', '128')
        makeSubDir(finalPath, 'ogg', '256')
        makeSubDir(finalPath, 'ogg', '128')
        
        // Convert temp file into formats, then delete file after conversion
        Promise.all([
            convert(file, finalPath, title, 'mp3', '320'),
            convert(file, finalPath, title, 'mp3', '256'),
            convert(file, finalPath, title, 'mp3', '128'),
            convert(file, finalPath, title, 'ogg', '256'),
            convert(file, finalPath, title, 'ogg', '128')
        ])
        .then(() => {
            fs.unlink(file.path, (err) => {
                if (err != null) {
                    console.log(err)
                } else {
                    console.log('deleted temp file')
                    res()
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
    })
}


/*
===============================================================================
    Called when adding a song (Multipart/FormData Using Multer)
===============================================================================
*/
const addSong = async (req, res) => {

    // Checks if file was uploaded
    if (!req.file){
        return res.status(400).json({Error: 'No file selected'})
    }

    // Checks if user did not input title (deletes temp file if false)
    if (!req.body.title) {
        fs.unlink(req.file.path, (err) => {})
        return res.status(400).json({Error: 'Please enter a title'})
    }

    // Create new path string, resources/audio/{USERID}/{title}
    let finalPath = path.join(__dirname, '..', 'resources', 'audio', req.user._id.toString(), req.body.title)

    // Checks if the user already used the title (delete temp file if false)
    if (fs.existsSync(finalPath)) {
        fs.unlink(req.file.path, (err) => {})
        return res.status(400).json({Error: 'You already uploaded a song with that title'})
    }

    // get file extension (wav || mp3 || ogg)
    let ext = req.file.originalname.split('.').pop()
    
    // Create song object and save to database
    let tempSong = Song()
    tempSong.title = req.body.title             // sets req.body.title as title
    tempSong.artist = req.body.artist           // defaults to "No Artist" if user did not enter one
    tempSong.genre = req.body.genre             // defaults to "Other" if user did not enter one
    tempSong.audioPath = finalPath              // sets finalPath as audioPath
    tempSong.userId = req.user._id.toString()   // sets song uploader user id
    
    if (ext == 'wav') {
        tempSong.isWav = true
    } else {
        tempSong.isWav = false
    }

    // save song to database
    await tempSong.save((err) => {
        if (err) {
            return res.status(400).json(err.message)
        } else {

            /*
                Make file directory for song using finalPath
                once directory is created call convertSong()
            */
            fs.mkdir(finalPath, {recursive: true}, (err) => {
                if (err != null) {
                    return res.status(400).json({'message': err})
                } else {
                    return Promise.all([convertSong(req.file, ext, finalPath, req.body.title)])
                    .then(() => {
                        // return response with success message once conversion is complete
                        return res.status(200).json({'message': 'content uploaded and converted', 'songId': tempSong._id.toString()})
                    })
                }
            })
            
        }
    })  
}


/*
===============================================================================
    renames file
        renames file to newPath/format/bitrate/newTitle.format
===============================================================================
*/
function rename(newPath, oldTitle, newTitle, format, bitrate) {

    let oPath = path.join(newPath, format, bitrate, `${oldTitle}.${format}`)
    let nPath = path.join(newPath, format, bitrate, `${newTitle}.${format}`)

    fs.rename(oPath, nPath, (err) => {
        if (err != null) {
            console.log(err)
        }
    })

}


/*
===============================================================================
    Called when renaming files in subdirectory
        renames all mp3, ogg and wav files with newTitle
        checks if song contains wav
===============================================================================
*/
function renameFiles(isWav, newPath, oldTitle, newTitle) {

    if (isWav == true) {
        fs.rename(path.join(newPath, 'wav', `${oldTitle}.wav`), path.join(newPath, 'wav', `${newTitle}.wav`), (err) => {
            if (err != null) {
                console.log(err)
            }
        })
    }

        rename(newPath, oldTitle, newTitle, 'mp3', '320')
        rename(newPath, oldTitle, newTitle, 'mp3', '256')
        rename(newPath, oldTitle, newTitle, 'mp3', '128')
        rename(newPath, oldTitle, newTitle, 'ogg', '256')
        rename(newPath, oldTitle, newTitle, 'ogg', '128')
}


/*
===============================================================================
    Called when updating a song (gets songid from param)
        updates title, artists & genres
        updates subdirectories if title is changed and audioPath
        updates database info
===============================================================================
*/
const editSong = async (req, res) => {

    try {

        /*
            Finds song by req.params.id
            if req.params.id is not in the proper format for ObjectID (CASTERROR) return null
        */
        const songFind = await Song.findOne({_id: req.params.id})
        .catch((err) => {
            return null
        })

        console.log(songFind)

        // Checks if song was found
        if (!songFind) {
            return res.status(400).json({Error: 'Song with that ID does not exist'})
        }

        // Checks if user id in the song matches the user id from token
        if (req.user._id.toString() != songFind.userId) {

            return res.status(403).json({'message': 'Not Authorized, Wrong User'})
            
        } else {

            // Update Subdirectories if title is changed
            if (!req.body.title == false) {

                // if req.body.title exists and is the same as current title, do not change anything
                if (req.body.title == songFind.title) {

                } else {
                    let newPath = path.join(__dirname, '..', 'resources', 'audio', req.user._id.toString(), req.body.title)

                    if (fs.existsSync(newPath)) {
                        return res.status(400).json({Error: 'Cannot change to that title, you already uploaded a song with that title'})

                    } else {
                        let oldPath = songFind.audioPath
                        let oldTitle = songFind.title
                        let newTitle = req.body.title
                        songFind.audioPath = newPath
                        songFind.title = req.body.title

                        fs.rename(oldPath, newPath, (err) => {
                            if (err != null) {
                                console.log(err)
                            } else {

                                renameFiles(songFind.isWav, newPath, oldTitle, newTitle)
                            }
                        })
                    }
                }
            }
    
            if (!req.body.artist == false) {
                if (req.body.artist != songFind.artist) {
                    songFind.artist = req.body.artist
                }
            }
    
            if (!req.body.genre == false) {
                if (req.body.genre != songFind.genre) {
                    songFind.genre = req.body.genre
                }
            }
    
            await songFind.save()
    
            return res.status(200).json({'message': 'Song Updated'})

        }

    } catch (err) {
        return res.status(400).json(err)
    }

}


/*
===============================================================================
    Called when deleting a song (gets songid from param)
        finds song from DB using Song.findOne with req.params.id
        if found deletes all files in audioPath
        if found deletes from DB
===============================================================================
*/
const deleteSong = async (req, res) => {

    try {

        /*
            Finds song by req.params.id
            if req.params.id is not in the proper format for ObjectID (CASTERROR) return null
        */
        const songFind = await Song.findOne({_id: req.params.id})
        .catch((err) => {
            return null
        })

        // Checks if song was found
        if (!songFind) {
            return res.status(400).json({Error: 'Song with that ID does not exist'})
        }

        // Checks if user id in the song matches the user id from token
        if (req.user._id.toString() != songFind.userId) {

            return res.status(403).json({'message': 'Not Authorized, Wrong User'})
            
        } else {

            // removes files in audioPath and then deletes song from db
            fs.rm(songFind.audioPath, {recursive: true, force: true}, async (err) => {
                if (err != null && !err == false) {
                    console.log(err)
                    return res.status(400).json({'message': err})
                } else {
                    await Song.deleteOne({_id: req.params.id, userId: songFind.userId})
                    return res.status(200).json({'message': 'Deleted'})
                }
            })
        }

    } catch (err) {
        return res.status(400).json(err)
    }


}

// TO DO Check if query id, format and bitrate is in place
// (SPECIFY ONLY WAV / MP3 / OGG) (SPECIFY BITRATES ONLY 320 / 256 / 128)
/*
===============================================================================
    Called when to stream a song file
        gets song info by song ID
            if song does not exist send error response
        gets bitrate by query
            if bitrate is not supported send error (if wrong bitrate is given default to 128)
        gets format by query
            if format is not supported send error (if wrong format is given default to mp3)
===============================================================================
*/
const stream_audio = async (req, res) => {

    let songId = req.query.s.toString()

    // Checks if req.query.f (format) was given and check if it was a proper argument
    // Defaults if false
    let format = ''
    if (!req.query.f) {
    } else {
        if (req.query.f != 'mp3' && req.query.f != 'wav' && req.query.f != 'ogg') {
            format = 'mp3'
        } else {
            format = req.query.f.toString()
        }
    }

    // Checks if req.query.b (bitrate) was given and checks if it was a proper argument
    // Defaults if false
    let bitrate = ''
    if (!req.query.b) {
    } else {
        if (req.query.b != '320' && req.query.b != '256' && req.query.b != '128') {
            bitrate = '128'
        } else {
            bitrate = req.query.b.toString()
        }
    }

    const songFind = await Song.findOne({_id: songId})
    .catch(err => {
        return null
    }) 

    if (!songFind) {
        return res.status(400).json({Error: "Song with that ID does not exist"})
    }

    let songPath = ''

    let filename = `${songFind.title}.${format}`

    if (format == 'wav') {
        songPath = path.join(songFind.audioPath, format, filename)
    } else {
        songPath = path.join(songFind.audioPath, format, bitrate, filename)
    }

    console.log(songPath)

    if (fs.existsSync(songPath)) {

        const range = req.headers.range
        const songSize = fs.statSync(songPath).size

        const chunkSize = 1 * 1e+6      // 1MB
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
        
    } else {
        return res.status(400).json({Error: 'Song does not support that format'})
    }
}

// TO DO: RETURN SONG INFO FROM DATABASE
const getSong = async (req, res) => {
    const songFind = await Song.findOne({_id: req.body.id})
    return res.send(JSON.stringify(songFind))
}

module.exports = {
    getSong,
    stream_audio,
    addSong,
    editSong,
    deleteSong
}