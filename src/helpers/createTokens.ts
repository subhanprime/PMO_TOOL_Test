const jwt = require('jsonwebtoken')

const createTokens = (data: any) => {

    const accessToken = jwt.sign(
        { userInfo: data },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15s" }
    );

    const refreshToken = jwt.sign(
        { userInfo: data },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    return { accessToken, refreshToken }
}


export default createTokens; 