import {useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import Popup from '../components/PopupMessage'
import Loader from '../components/Loader'
import {userRegister} from '../actions/userActions'
import {USER_REGISTER_UNSET} from '../constants/userConstant'
import {useDispatch, useSelector} from 'react-redux'

const RegisterForm = ({IsMemberHandler}) => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [passwordNotMatch, setPasswordNotMatch] = useState(false)
    const dispatch = useDispatch()
    const registration = useSelector(state => state.registration)
    const {loading, error, success} =registration

    const registerHandler = e => {
        e.preventDefault()
        const data = {
            firstName:firstName,
            lastName:lastName,
            email:email,
            phone:phone,
            password:password
        }
        if(password === passwordConfirm) {
            dispatch(userRegister(data))
        }else {
            setPasswordNotMatch(true)
        }
    }

    return (
        <>
        {passwordNotMatch && <Popup danger passHandler={() => setPasswordNotMatch(false)}>
                <p>كلمة المرور غير مطابقة من فضلك حاول مرة اخرى</p>
            </Popup>}
        {success && <Popup success time={10000} passHandler={() => dispatch({type:USER_REGISTER_UNSET})}>
            <p>تم أنشاء الحساب بنجاح برجاء الإنتظار حتى يتم تفعيل الحساب</p>
            </Popup>}
        {error && <Popup danger passHandler={() => dispatch({type:USER_REGISTER_UNSET})}>
            <p>{error}</p>
            </Popup> }
        {loading 
        ? <Popup hide><Loader><p>جارى إنشاء الحساب</p></Loader></Popup> 
        :(
            <Form onSubmit={(e) => registerHandler(e)}>
                <Form.Group controlId="formBasicFirstName">
                    <Form.Label>الإسم الأول</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="الإسم الأول" 
                    required
                    onChange={({target:{value}}) => setFirstName(value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicLastName">
                    <Form.Label>الإسم الأخير</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="الإسم الأخير" 
                    required
                    onChange={({target:{value}}) => setLastName(value) }/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>البريد الإلكترونى</Form.Label>
                    <Form.Control 
                    type="email" 
                    placeholder="البريد الإلكترونى" 
                    required
                    onChange={({target:{value}}) => setEmail(value) }/>
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Label>رقم الجوال</Form.Label>
                    <Form.Control 
                    type="tel" 
                    placeholder="رقم الجوال" 
                    required
                    onChange={({target:{value}}) => setPhone(value)}/>
                </Form.Group>

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
                    onChange={({target:{value}}) => setPasswordConfirm(value)}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                تسجيل
                </Button>
                <Form.Text className="text-muted">
                    عضو مسجل <button onClick={(e) => {
                        e.preventDefault()
                        IsMemberHandler()
                        }}>اضغط هنا</button>
                </Form.Text>
            </Form>
        )}
         </>
    )
}

export default RegisterForm
