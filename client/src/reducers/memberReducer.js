import {
    MEMBER_UPLOAD_CSV_REQUEST,
    MEMBER_UPLOAD_CSV_SUCCESS,
    MEMBER_UPLOAD_CSV_FAIL,
    MEMBER_EDIT_REQUEST,
    MEMBER_EDIT_SUCCESS,
    MEMBER_EDIT_FAIL,
    MEMBER_EDIT_CLEAR,
    MEMBER_ADD_RELATIVES_REQUEST,
    MEMBER_ADD_RELATIVES_SUCCESS,
    MEMBER_ADD_RELATIVES_FAIL,
    MEMBER_DELETE_RELATIVES_REQUEST,
    MEMBER_DELETE_RELATIVES_SUCCESS,
    MEMBER_DELETE_RELATIVES_FAIL,
    MEMBER_DELETE_RELATIVES_CLEAR,
    MEMBER_SEARCH_BY_NAME_REQUEST,
    MEMBER_SEARCH_BY_NAME_SUCCESS,
    MEMBER_SEARCH_BY_NAME_FAIL,
    MEMBER_ADD_RELATIVES_CLEAR,
    MEMBER_CREATE_REQUEST,
    MEMBER_CREATE_SUCCESS,
    MEMBER_CREATE_FAIL,
    MEMBER_CREATE_CLEAR,
    MEMBER_GENERATE_CSV_REQUEST,
    MEMBER_GENERATE_CSV_SUCCESS,
    MEMBER_GENERATE_CSV_FAIL,
    MEMBER_GENERATE_CSV_CLEAR,
    MEMBER_GENERATE_DATA_REQUEST,
    MEMBER_GENERATE_DATA_SUCCESS,
    MEMBER_GENERATE_DATA_FAIL,
    MEMBER_INFO_REQUEST,
    MEMBER_INFO_SUCCESS,
    MEMBER_INFO_FAIL,
    MEMBER_UPLOAD_AVATAR_REQUEST,
    MEMBER_UPLOAD_AVATAR_SUCCESS,
    MEMBER_UPLOAD_AVATAR_FAIL,
    MEMBER_ALL_REQUEST,
    MEMBER_ALL_SUCCESS,
    MEMBER_ALL_FAIL,
    CONVERT_TO_PNG_REQUEST,
    CONVERT_TO_PNG_SUCCESS,
    CONVERT_TO_PNG_FAIL,
    CONVERT_TO_PNG_CLEAR,
    CONVERT_TO_PDF_REQUEST,
    CONVERT_TO_PDF_SUCCESS,
    CONVERT_TO_PDF_FAIL,
    MEMBER_GENERATE_FAMILY_CSV_REQUEST,
    MEMBER_GENERATE_FAMILY_CSV_SUCCESS,
    MEMBER_GENERATE_FAMILY_CSV_FAIL,
    MEMBER_GENERATE_FAMILY_CSV_CLEAR
} from '../constants/memberConstant'


export const memberNewReducer = (state = {}, action) => {
    switch(action.type){
        case MEMBER_CREATE_REQUEST:
            return {loading:true, error:null}
        case MEMBER_CREATE_SUCCESS:
            return {loading:false, error:null, message:action.payload}
        case MEMBER_CREATE_FAIL:
            return {loading:false, error:action.payload}
        case MEMBER_CREATE_CLEAR:
            return {message:null, error:null}
        default:
            return state
    }
}

export const memberRelativesReducer = (state = {}, action) => {
    switch(action.type){
        case MEMBER_ADD_RELATIVES_REQUEST:
            return {loading:true, error:null}
        case MEMBER_ADD_RELATIVES_SUCCESS:
            return {loading:false, error:null, message:action.payload}
        case MEMBER_ADD_RELATIVES_FAIL:
            return {loading:false, error:action.payload}
        case MEMBER_ADD_RELATIVES_CLEAR:
            return {message:null, error:null}
        default:
            return state
    }
}

export const memberDeleteRelativesReducer = (state = {}, action) => {
    switch(action.type){
        case MEMBER_DELETE_RELATIVES_REQUEST:
            return {loading:true, error:null}
        case MEMBER_DELETE_RELATIVES_SUCCESS:
            return {loading:false, error:null, message:action.payload}
        case MEMBER_DELETE_RELATIVES_FAIL:
            return {loading:false, error:action.payload}
        case MEMBER_DELETE_RELATIVES_CLEAR:
            return {message:null, error:null}
        default:
            return state
    }
}

