import {
    MEMBER_UPLOAD_CSV_REQUEST,
    MEMBER_UPLOAD_CSV_SUCCESS,
    MEMBER_UPLOAD_CSV_FAIL,
    MEMBER_GENERATE_CSV_REQUEST,
    MEMBER_GENERATE_CSV_SUCCESS,
    MEMBER_GENERATE_CSV_FAIL,
    MEMBER_GENERATE_DATA_REQUEST,
    MEMBER_GENERATE_DATA_SUCCESS,
    MEMBER_GENERATE_DATA_FAIL,
    MEMBER_INFO_REQUEST,
    MEMBER_INFO_SUCCESS,
    MEMBER_INFO_FAIL,
    MEMBER_UPLOAD_AVATAR_REQUEST,
    MEMBER_UPLOAD_AVATAR_SUCCESS,
    MEMBER_UPLOAD_AVATAR_FAIL,
    MEMBER_AVATAR_REQUEST,
    MEMBER_AVATAR_SUCCESS,
    MEMBER_AVATAR_FAIL,
    MEMBER_ALL_REQUEST,
    MEMBER_ALL_SUCCESS,
    MEMBER_ALL_FAIL,
    CONVERT_TO_PNG_REQUEST,
    CONVERT_TO_PNG_SUCCESS,
    CONVERT_TO_PNG_FAIL,
    CONVERT_TO_PDF_REQUEST,
    CONVERT_TO_PDF_SUCCESS,
    CONVERT_TO_PDF_FAIL,
} from '../constants/memberConstant'

import memberServices from '../services/membersServices'

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
    dispatch({type:MEMBER_GENERATE_CSV_REQUEST})
    try {
        const {data} = await memberServices.generateCSV(count)
        dispatch({type:MEMBER_GENERATE_CSV_SUCCESS, payload:data})
    } catch (error) {
        dispatch({
            type:MEMBER_GENERATE_CSV_FAIL,
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


export const getMemberAvatar = (id) => async(dispatch) => {
    dispatch({type:MEMBER_AVATAR_REQUEST})
    try {
        const {data} = await memberServices.getAvatar(id)
        dispatch({type:MEMBER_AVATAR_SUCCESS, payload:data.avatar})
    } catch (error) {
        dispatch({
            type:MEMBER_AVATAR_FAIL,
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

export const convertToPNG = (svg) => async(dispatch) => {
    dispatch({type:CONVERT_TO_PNG_REQUEST})
    try {
        const {data} = await memberServices.convertToPNG(svg)
        dispatch({type:CONVERT_TO_PNG_SUCCESS, payload:data.png})
    } catch (error) {
        console.log(error.response);
        dispatch({
            type:CONVERT_TO_PNG_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}


export const convertToPDF = (svg) => async(dispatch) => {
    dispatch({type:CONVERT_TO_PDF_REQUEST})
    try {
        await memberServices.convertToPDF(svg)
        const {data} = await memberServices.generatePDF()
        console.log(data);
        dispatch({type:CONVERT_TO_PDF_SUCCESS, payload:data.pdf})
    } catch (error) {
        console.log(error.response);
        dispatch({
            type:CONVERT_TO_PDF_FAIL,
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
        console.log(error.response);
        dispatch({
            type:MEMBER_GENERATE_CSV_FAIL,
            payload: error.response && error.response.data.error
        })
    }
}