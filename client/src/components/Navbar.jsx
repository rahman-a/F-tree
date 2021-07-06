import {Container,Navbar,NavDropdown, Nav} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {userLogout} from '../actions/userActions'
import {useDispatch, useSelector} from 'react-redux'
import Popup from '../components/PopupMessage'

const NavigationBar = () => {
    const dispatch = useDispatch()
    const loginInfo = useSelector(state => state.login)
    const {user, error} = loginInfo
    return (
        <>
        {error && <Popup danger><p>{error}</p></Popup>}
        <Navbar bg="light" expand="lg" collapseOnSelect className='navigation__navbar'>
            <Container>
                <LinkContainer to='/home'>
                    <Navbar.Brand className='navigation__brand'>الغنيم</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="navigation__nav">
                        {/* <Form className='navigation__search'>
                            <FormControl type="text" placeholder="بحث بالإسم كاملاً" className="mr-sm-2" />
                            <Button variant="outline-success">بحث</Button>
                        </Form> */}
                        <NavDropdown title={`مرحباً ${user.data.firstName}`} id="basic-nav-dropdown" className='navigation__dropdown'>
                            
                            <LinkContainer to='/me'>
                                <NavDropdown.Item>
                                    <i className="fas fa-user-alt"></i> الملف الشخصى
                                </NavDropdown.Item>
                            </LinkContainer>

                            { (user.data.isAdmin || user.data.isCoAdmin)
                            && <><LinkContainer to='/members'>
                                <NavDropdown.Item>
                                    <i className="fas fa-people-arrows"></i>أعضاء العائلة
                                </NavDropdown.Item>
                            </LinkContainer>

                            <LinkContainer to='/users'>
                                <NavDropdown.Item>
                                    <i className="fas fa-users"></i>المستخدمين
                                </NavDropdown.Item>
                            </LinkContainer>
                            </>}

                            <LinkContainer to='/news'>
                                <NavDropdown.Item>
                                    <i className="far fa-newspaper"></i>صحيفة الأخبار
                                </NavDropdown.Item>
                            </LinkContainer>

                            <NavDropdown.Item onClick={() => dispatch(userLogout())}>
                                <i className="fas fa-sign-out-alt"></i>تسجيل الخروج
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )
}

export default NavigationBar
