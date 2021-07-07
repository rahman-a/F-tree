import {
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_REMOVE_REQUEST,
    USER_REMOVE_SUCCESS,
    USER_REMOVE_FAIL,
    USER_ACTIVATE_REQUEST,
    USER_ACTIVATE_SUCCESS,
    USER_ACTIVATE_FAIL,
    USER_PROMOTE_REQUEST,
    USER_PROMOTE_SUCCESS,
    USER_PROMOTE_FAIL,
    USER_ALL_REQUEST,
    USER_ALL_SUCCESS,
    USER_ALL_FAIL,
    USER_RESET_PASS_LINK_REQUEST,
    USER_RESET_PASS_LINK_SUCCESS,
    USER_RESET_PASS_LINK_FAIL,
    USER_RESET_PASSWORD_REQUEST,
    USER_RESET_PASSWORD_SUCCESS,
    USER_RESET_PASSWORD_FAIL,
} from '../constants/userConstant'
import userService from '../services/usersServices'

export const userRegister = (credential) => async (dispatch) => {
    dispatch({type:USER_REGISTER_REQUEST})
    try {
        await userService.register(credential)
        dispatch({type:USER_REGISTER_SUCCESS})
    } catch (error) {
        console.log(error.response);
        dispatch({
            type:USER_REGISTER_FAIL,
            payload:error.response.data.error
        })
    }
}

export const userLogin = (credential) => async (dispatch) => {
    dispatch({type:USER_LOGIN_REQUEST})
    try {
        const {data} = await userService.login(credential)
        dispatch({type:USER_LOGIN_SUCCESS, payload:data})
        localStorage.setItem('user', JSON.stringify(data))
    } catch (error) {
        console.log(error.response);
        dispatch({
            type:USER_LOGIN_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}

export const userLogout = () => async (dispatch) => {
    try {
        await userService.logout()
        dispatch({type:USER_LOGOUT, payload:null})
        localStorage.removeItem('user')
    } catch (error) {
        console.log(error.response);
        dispatch({
            type:USER_LOGOUT, 
            payload:error.response && error.response.data.error
        })
    }
}

export const userUpdate = (info) => async (dispatch) => {
    dispatch({type:USER_UPDATE_REQUEST})
    try {
        const {data} = await userService.update(info)
        dispatch({type:USER_UPDATE_SUCCESS})
        dispatch({type:USER_LOGIN_SUCCESS, payload:data})
        localStorage.setItem('user', JSON.stringify(data))
    } catch (error) {
        console.log(error.response);
        dispatch({
            type:USER_UPDATE_FAIL, 
            payload:error.response && error.response.data.error
        })
    }
}


export const userRemove = (id) => async (dispatch) => {
    dispatch({type:USER_REMOVE_REQUEST})
    try {
        if(id) {
            await userService.removeById(id)
            dispatch({type:USER_REMOVE_SUCCESS})
        }else {
            await userService.remove()
            dispatch({type:USER_LOGOUT, payload:null})
            localStorage.removeItem('user')
            dispatch({type:USER_REMOVE_SUCCESS})
        }
    } catch (error) {
        console.log(error.response);
        dispatch({
            type:USER_REMOVE_FAIL, 
            payload:error.response && error.response.data.error
        })
    }
}

export const userGetAll = (sort) => async (dispatch) => {
    dispatch({type:USER_ALL_REQUEST})
    try {
        const {data} = await userService.index(sort)
        dispatch({type:USER_ALL_SUCCESS, payload:data})
    } catch (error) {
        console.log(error.response);
        dispatch({
            type:USER_ALL_FAIL, 
            payload:error.response && error.response.data.error
        })
    }
}

export const userActivate = (id) => async (dispatch) => {
    dispatch({type:USER_ACTIVATE_REQUEST})
    try {
        await userService.activate(id)
        dispatch({type:USER_ACTIVATE_SUCCESS})
    } catch (error) {
        console.log(error.response);
        dispatch({
            type:USER_ACTIVATE_FAIL, 
            payload:error.response && error.response.data.error
        })
    }
}

export const userPromote = (id) => async (dispatch) => {
    dispatch({type:USER_PROMOTE_REQUEST})
    try {
        await userService.promote(id)
        dispatch({type:USER_PROMOTE_SUCCESS})
    } catch (error) {
        console.log(error.response);
        dispatch({
            type:USER_PROMOTE_FAIL, 
            payload:error.response && error.response.data.error
        })
    }
}


export const userResetPassLnk = (email) => async (dispatch) => {
    dispatch({type:USER_RESET_PASS_LINK_REQUEST})
    try {
        const {data} = await userService.resetPassLink(email)
        dispatch({type:USER_RESET_PASS_LINK_SUCCESS, payload:data.message})
    } catch (error) {
        console.log(error.response);
        dispatch({
            type:USER_RESET_PASS_LINK_FAIL, 
            payload:error.response && error.response.data.error
        })
    }
}

export const userResetPassword = (credential) => async (dispatch) => {
    dispatch({type:USER_RESET_PASSWORD_REQUEST})
    try {
        const {data} = await userService.resetPassword(credential)
        dispatch({type:USER_RESET_PASSWORD_SUCCESS, payload:data.message})
    } catch (error) {
        console.log(error.response);
        dispatch({
            type:USER_RESET_PASSWORD_FAIL, 
            payload:error.response && error.response.data.error
        })
    }
}