import {useState, useRef, useEffect} from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import {Button} from 'react-bootstrap'
import Footer from '../components/Footer'
import {useSelector} from 'react-redux'
import {useHistory, useLocation} from 'react-router-dom'

const Login = () => {
    const [isMember, setIsMember] = useState(true)
    const [isFormOn, setIsFormOn] = useState(false)
    const {user} = useSelector(state => state.login)
    const ref = useRef(null)
    const history = useHistory()
    const location = useLocation()
    const redirect = location.search ? location.search.split('=')[1] : undefined
    
    const authFormHandler = d => {
       if(d === 'log') {
        ref.current.style.display = 'grid'
        setIsFormOn(true)
        setIsMember(true)
       } else if(d === 'reg') {
        ref.current.style.display = 'grid'
        setIsFormOn(true)
        setIsMember(false)
       }else {
        ref.current.style.display = 'none'  
        setIsFormOn(false)
        setIsMember(false) 
       }
    }
    useEffect(() => {
        if(user){
            if(redirect){
                return history.push(`/${redirect}`)
            }
            history.push('/home')
        } 
    },[user,history, redirect])

    return (
        <>
        <div className='auth'>
            {!isFormOn && <figure className='auth__tree'>
                <div className="auth__tree_overlay">
                    <h1>أسرة الغنيم ترحب بكم</h1>
                </div>
                <img src="./image/tree.jpg" alt="tree" />
                <div className='auth__cta'>
                    <button onClick={() => authFormHandler('log')}>دخول</button>
                    <button onClick={() => authFormHandler('reg')}>تسجيل</button>
                </div>
            </figure>}
            <div className="auth__credential" ref={ref}>
                <Button 
                className='auth__credential_back' 
                variant='outline-light' 
                onClick={() => authFormHandler('back')}>
                    <i className="fas fa-long-arrow-alt-left"></i>
                </Button>
               {isMember 
               ? <LoginForm IsMemberHandler={() => setIsMember(!isMember)}/> 
               :  <RegisterForm IsMemberHandler={() => setIsMember(!isMember)}/>
               }
                 <Footer show/>
            </div>
        </div>
        <Footer hide/>
        </>
    )
}

export default Login
