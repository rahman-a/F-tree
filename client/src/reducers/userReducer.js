import {
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_REGISTER_UNSET,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_UNSET,
    USER_LOGOUT,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_UPDATE_UNSET,
    USER_REMOVE_REQUEST,
    USER_REMOVE_SUCCESS,
    USER_REMOVE_FAIL,
    USER_REMOVE_UNSET,
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
    USER_RESET_PASSWORD_FAIL
} from '../constants/userConstant'

export const registerReducer = (state = {}, action) => {
    switch(action.type) {
        case USER_REGISTER_REQUEST:
            return {loading:true, error:null}
        case USER_REGISTER_SUCCESS:
            return {loading:false, error:null, success:true}
        case USER_REGISTER_FAIL:
            return {loading:false, error:action.payload}
        case USER_REGISTER_UNSET:
            return {success:null, error:null}
        default:
            return state
    }
}

export const loginReducer = (state = {}, action) => {
    switch(action.type) {
        case USER_LOGIN_REQUEST:
            return {loading:true, error:null}
        case USER_LOGIN_SUCCESS:
            return {loading:false, error:null, user:action.payload}
        case USER_LOGIN_FAIL:
            return {loading:false, error:action.payload}
        case USER_LOGIN_UNSET:
            return {...state, error:null}
        case USER_LOGOUT:
            return {error:action.payload}
        default:
            return state
    }
}

export const updateReducer = (state ={},  action) => {
    switch(action.type) {
        case USER_UPDATE_REQUEST:
            return {loading:true, error:null}
        case USER_UPDATE_SUCCESS:
            return {loading:false, error:null, success:true}
        case USER_UPDATE_FAIL:
            return {loading:false, error:action.payload}
        case USER_UPDATE_UNSET:
            return {error:null, success:null}
        default:
            return state
    }
}

export const removeReducer = (state ={},  action) => {
    switch(action.type) {
        case USER_REMOVE_REQUEST:
            return {loading:true, error:null}
        case USER_REMOVE_SUCCESS:
            return {loading:false, error:null, success:true}
        case USER_REMOVE_FAIL:
            return {loading:false, error:action.payload}
        case USER_REMOVE_UNSET:
            return {success:null, error:null}
        default:
            return state
    }
}

export const activateReducer = (state ={},  action) => {
    switch(action.type) {
        case USER_ACTIVATE_REQUEST:
            return {loading:true, error:null}
        case USER_ACTIVATE_SUCCESS:
            return {loading:false, error:null, success:true}
        case USER_ACTIVATE_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}

export const promoteReducer = (state ={},  action) => {
    switch(action.type) {
        case USER_PROMOTE_REQUEST:
            return {loading:true, error:null}
        case USER_PROMOTE_SUCCESS:
            return {loading:false, error:null, success:true}
        case USER_PROMOTE_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}

export const allUsersReducer = (state ={},  action) => {
    switch(action.type) {
        case USER_ALL_REQUEST:
            return {loading:true, error:null}
        case USER_ALL_SUCCESS:
            return {loading:false, error:null, usersData:action.payload}
        case USER_ALL_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}


export const resetPassLinkReducer = (state ={},  action) => {
    switch(action.type) {
        case USER_RESET_PASS_LINK_REQUEST:
            return {loading:true, error:null}
        case USER_RESET_PASS_LINK_SUCCESS:
            return {loading:false, error:null, message:action.payload}
        case USER_RESET_PASS_LINK_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}

export const resetPasswordReducer = (state ={},  action) => {
    switch(action.type) {
        case USER_RESET_PASSWORD_REQUEST:
            return {loading:true, error:null}
        case USER_RESET_PASSWORD_SUCCESS:
            return {loading:false, error:null, message:action.payload}
        case USER_RESET_PASSWORD_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}