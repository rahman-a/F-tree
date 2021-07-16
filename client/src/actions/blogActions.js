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
import blogServices from '../services/blogsServices'


export const createPost = (post) => async(dispatch) => {
    dispatch({type:POST_CREATE_REQUEST})
    try {
        const {data} = await blogServices.create(post)
        dispatch({type:POST_CREATE_SUCCESS, payload:data.message})
    } catch (error) {
        dispatch({
            type:POST_CREATE_FAIL,
            payload:error.response && error.response.data.error
        })
    }
}

export const listAllPosts = (sort) => async(dispatch) => {
    dispatch({type:POSTS_LIST_REQUEST})
    try {
        const {data} = await blogServices.index(sort)
        dispatch({type:POSTS_LIST_SUCCESS, payload:data.posts, count:data.postsCounts, page:data.page})
    } catch (error) {
        dispatch({
            type:POSTS_LIST_FAIL,
            payload:error.response && error.response.data.error
        })
    }
}

export const getOnePost = (id) => async(dispatch) => {
    dispatch({type:GET_POST_REQUEST})
    try {
        const {data} = await blogServices.post(id)
        dispatch({type:GET_POST_SUCCESS, payload:data.post})
    } catch (error) {
        dispatch({
            type:GET_POST_FAIL,
            payload:error.response && error.response.data.error
        })
    }
}

export const deletePost = (id) => async(dispatch) => {
    dispatch({type:DELETE_POST_REQUEST})
    try {
        const {data} = await blogServices.delete(id)
        dispatch({type:DELETE_POST_SUCCESS, payload:data.message})
    } catch (error) {
        dispatch({
            type:DELETE_POST_FAIL,
            payload:error.response && error.response.data.error
        })
    }
}