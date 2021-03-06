const httpStatus = require('http-status')
const jwt = require('jsonwebtoken')
const ApiError = require('../../utils/api-error')
const { User } = require('../models')
const { getAll, getOne, deleteOne, updateOne } = require('./shared/services')

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw ApiError(httpStatus.BAD_REQUEST, 'Email đã tồn tại')
    }
    return User.create(userBody)
}

const getUserById = async (id) => {
    return await User.findById(id).catch((err) => {
        throw ApiError(httpStatus.UNAUTHORIZED, 'Tài khoản không tồn tại')
    })
}

const getUserByToken = async (token) => {
    try {
        const { sub } = jwt.decode(token)
        return await User.findById(sub).catch((err) => {
            throw ApiError(httpStatus.UNAUTHORIZED, 'Tài khoản không tồn tại. ')
        })
    } catch {
        throw ApiError(httpStatus.UNAUTHORIZED, 'Token không đúng.')
    }
}

const getAllUser = async (filter = {}, query = {}, search) => {
    return await getAll(User, filter, query, search).catch((err) => {
        throw err
    })
}

const getOneUser = async (id) => {
    return await getOne(User, id).catch((err) => {
        throw err
    })
}

const deleteOneUser = async (id) => {
    return await deleteOne(User, id).catch((err) => {
        throw err
    })
}

const updateOneUser = async (id, data) => {
    return await updateOne(User, id, data).catch((err) => {
        throw err
    })
}

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    return User.findOne({ email })
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getUserByToken,
    getAllUser,
    deleteOneUser,
    updateOneUser,
    getOneUser,
}
