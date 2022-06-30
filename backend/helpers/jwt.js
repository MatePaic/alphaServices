const {expressjwt:expressJwt} = require('express-jwt'); 


const authJwt = () => {
    const secret = process.env.SECRET;
    const api = process.env.API_URL;

    return expressJwt({
        secret,
        algorithms: ['HS256']
    })
    .unless({
        path: [
            {url: /\/public\/(.*)/, methods: ['GET', 'OPTIONS'] },
            {url: /\/public\/orders(.*)/, methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/signup`,
            `${api}/users/reset-password-email`,
            `${api}/users/reset-password-set-password`
            //{ url: /(.*)/ }
        ]
    })
}

module.exports = authJwt;