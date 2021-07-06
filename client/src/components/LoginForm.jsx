import { useState, useEffect } from 'react'
import {Form, Button, Alert} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
import {userLogin, userResetPassLnk} from '../actions/userActions'
import {useDispatch, useSelector} from 'react-redux'
import {USER_LOGIN_UNSET} from '../constants/userConstant'
import Popup from '../components/PopupMessage'
import Loader from '../components/Loader'
import Modal from '../components/Modal'

const LoginForm = ({IsMemberHandler}) => {
    const [isPasswordReset, setIsPasswordReset] = useState(false)
    const [emailRest, setEmailReset] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory()
    const dispatch = useDispatch()
    const {loading, error, user} = useSelector(state => state.login)
    const {loading:loading_r, error:error_r, message} = useSelector(state => state.resetPassLink)

    const loginHandler = e => {
        e.preventDefault()
        dispatch(userLogin({email, password}))
    }
    const resetPasswordHandler = e => {
        e.preventDefault()
        dispatch(userResetPassLnk({email:emailRest}))  
    }
    useEffect(() => {
        user && history.push('/home')
    },[user, history])
    return (
        <>
            <Modal
            heading='إعادة ضبط كلمة المرور'
            show={isPasswordReset}
            onHide={() => setIsPasswordReset(false)}
            >
            {loading_r && <Loader/>}
            {error_r && <Alert variant='danger'>{error_r}</Alert>}
            {message ? <Alert variant='success'>{message}</Alert>
            :<Form onSubmit={resetPasswordHandler}>
                <Form.Group controlId="formBasicEmail">
                        <Form.Label>من فضلك أدخل البريد الإلكترونى حتى يتم إرسال رابط اعادة الضبط</Form.Label>
                        <Form.Control 
                        type="email" 
                        placeholder="البريد الإلكترونى" 
                        required
                        onChange={({target:{value}}) => setEmailReset(value)}/>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading_r}>
                    إرسال
                </Button>
            </Form>}
            </Modal>
            {error && <Popup danger passHandler={() => dispatch({type:USER_LOGIN_UNSET})}><p>{error}</p></Popup>}
            {loading 
            ?<Popup hide><Loader><p>جارى تسجيل الدخول</p></Loader></Popup> 
            :<Form onSubmit={(e) => loginHandler(e)}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>البريد الإلكترونى</Form.Label>
                    <Form.Control 
                    type="email" 
                    placeholder="البريد الإلكترونى" 
                    required
                    onChange={({target:{value}}) => setEmail(value)}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>كلمة المرور</Form.Label>
                    <Form.Control 
                    type="password" 
                    placeholder="كلمة المرور" 
                    required
                    onChange={({target:{value}}) => setPassword(value)}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                دخول
                </Button>
                <Form.Text className="text-muted">
                    لتسجيل عضوية جديدة <button onClick={(e) => {
                        e.preventDefault()
                        IsMemberHandler()
                    }}>اضغط هنا</button>
                </Form.Text>
                <Form.Text className="text-muted">
                      نسيت كلمة المرور <button onClick={(e) => {
                        e.preventDefault()
                        setIsPasswordReset(!isPasswordReset)
                    }}>اضغط هنا</button>
                </Form.Text>
            </Form>}
        </>
        
    )
}

export default LoginForm
