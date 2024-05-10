const InvalidParamException = require('../exceptions/invalid.param.exception');
const InvalidRequestException = require('../exceptions/invalid-request');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config')


// User Register
const register = (request, response, next) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userData = {
                userName: request.body.userName,
                password: request.body.password,
            }

            if ((userData.userName === "" || userData.password === "" || !userData.userName || !userData.password)) {
                throw new InvalidParamException('Enter username and password')
            }

            const UData = await db.Users.findOne({
                where: {
                    userName: request.body.userName,
                }
            });
            if (UData) {
                throw new InvalidRequestException('Username already exists')
            }

            //secure the paasword
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            //this Playload will be Insert in to Database
            const userPayload = {
                userName: request.body.userName,
                password: hashedPassword
            }
            const userDataPayload = await db.Users.create(userPayload)
            resolve(
                response.json({
                    success: true,
                    message: 'User Registered successfully',
                    result: userDataPayload
                })
            )
        } catch (error) {
            next(error)
        }
    })
}



//User login
const login = (request, response, next) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userData = {
                userName: request.body.userName,
                password: request.body.password,
            }

            if ((userData.userName === "" || userData.password === "" || !userData.userName || !userData.password)) {
                throw new InvalidParamException('Enter username and password')
            }

            const UData = await db.Users.findOne({
                where: {
                    userName: request.body.userName,
                }
            });
            if (!UData) {
                throw new InvalidRequestException('Invalid username or password')
            }

            //comparing the password
            const match = await bcrypt.compare(userData.password, UData.password);
            if (!match) {
                throw new InvalidRequestException('Invalid username or password')
            }

            const token = jwt.sign({ username: UData.userName }, config.jwtSecret, { expiresIn: '12h' });


            //this Playload will be Update the token and login time
            const userPayload = {
                accessToken: token,
                login: new Date()
            }
            const userDataPayload = await db.Users.update(userPayload, {
                where: {
                    userName: request.body.userName,
                }
            })
            resolve(
                response.json({
                    success: true,
                    message: 'User Login successfully ',
                    result: userPayload.accessToken
                })
            )
        } catch (error) {
            next(error)
        }
    })
}

//Dashboard
const dashBoard = (request, response, next) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = request.headers['authorization'];

            jwt.verify(token, config.jwtSecret, (err, decoded) => {
                if (err) {
                    return response.status(401).json({ message: 'Invalid token' });
                }
                request.user = decoded;

            });
            resolve(
                response.json({
                    success: true,
                    message: 'Welcome to the dashboard!',
                })
            )

        } catch (error) {
            next(error)
        }
    })
}

//logout
const logout = (request, response, next) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = request.headers['authorization'];

            jwt.verify(token, config.jwtSecret, (err, decoded) => {
                if (err) {
                    return response.status(401).json({ message: 'Invalid token' });
                }
                request.user = decoded;
            });

            const userDataPayload = await db.Users.update({ logout: new Date() }, {
                where: {
                    userName: request.user.username
                }
            })

            resolve(
                response.json({
                    success: true,
                    message: 'Logout successfully',
                })
            )

        } catch (error) {
            next(error)
        }
    })
}
module.exports = { register, login, dashBoard, logout }