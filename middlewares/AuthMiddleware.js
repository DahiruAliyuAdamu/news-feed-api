const { verify } = require('jsonwebtoken')

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken")

    if (!accessToken) return res.status(401).json({error: 'Access token missing'})

    try {
        const validToken = verify(accessToken, "importantsecret")
        req.user = validToken

        next()

    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' })
    }
}

module.exports = { validateToken }