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
    memberUploadAvatarReducer,
    memberNewReducer,
    allMembersReducer,
    exportSVGReducer,
    generateFamilyCSVReducer,
    memberRelativesReducer,
    memberSearchByNameReducer,
    memberDeleteRelativesReducer
} from './reducers/memberReducer'

import {
    createPostReducer,
    listPostsReducer,
    getPostReducer,
    deletePostReducer
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
    photoUpload:memberUploadAvatarReducer,
    exportSVG:exportSVGReducer,
    familyCSV:generateFamilyCSVReducer,
    memberEdit:memberEditReducer,
    newMember:memberNewReducer,
    memberRelatives:memberRelativesReducer,
    memberSearch: memberSearchByNameReducer,
    relativeDelete:memberDeleteRelativesReducer,

    // Blog Reducers
    newPost:createPostReducer,
    news:listPostsReducer,
    post:getPostReducer,
    removePost:deletePostReducer

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