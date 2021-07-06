import {Button} from 'react-bootstrap'
import {useSelector, useDispatch} from 'react-redux'
import { useLocation } from 'react-router'
import {userActivate, userPromote, userRemove} from '../actions/userActions'
import {USER_REMOVE_UNSET} from '../constants/userConstant'
import Loader from '../components/Loader'
import Popup from '../components/PopupMessage'

const UserInfo = ({info, ind}) => {
    const {user:{data}} = useSelector(state => state.login)
    const {loading, error} = useSelector(state => state.activate)
    const {loading:loading_p, error:error_p} = useSelector(state => state.promote)
    const {success, error:error_r} = useSelector(state => state.remove)
    const dispatch = useDispatch()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    if(query.get('page')) { 
        ind += (query.get('page') - 1)* 10
    }
    const userActiveHandler = _ => {
        dispatch(userActivate(info._id))
    }

    const userCoAdminHandler = _ => {
       dispatch(userPromote(info._id))
    }
    const removeUserHandler = _ => {
        const isConfirm = window.confirm('هل أنت متاكد من حذف المستخدم')
        if(isConfirm){
            dispatch(userRemove(info._id))
        }
    }
    return (
        <>
        {loading || loading_p
        ? <Loader/>
        : (error || error_p) && <Popup danger><p>{error || error_p}</p></Popup>}
        {success ? <Popup success passHandler={() => dispatch({type:USER_REMOVE_UNSET})}><p>تم حذف المستخدم بنجاح</p></Popup>
        :error_r && <Popup danger passHandler={() => dispatch({type:USER_REMOVE_UNSET})}><p>{error_r}</p></Popup>}
        {!info.isAdmin&&<tr>
            <td>{ind}</td>
            <td> <span>{`${info.firstName} ${info.lastName}`}</span></td>
            <td> <a href={`mailto:${info.email}`}>{info.email}</a></td>
            <td><a href={`tel:${info.phone}`}>{info.phone}</a></td>
            {data.isAdmin && <td>
                {info.isCoAdmin
                ? <i title='اضغط لإلغاء تعيين مساعد المدير'  
                style={{color:'#13967d', cursor:'pointer'}} 
                onClick={() => userCoAdminHandler('coAdmin')}
                className="fas fa-hands-helping"></i> 
                
                : <i title='اضغط لتعيين مساعد مدير' 
                style={{color:'#e74c3c', cursor:'pointer'}} 
                onClick={() => userCoAdminHandler('')} 
                className="fas fa-handshake-alt-slash"></i>
                }
            </td>}
            <td>
                {info.isActive 
                ? <i 
                title='اضغط لإلغاء تفعيل الحساب'  
                style={{color:'#13967d', cursor:'pointer'}} 
                onClick={() => userActiveHandler()}
                className="fas fa-user-check"></i> 
                : <i 
                title='اضغط لتفعيل الحساب' 
                style={{color:'#e74c3c', cursor:'pointer'}} 
                onClick={() => userActiveHandler()} 
                className="fas fa-user-lock"></i>}
            </td>
            <td>   
                <Button variant='danger' onClick={removeUserHandler}><i className="fas fa-trash"></i></Button>    
            </td>
        </tr>}</>
    )
}

export default UserInfo
