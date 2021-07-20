import {
    MEMBER_UPLOAD_CSV_REQUEST,
    MEMBER_UPLOAD_CSV_SUCCESS,
    MEMBER_UPLOAD_CSV_FAIL,
    MEMBER_EDIT_REQUEST,
    MEMBER_EDIT_SUCCESS,
    MEMBER_EDIT_FAIL,
    MEMBER_CREATE_REQUEST,
    MEMBER_CREATE_SUCCESS,
    MEMBER_CREATE_FAIL,
    MEMBER_SEARCH_BY_NAME_REQUEST,
    MEMBER_SEARCH_BY_NAME_SUCCESS,
    MEMBER_SEARCH_BY_NAME_FAIL,
    MEMBER_ADD_RELATIVES_REQUEST,
    MEMBER_ADD_RELATIVES_SUCCESS,
    MEMBER_ADD_RELATIVES_FAIL,
    MEMBER_DELETE_RELATIVES_REQUEST,
    MEMBER_DELETE_RELATIVES_SUCCESS,
    MEMBER_DELETE_RELATIVES_FAIL,
    MEMBER_GENERATE_CSV_REQUEST,
    MEMBER_GENERATE_CSV_SUCCESS,
    MEMBER_GENERATE_CSV_FAIL,
    MEMBER_GENERATE_DATA_REQUEST,
    MEMBER_GENERATE_DATA_SUCCESS,
    MEMBER_GENERATE_DATA_FAIL,
    MEMBER_GENERATE_FAMILY_CSV_REQUEST,
    MEMBER_GENERATE_FAMILY_CSV_SUCCESS,
    MEMBER_GENERATE_FAMILY_CSV_FAIL,
    MEMBER_INFO_REQUEST,
    MEMBER_INFO_SUCCESS,
    MEMBER_INFO_FAIL,
    MEMBER_UPLOAD_AVATAR_REQUEST,
    MEMBER_UPLOAD_AVATAR_SUCCESS,
    MEMBER_UPLOAD_AVATAR_FAIL,
    MEMBER_ALL_REQUEST,
    MEMBER_ALL_SUCCESS,
    MEMBER_ALL_FAIL,
    EXPORT_SVG_REQUEST,
    EXPORT_SVG_SUCCESS,
    EXPORT_SVG_FAIL
} from '../constants/memberConstant'

import memberServices from '../services/membersServices'

export const createNewMember = (info) => async(dispatch) => {
    dispatch({type:MEMBER_CREATE_REQUEST})
    try {
        const {data} = await memberServices.create(info)
        dispatch({type:MEMBER_CREATE_SUCCESS, payload:data.message})
    } catch (error) {
        dispatch({
            type:MEMBER_CREATE_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}

export const addRelativesMember = (info) => async(dispatch) => {
    dispatch({type:MEMBER_ADD_RELATIVES_REQUEST})
    try {
        const {data} = await memberServices.addRelatives(info)
        dispatch({type:MEMBER_ADD_RELATIVES_SUCCESS, payload:data.message})
    } catch (error) {
        dispatch({
            type:MEMBER_ADD_RELATIVES_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}

export const deleteRelativesMember = (info) => async(dispatch) => {
    dispatch({type:MEMBER_DELETE_RELATIVES_REQUEST})
    try {
        const {data} = await memberServices.deleteRelatives(info)
        dispatch({type:MEMBER_DELETE_RELATIVES_SUCCESS, payload:data.message})
    } catch (error) {
        dispatch({
            type:MEMBER_DELETE_RELATIVES_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}

export const getMemberInfo = (id) => async(dispatch) => {
    dispatch({type:MEMBER_INFO_REQUEST})
    try {
        const {data:{info}} = await memberServices.info(id)
        dispatch({type:MEMBER_INFO_SUCCESS, payload:info})
    } catch (error) {
        dispatch({
            type:MEMBER_INFO_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}

export const memberEdit = (info) => async(dispatch) => {
    dispatch({type:MEMBER_EDIT_REQUEST})
    try {
        const {data} = await memberServices.edit(info)
        dispatch({type:MEMBER_EDIT_SUCCESS, payload:data.message})
    } catch (error) {
        dispatch({
            type:MEMBER_EDIT_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}


export const userUploadCSV = (csv) => async(dispatch) => {
    dispatch({type:MEMBER_UPLOAD_CSV_REQUEST})
    try {
        const {data} = await memberServices.uploadCSV(csv)
        dispatch({type:MEMBER_UPLOAD_CSV_SUCCESS, payload:data.message})
    } catch (error) {
        dispatch({
            type:MEMBER_UPLOAD_CSV_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}

export const userGenerateCSV = (count) => async(dispatch) => {
    dispatch({type:MEMBER_GENERATE_FAMILY_CSV_REQUEST})
    try {
        const {data} = await memberServices.generateCSV(count)
        dispatch({type:MEMBER_GENERATE_FAMILY_CSV_SUCCESS, payload:data})
    } catch (error) {
        dispatch({
            type:MEMBER_GENERATE_FAMILY_CSV_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}

export const userGenerateData = () => async(dispatch) => {
    dispatch({type:MEMBER_GENERATE_DATA_REQUEST})
    try {
        const {data} = await memberServices.importTreeData()
        dispatch({type:MEMBER_GENERATE_DATA_SUCCESS, payload:data.familyData})
    } catch (error) {
        dispatch({
            type:MEMBER_GENERATE_DATA_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}


export const uploadMemberAvatar = (id) => async(dispatch) => {
    dispatch({type:MEMBER_UPLOAD_AVATAR_REQUEST})
    try {
        const {data} = await memberServices.uploadImg(id)
        dispatch({type:MEMBER_UPLOAD_AVATAR_SUCCESS, payload:data.message})
    } catch (error) {
        dispatch({
            type:MEMBER_UPLOAD_AVATAR_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}


export const memberGetAll = (sort) => async (dispatch) => {
    dispatch({type:MEMBER_ALL_REQUEST})
    try {
        const {data} = await memberServices.index(sort)
        dispatch({type:MEMBER_ALL_SUCCESS, payload:data})
    } catch (error) {
        dispatch({
            type:MEMBER_ALL_FAIL, 
            payload:error.response && error.response.data.error
        })
    }
}

export const exportSVG = (svgData) => async(dispatch) => {
    dispatch({type:EXPORT_SVG_REQUEST})
    try {
        const {data} = await memberServices.exportSVG(svgData)
        dispatch({type:EXPORT_SVG_SUCCESS, payload:data.file})
    } catch (error) {
        dispatch({
            type:EXPORT_SVG_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}


export const userGenerateFamilyCSV = () => async(dispatch) => {
    dispatch({type:MEMBER_GENERATE_CSV_REQUEST})
    try {
        const {data} = await memberServices.getCSVData()
        dispatch({type:MEMBER_GENERATE_CSV_SUCCESS, payload:data})
    } catch (error) {
        dispatch({
            type:MEMBER_GENERATE_CSV_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}

export const getMembersBySearch = (name) => async(dispatch) => {
    dispatch({type:MEMBER_SEARCH_BY_NAME_REQUEST})
    try {
        const {data} = await memberServices.searchByName(name)
        dispatch({type:MEMBER_SEARCH_BY_NAME_SUCCESS, payload:data.members})
    } catch (error) {
        dispatch({
            type:MEMBER_SEARCH_BY_NAME_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}