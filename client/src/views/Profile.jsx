import {useState, useEffect} from 'react'
import {Form, Button} from 'react-bootstrap'
import Template from "../components/Template"
import {useSelector, useDispatch} from 'react-redux'
import {userUpdate, userRemove} from '../actions/userActions'
import {USER_UPDATE_UNSET} from '../constants/userConstant'
import Popup from '../components/PopupMessage'
import Loader from '../components/Loader'
import { useHistory } from 'react-router-dom'

const Profile = () => {
    const {user:{data}} = useSelector(state => state.login)
    const {loading, error, success} = useSelector(state => state.update)
    const {loading:loading_r, error:error_r, success:success_r} = useSelector(state => state.remove)
    const history = useHistory()
    const [editPass, setEditPass] = useState(false)
    const dispatch = useDispatch()
    const [isNotMatch, setIsNotMatch] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const editHandler = e => {
        e.preventDefault()
        if(password !== confirmPassword) return setIsNotMatch(true)
        const data = {firstName, lastName, email, phone}
        if(password) data.password = password
        dispatch(userUpdate(data))
    }

    const removeUserHandler = e => {
        e.preventDefault()
        const isConfirm = window.confirm('هل أنت متاكد من حذف الحساب')
        if(isConfirm){
          dispatch(userRemove())
        }
    }
    
    useEffect(() => {
       if(data) {
          setFirstName(data.firstName)
          setLastName(data.lastName)
          setEmail(data.email)
          setPhone(data.phone)
       }
       success_r && history.push('/')
    },[data, history, success_r])
    return (
        <Template>
            {isNotMatch && <Popup danger passHandler={() => setIsNotMatch(false)}><p>كلمة المرور غير مطابقة من فضلك حاول مرة أخرى</p></Popup>}
            {error && <Popup danger passHandler={() => dispatch({type:USER_UPDATE_UNSET})}><p>{error}</p></Popup>}
            {error_r && <Popup danger><p>{error_r}</p></Popup>}
            {success && <Popup success passHandler={() => dispatch({type:USER_UPDATE_UNSET})}><p>تم تعديل البيانات بنجاح</p></Popup>}
            {loading_r && <Popup danger><p>...جارى حذف الحساب</p></Popup>}
            {loading 
            ? <Popup><Loader/></Popup>
            :<div className='profile'>
            <Form onSubmit={(e) => editHandler(e)}>
                <Form.Group controlId="formBasicFirstName">
                    <Form.Label> الإسم الأول</Form.Label>
                    <Form.Control 
                    type="text" 
                    defaultValue={firstName} 
                    required
                    onChange={({target:{value}}) => setFirstName(value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicLastName">
                    <Form.Label>الإسم الأخير</Form.Label>
                    <Form.Control 
                    type="text" 
                    defaultValue={lastName} 
                    required
                    onChange={({target:{value}}) => setLastName(value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>البريد الإلكترونى</Form.Label>
                    <Form.Control 
                    type="email" 
                    defaultValue={email} 
                    required
                    onChange={({target:{value}}) =>setEmail(value) }/>
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Label>الجوال</Form.Label>
                    <Form.Control 
                    type="tel" 
                    defaultValue={phone} 
                    required
                    onChange={({target:{value}}) => setPhone(value) }/>
                </Form.Group>

                {editPass && <>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>كلمة المرور</Form.Label>
                        <Form.Control 
                        type="password" 
                        placeholder="كلمة المرور" 
                        required
                        onChange={({target:{value}}) => setPassword(value)}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPasswordConfirm">
                        <Form.Label>تأكيد كلمة المرور</Form.Label>
                        <Form.Control 
                        type="password" 
                        placeholder="تأكيد كلمة المرور" 
                        required
                        onChange={({target:{value}}) => setConfirmPassword(value)}/>
                    </Form.Group>
                </>}
                <Button variant="primary" type="submit">
                حفظ
                </Button>
                <div style={{display:'flex', alignItems:'center'}}>
                    <Form.Text className="text-muted">
                    {editPass ?'لاخفاء' : 'لتغيير'} كلمة المرور<button onClick={(e) => {
                        e.preventDefault()
                        setEditPass(!editPass)
                        }}>اضغط هنا</button>
                    </Form.Text>
                    <Form.Text className="text-muted" style={{marginRight:'1rem'}}>
                لحذف الحساب <button onClick={removeUserHandler}>اضغط هنا</button>
                    </Form.Text>
                </div>
            </Form>           
            </div>}
        </Template>
    )
}

export default Profile
