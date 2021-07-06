import {useLocation, useHistory} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import {useSelector} from 'react-redux'

const NotMatch = () => {
    const location = useLocation()
    const history = useHistory()
    const {user} = useSelector(state => state.login)
    return (
        <div className='notFound'>
            <div className="notFound__wrapper">
                <figure>
                    <img src="/image/brokenTree.png" alt="broken tree" />
                </figure>
                <div className="notFound__info">
                    <h2 className="main__title">404</h2>
                    <p>هذا الرابط غير موجود <span>{location.pathname}</span>  تأكد من كتابة الرابط الصحيح</p>
                    {
                    !user ? <Button variant='light' onClick={() => history.push('/')}>من فضلك سجل دخول</Button>
                    : <Button variant='light' onClick={() => history.push('/home')}>الرجوع إلى الصفحة الرئيسية</Button>
                    }
                </div>
                
            </div>
        </div>
    )
}

export default NotMatch
