import { useState } from "react"
import Template from "../components/Template"
import { useDispatch, useSelector } from "react-redux"
import {createNewMember} from '../actions/memberActions'
import {MEMBER_CREATE_CLEAR} from '../constants/memberConstant'
import {Form, Button, Row, Col, Container} from 'react-bootstrap'
import Loader from '../components/Loader'
import Popup from "../components/PopupMessage"

const NewMember = () => {
    const [formInfo, setFormInfo] = useState({})
    const dispatch = useDispatch()
    const {loading, error, message} = useSelector(state => state.newMember)
    const onChangeHandler = e => {
       e.preventDefault()
       if(e.target.name === 'isAlive'){
        setFormInfo({...formInfo, isAlive:e.target.value === 'true' ? true : false})
       }else {
           setFormInfo({...formInfo, [e.target.name]:e.target.value})
       }
    }
    const submitFormHandler = e => {
        e.preventDefault()
        dispatch(createNewMember(formInfo))
        console.log(formInfo)
    }
    return (
        <Template>
             <div className="main__title">إضافة عضو جديد</div>
             {loading ? <Loader/> 
             : error ? <Popup danger passHandler={() => dispatch({type:MEMBER_CREATE_CLEAR})}><p>{error}</p></Popup>
            :message && <Popup success passHandler={() => dispatch({type:MEMBER_CREATE_CLEAR})}><p>{message}</p></Popup>}
            <Container>
                <div className="member__wrapper">
                    <div className="member__info">
                        <div className="member__data member__personal">
                            <Form onSubmit={(e) => submitFormHandler(e)}>
                                <Row className='member__row'>
                                    <Col>
                                        <Form.Group controlId="formBasicName">
                                            <Form.Label>الإسم الأول</Form.Label>
                                            <Form.Control type="text"
                                            required
                                            name='firstName'
                                            onChange={(e) => onChangeHandler(e)}
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group controlId="formBasicName">
                                            <Form.Label>إضافة المعرف الخاص بالأب</Form.Label>
                                            <Form.Control type="text"
                                            required
                                            name='parentId'
                                            onChange={(e) => onChangeHandler(e)}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formBasicName">
                                            <Form.Label>إضافةالأم</Form.Label>
                                            <Form.Control type="text"
                                            required
                                            name='mother'
                                            onChange={(e) => onChangeHandler(e)}
                                            />
                                        </Form.Group>
                                        
                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Label>النوع</Form.Label>
                                            <Form.Control as="select" 
                                            name='gender' 
                                            defaultValue=''
                                            onChange={(e) => onChangeHandler(e)}>
                                            <option>الجنس</option>
                                            <option value='ذكر'>ذكر</option>
                                            <option value='أنثى'>أنثى</option>
                                            </Form.Control>
                                        </Form.Group>
                                        
                                        <Form.Group controlId="formBasicaAge">
                                            <Form.Label> العمر</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue='' 
                                            required
                                            name='age'
                                            onChange={(e) => onChangeHandler(e)}
                                           />
                                        </Form.Group>

                                        <Form.Group controlId="formBasicBirth">
                                            <Form.Label>تاريخ الميلاد</Form.Label>
                                            <Form.Control type="date" 
                                            defaultValue=''
                                            required
                                            name='birthDate'
                                            onChange={(e) => onChangeHandler(e)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col className='member__col_data1'>

                                        <Form.Group controlId="formBasicState">
                                            <Form.Label>الحالة الإجتماعية</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue=''
                                            required
                                            name='maritalStatus'
                                            onChange={(e) => onChangeHandler(e)}
                                           />
                                        </Form.Group>

                                        <Form.Group controlId="formBasicJob">
                                            <Form.Label>الوظيفة</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue=''
                                            required
                                            name='job'
                                            onChange={(e) => onChangeHandler(e)}
                                           />
                                        </Form.Group>

                                        <Form.Group controlId="formBasicSector">
                                            <Form.Label>القطاع</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue=''
                                            required
                                            name='sector'
                                            onChange={(e) => onChangeHandler(e)}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formBasicPhone">
                                            <Form.Label>رقم الجوال</Form.Label>
                                            <Form.Control type="tel" 
                                            defaultValue='' 
                                            required
                                            name='phone'
                                            onChange={(e) => onChangeHandler(e)}
                                           />
                                        </Form.Group>

                                        <Form.Group controlId="formBasicBirth">
                                            <Form.Label>محل الإقامة</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue=''
                                            required
                                            name='address'
                                            onChange={(e) => onChangeHandler(e)}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Label>حالة الشخص</Form.Label>
                                            <Form.Control as="select" 
                                            defaultValue=''
                                            name='isAlive'
                                            onChange={(e) => onChangeHandler(e)}
                                            >
                                            <option value={false}>متوفي</option>
                                            <option value={true}>على قيد الحياة</option>
                                            </Form.Control>
                                        </Form.Group>                      
                                    </Col>
                                </Row>
                                <Button variant="primary" type="submit">
                                حفظ
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </Container>
        </Template>
    )
}

export default NewMember
