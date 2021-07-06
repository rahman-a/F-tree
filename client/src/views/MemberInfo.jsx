import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {useParams, Link} from 'react-router-dom'
import {getMemberInfo, uploadMemberAvatar, getMemberAvatar} from '../actions/memberActions'
import Template from "../components/Template"
import {Form,Container, Row, Col, Alert, Modal} from 'react-bootstrap'
import Loader from '../components/Loader'

const MemberInfo = () => {
    const dispatch = useDispatch()
    const {loading, error, info} = useSelector(state => state.profile)
    const {loading:loading_u, error:error_u, message} = useSelector(state => state.photoUpload)
    const {loading:loading_a, error:error_a, avatar} = useSelector(state => state.avatar)
    const {id} = useParams()
    const [isUploadAvatar, setIsUploadAvatar] = useState(false)
    
    const uploadAvatarHandler = e => {
      const avatar = e.target.files[0]
      const data = new FormData()
      data.append('avatar', avatar)
      data.append('memberId', id)
      dispatch(uploadMemberAvatar(data))
    }
    const getAvatar  = (buffer) => {
        const arrayBufferView = new Uint8Array(buffer)
        const blob = new Blob([ arrayBufferView ], { type: 'image/png' })
        const urlCreator = window.URL || window.webkitURL
        const imageUrl = urlCreator.createObjectURL(blob)
        return imageUrl
      }
    useEffect(() => {
       dispatch(getMemberInfo(id))
       dispatch(getMemberAvatar(id))
    },[dispatch,id])

    return (
        <Template>
            {loading_a ? <Loader/> : error_a && <Alert variant='danger'>{error_a}</Alert>}
            {/* Start Model for upload photo file */}
            <Modal
            heading='رفع الصورة الخاصة بالعضو'
            show={isUploadAvatar}
            onHide={() => setIsUploadAvatar(false)}
            >
            {loading_u && <Loader/>}
            {error_u && <Alert variant='danger'>{error_u}</Alert>}
            {message ? <Alert variant='success'>{message}</Alert>
            :<Form>
                <Form.Group>
                    <label htmlFor='formUpload' className='home__upload'>إضغط هنا لإختيار الصورة</label>
                    <Form.Control
                            style={{display:'none'}}
                            id='formUpload' 
                            type="file"
                            required
                            disabled={loading}
                            onChange={(e) => uploadAvatarHandler(e)}/>
                </Form.Group>
            </Form>}
            </Modal>
            {/* End Model for upload photo file */}

            <div className="main__title">بيانات العضو</div>
            {loading ? <Loader/> 
            : error ? <Alert variant='danger'>{error}</Alert>
            :info && 
            <Container>
                <div className="member__wrapper">
                    <div className="member__info">
                        <div className="member__data member__personal">
                            <h2 className='member__title'>البيانات الشخصية</h2>
                            <Form>
                                <Row className='member__row'>
                                    <Col>
                                        <Form.Group controlId="formBasicName">
                                            <Form.Label>الإسم</Form.Label>
                                            <Form.Control type="text" defaultValue={`${info.firstName} ${info.parentName ? info.parentName : ''}`} required/>
                                        </Form.Group>

                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Label>النوع</Form.Label>
                                            <Form.Control as="select">
                                            <option value='male' selected={!info.gender}>الجنس</option>
                                            <option value='male' selected={info.gender === 'ذكر'}>ذكر</option>
                                            <option value='female' selected={info.gender === 'أنثى'}>أنثى</option>
                                            </Form.Control>
                                        </Form.Group>
                                        
                                        <Form.Group controlId="formBasicaAge">
                                            <Form.Label> العمر</Form.Label>
                                            <Form.Control type="number" defaultValue={info.age} required/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicBirth">
                                            <Form.Label>تاريخ الميلاد</Form.Label>
                                            <Form.Control type="date" defaultValue={info.birthDate} required/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicBirth">
                                            <Form.Label>محل الإقامة</Form.Label>
                                            <Form.Control type="text" defaultValue={info.address} required/>
                                        </Form.Group>
                                    </Col>
                                    <Col className='member__col_data1'>

                                        <Form.Group controlId="formBasicState">
                                            <Form.Label>الحالة الإجتماعية</Form.Label>
                                            <Form.Control type="text" defaultValue={info.maritalStatus} required/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicJob">
                                            <Form.Label>الوظيفة</Form.Label>
                                            <Form.Control type="text" defaultValue={info.job} required/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicSector">
                                            <Form.Label>القطاع</Form.Label>
                                            <Form.Control type="text" defaultValue={info.sector} required/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicPhone">
                                            <Form.Label>رقم الجوال</Form.Label>
                                            <Form.Control type="tel" defaultValue={info.phone} required/>
                                        </Form.Group>

                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Label>حالة الشخص</Form.Label>
                                            <Form.Control as="select" defaultValue={info.isAlive ? 'على قيد الحياة':'متوفى'}>
                                            <option value='متوفى'>متوفي</option>
                                            <option value='على قيد الحياة'>على قيد الحياة</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col className='member__col_data2'>
                                        {avatar ? <figure className='member__photo' onClick={() => setIsUploadAvatar(true)}>
                                            <img src={getAvatar(avatar.data)} alt="صورة العضو" />
                                        </figure>
                                        :<figure className='member__photo' onClick={() => setIsUploadAvatar(true)}>
                                         <img src='/image/avatar.jpg' alt="صورة العضو" />
                                        </figure>
                                        }
                                    </Col>
                                </Row>
                                {/* <Button variant="primary" type="submit">
                                حفظ
                                </Button> */}
                            </Form>
                        </div>
                        <div className="member__data member__relative">
                            <h2 className='member__title'>الأشخاص المرتبطين</h2>
                            {!info.gender && <p style={{color:'#e7e7e7'}}>من فضلك حدد نوع الشخص لإضافة الأشخاص المرتبطين </p>}
                            <h3 className='member__relative_title'>{info.gender === 'ذكر' ? 'الزوجات' : 'الزوج'}</h3>
                            <ul>
                                {info.spouseNames && info.spouseNames.map(cd => (
                                    cd.parent ? <li className='member__relative_name'>
                                      <Link to={`/info/${cd._id}`}>{`${cd.name} ${cd.parent}`}</Link> </li>
                                    :<li className='member__relative_name'>{cd.name}</li>
                                ))}
                                {/* <li className= 'member__relative_name member__relative_add'
                                onClick={() => setIsAddSpouse(!isAddSpouse)}>
                                    {isAddSpouse ? <i className="fas fa-minus"></i>:<i className="fas fa-plus"></i>}
                                </li> */}
                            </ul>
                            {/* {isAddSpouse && <Form onSubmit={(e) => addRelativeHandler(e, 'spouse')}>
                                <Form.Group controlId="formBasicSpouse"> 
                                    <Form.Control type="text" required/>
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                حفظ
                                </Button>
                            </Form>} */}
                            <h3 className='member__relative_title'>الأبناء</h3>
                            <ul>
                                {info.childrenNames && info.childrenNames.map(cd => (
                                    cd.parent ? <li className='member__relative_name'>
                                      <Link to={`/info/${cd._id}`}>{`${cd.name} ${cd.parent}`}</Link> </li>
                                    :<li className='member__relative_name'>{cd.name}</li>
                                ))}
                                {/* <li className= 'member__relative_name member__relative_add'
                                onClick={() => setIsAddChild(!isAddChild)}>
                                    {isAddChild ? <i className="fas fa-minus"></i>:<i className="fas fa-plus"></i>}
                                </li> */}
                            </ul>
                            {/* {isAddChild && <Form onSubmit={(e) => addRelativeHandler(e, 'child')}>
                                <Form.Group controlId="formBasicChild"> 
                                    <Form.Control type="text" required/>
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                حفظ
                                </Button>
                            </Form>} */}
                        </div>
                        <h2 className='member__title'>الأخبار المرتبطة</h2>
                        <div className="member__data member__news">
                        {(info.news && info.news.length > 0) 
                           ? <ul className='member__news_block'>
                                {
                                    info.news.map(n => (
                                        <li className='member__news_headline'>
                                          <Link to={`/news/${n._id}`}>{n.title}</Link>  
                                        </li>
                                    ))
                                }   
                            </ul>                    
                            :<div style={{fontSize:'1.8rem', letterSpacing:'2px'}}>لا يوجد اخبار متعلقة بهذا العضو</div>}
                        </div>
                    </div>
                </div>
            </Container>}
        </Template>
    )
}

export default MemberInfo
