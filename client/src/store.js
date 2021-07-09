import {createStore, combineReducers,applyMiddleware} from 'redux'
import Thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {
    registerReducer, 
    loginReducer,
    updateReducer,
    removeReducer,
    activateReducer,
    allUsersReducer,
    promoteReducer,
    resetPassLinkReducer,
    resetPasswordReducer,
} from './reducers/userReducer'

import {
    uploadCSVReducer,
    generateCSVReducer,
    generateDataReducer,
    memberInfoReducer,
    memberEditReducer,
    memberAvatarReducer,
    memberUploadAvatarReducer,
    memberNewReducer,
    allMembersReducer,
    convertToPNGReducer,
    convertToPDFReducer,
    generateFamilyCSVReducer
} from './reducers/memberReducer'

import {
    createPostReducer,
    listPostsReducer,
    getPostReducer
} from './reducers/blogReduces'
const reducers = combineReducers({
    // Users Reducer
    users:allUsersReducer,
    registration:registerReducer,
    login:loginReducer,
    update:updateReducer,
    remove:removeReducer,
    activate:activateReducer,
    promote:promoteReducer,
    resetPassLink:resetPassLinkReducer,
    resetPassword:resetPasswordReducer,
    
    // Members Reducers
    members:allMembersReducer,
    csvReducer:uploadCSVReducer,
    generateCSV:generateCSVReducer,
    familyData: generateDataReducer,
    profile:memberInfoReducer,
    avatar:memberAvatarReducer,
    photoUpload:memberUploadAvatarReducer,
    PNGTree: convertToPNGReducer,
    PDFTree:convertToPDFReducer,
    familyCSV:generateFamilyCSVReducer,
    memberEdit:memberEditReducer,
    newMember:memberNewReducer,

    // Blog Reducers
    newPost:createPostReducer,
    news:listPostsReducer,
    post:getPostReducer

})


const middleware = [Thunk] 

const userInLocalStorage = localStorage.getItem('user')
? JSON.parse(localStorage.getItem('user')) : null

const CSVUploadedLocalStorage = localStorage.getItem('CSVUploaded')
?JSON.parse(localStorage.getItem('CSVUploaded')) : false

const initSate = {
    login:{user:userInLocalStorage},
    csvReducer:{isUploaded:CSVUploadedLocalStorage}
}

const store = createStore(
    reducers,
    initSate,
    composeWithDevTools(applyMiddleware(...middleware))
)


export default store