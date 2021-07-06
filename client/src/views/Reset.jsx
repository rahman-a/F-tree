import { useState } from 'react'
import {Container, Form, Button, Alert} from 'react-bootstrap'
import { useLocation, useHistory} from "react-router"
import {useDispatch, useSelector} from 'react-redux'
import {userResetPassword} from '../actions/userActions'
import Loader from '../components/Loader'

const Reset = () => {
    const dispatch = useDispatch()
    const {loading, error, message} = useSelector(state => state.resetPassword)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isPassMatch, setIsPassMatch] = useState(true)
    const location  = useLocation()
    const history = useHistory()
    const query = new URLSearchParams(location.search)
    message && console.log( message);
    const resetHandler = e => {
        e.preventDefault()
        if(password === confirmPassword){
            setIsPassMatch(true)
            const token = query.get('TOKEN')
            const data = {password, token}
            dispatch(userResetPassword(data)) 
        }else {
            setIsPassMatch(false)
        }
    }
    
    return (
        <div className='resetPass'>
            <div className="resetPass__header">
                <h1>الغنيم</h1>
                <p>إعادة ضبط كلمة المرور</p>
                {!isPassMatch && <Alert variant='danger'>كلمة المرور غير مطابقة من فضلك أعد ادخال كلمة المرور</Alert>}
                {loading ? <Loader/>
                :error ? <Alert variant='danger'>{error}</Alert>
                : message 
                && <>
                <Alert variant='success'>{message}</Alert>
                <Button 
                   style={{fontSize:'1.6rem'}} 
                   variant='light' 
                   onClick={() => history.push('/')}>
                       تسجيل دخول
                </Button>
                </>}
            </div>
            <Container>
                <div className="resetPass__wrapper">
                <Form onSubmit={(e) => resetHandler(e)}>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>كلمة المرور الجديدة</Form.Label>
                    <Form.Control 
                    type="password" 
                    placeholder="كلمة المرور" 
                    required
                    onChange={({target:{value}}) => setPassword(value)}/>
                </Form.Group>
                
                <Form.Group controlId="formBasicConfirmPassword">
                    <Form.Label> تأكيد كلمة المرور الجديدة</Form.Label>
                    <Form.Control 
                    type="password" 
                    placeholder="تأكيد كلمة المرور" 
                    required
                    onChange={({target:{value}}) => setConfirmPassword(value)}/>
                </Form.Group>

                <Button variant="primary" type="submit">
                دخول
                </Button>
                </Form>
                </div>
            </Container>
        </div>
    )
}

export default Reset