export const memberEditReducer = (state = {}, action) => {
    switch(action.type){
        case MEMBER_EDIT_REQUEST:
            return {loading:true, error:null}
        case MEMBER_EDIT_SUCCESS:
            return {loading:false, error:null, message:action.payload}
        case MEMBER_EDIT_FAIL:
            return {loading:false, error:action.payload}
        case MEMBER_EDIT_CLEAR:
            return {message:null, error:null}
        default:
            return state
    }
}



export const uploadCSVReducer = (state = {}, action) => {
    switch(action.type){
        case MEMBER_UPLOAD_CSV_REQUEST:
            return {loading:true, error:null}
        case MEMBER_UPLOAD_CSV_SUCCESS:
            return {loading:false, error:null, message:action.payload, isUploaded:true}
        case MEMBER_UPLOAD_CSV_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}

export const generateCSVReducer = (state = {}, action) => {
    switch(action.type){
        case MEMBER_GENERATE_CSV_REQUEST:
            return {loading:true, error:null}
        case MEMBER_GENERATE_CSV_SUCCESS:
            return {loading:false, error:null, csvData:action.payload}
        case MEMBER_GENERATE_CSV_FAIL:
            return {loading:false, error:action.payload}
        case MEMBER_GENERATE_CSV_CLEAR:
            return {error:null, csvData:null}
        default:
            return state
    }
}

export const generateDataReducer = (state = {}, action) => {
    switch(action.type){
        case MEMBER_GENERATE_DATA_REQUEST:
            return {loading:true, error:null}
        case MEMBER_GENERATE_DATA_SUCCESS:
            return {loading:false, error:null, familyData:action.payload}
        case MEMBER_GENERATE_DATA_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}

export const memberInfoReducer = (state = {}, action) => {
    switch(action.type){
        case MEMBER_INFO_REQUEST:
            return {loading:true, error:null}
        case MEMBER_INFO_SUCCESS:
            return {loading:false, error:null, info:action.payload}
        case MEMBER_INFO_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}

export const memberUploadAvatarReducer = (state = {}, action) => {
    switch(action.type){
        case MEMBER_UPLOAD_AVATAR_REQUEST:
            return {loading:true, error:null}
        case MEMBER_UPLOAD_AVATAR_SUCCESS:
            return {loading:false, error:null, message:action.payload}
        case MEMBER_UPLOAD_AVATAR_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}


export const allMembersReducer = (state ={},  action) => {
    switch(action.type) {
        case MEMBER_ALL_REQUEST:
            return {loading:true, error:null}
        case MEMBER_ALL_SUCCESS:
            return {loading:false, error:null, membersData:action.payload}
        case MEMBER_ALL_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}


export const convertToPNGReducer = (state = {}, action) => {
    switch(action.type) {
        case CONVERT_TO_PNG_REQUEST:
            return {loading:true, error:null}
        case CONVERT_TO_PNG_SUCCESS:
            return {loading:false, error:null, pngData:action.payload}
        case CONVERT_TO_PNG_FAIL:
            return {loading:false, error:action.payload}
        case CONVERT_TO_PNG_CLEAR:
            return {error:null, pngData:null}
        default:
            return state
    }
}

export const convertToPDFReducer = (state = {}, action) => {
    switch(action.type) {
        case CONVERT_TO_PDF_REQUEST:
            return {loading:true, error:null}
        case CONVERT_TO_PDF_SUCCESS:
            return {loading:false, error:null, pdfData:action.payload}
        case CONVERT_TO_PDF_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}

export const generateFamilyCSVReducer = (state = {}, action) => {
    switch(action.type){
        case MEMBER_GENERATE_FAMILY_CSV_REQUEST:
            return {loading:true, error:null}
        case MEMBER_GENERATE_FAMILY_CSV_SUCCESS:
            return {loading:false, error:null, familyCSV:action.payload}
        case MEMBER_GENERATE_FAMILY_CSV_FAIL:
            return {loading:false, error:action.payload}
        case MEMBER_GENERATE_FAMILY_CSV_CLEAR:
            return {error:null, familyCSV:null}
        default:
            return state
    }
}

export const memberSearchByNameReducer = (state = {}, action) => {
    switch(action.type){
        case MEMBER_SEARCH_BY_NAME_REQUEST:
            return {loading:true, error:null}
        case MEMBER_SEARCH_BY_NAME_SUCCESS:
            return {loading:false, error:null, members:action.payload}
        case MEMBER_SEARCH_BY_NAME_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}
