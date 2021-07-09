import {
    POST_CREATE_REQUEST,
    POST_CREATE_SUCCESS,
    POST_CREATE_FAIL,
    POSTS_LIST_REQUEST,
    POSTS_LIST_SUCCESS,
    POSTS_LIST_FAIL,
    GET_POST_REQUEST,
    GET_POST_SUCCESS,
    GET_POST_FAIL,
    DELETE_POST_REQUEST,
    DELETE_POST_SUCCESS,
    DELETE_POST_FAIL
} from '../constants/blogConstant'

export const createPostReducer = (state = {}, action) => {
    switch(action.type) {
        case POST_CREATE_REQUEST:
            return {loading:true, error:null}
        case POST_CREATE_SUCCESS:
            return {loading:false, error:null, message:action.payload} 
        case POST_CREATE_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}

export const listPostsReducer = (state = {}, action) => {
    switch(action.type) {
        case POSTS_LIST_REQUEST:
            return {loading:true, error:null}
        case POSTS_LIST_SUCCESS:
            return {loading:false, error:null, posts:action.payload, count:action.count, page:action.page} 
        case POSTS_LIST_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}

export const deletePostReducer = (state = {}, action) => {
    switch(action.type) {
        case DELETE_POST_REQUEST:
            return {loading:true, error:null}
        case DELETE_POST_SUCCESS:
            return {loading:false, error:null, message:action.payload} 
        case DELETE_POST_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}

export const getPostReducer = (state = {}, action) => {
    switch(action.type) {
        case GET_POST_REQUEST:
            return {loading:true, error:null}
        case GET_POST_SUCCESS:
            return {loading:false, error:null, post:action.payload} 
        case GET_POST_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}