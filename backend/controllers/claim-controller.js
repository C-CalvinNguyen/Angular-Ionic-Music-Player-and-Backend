const Claim = require('../models/claim.js')

const addClaim = async (req, res) => {

    try {

        if (!req.body.name || !req.body.description) {
            return res.status(400).json({"Error": "Claim Name and Description are required."})
        }
    
        let tempClaim = new Claim({
            name: req.body.name,
            description: req.body.description
        })
    
        await tempClaim.save((err) => {
            if (err) {
                return res.status(400).json({"Error": err})
            } else {
                return res.status(200).json({"Message": 'Claim Added', tempClaim})
            }
        })

    } catch (err) {
        return res.status(400).json({'Error': err})
    }
}

module.exports = {
    addClaim
}