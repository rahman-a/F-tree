import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {useParams, Link} from 'react-router-dom'
import {
    getMemberInfo, 
    uploadMemberAvatar,
    memberEdit, 
    addRelativesMember
} from '../actions/memberActions'
import {MEMBER_EDIT_CLEAR, MEMBER_ADD_RELATIVES_CLEAR} from '../constants/memberConstant'
import Template from "../components/Template"
import {
    Form,Container, 
    Row, 
    Col, 
    Alert, 
    Modal, 
    Button, 
    Accordion, 
    Card
} from 'react-bootstrap'
import Loader from '../components/Loader'
import Popup from "../components/PopupMessage"
import {ConvertToArabicNumbers} from '../helpers'

const MemberInfo = () => {
    const {id} = useParams()
    const [isAddRelative, setIsAddRelative] = useState(false)
    const [relativeData, setRelativeData] = useState(null)
    const [addSpouse, setAddSpouse] = useState('')
    const [addChildren, setAddChildren] = useState('')
    const [isFullName, setIsFullName]  = useState(false)
    const [formInfo, setFormInfo]  = useState({id})
    const dispatch = useDispatch()
    const {loading, error, info} = useSelector(state => state.profile)
    const {loading:loading_u, error:error_u, message} = useSelector(state => state.photoUpload)
    const {loading:loading_e, error:error_e, message:message_e} = useSelector(state => state.memberEdit)
    const {loading:loading_r, error:error_r, message:message_r} = useSelector(state => state.memberRelatives)
    const [isUploadAvatar, setIsUploadAvatar] = useState(false)
    
    const uploadAvatarHandler = e => {
      const avatar = e.target.files[0]
      const data = new FormData()
      data.append('avatar', avatar)
      data.append('memberId', id)
      dispatch(uploadMemberAvatar(data))
    }
    
      const editMemberHandler = e => {
            e.preventDefault()
            dispatch(memberEdit(formInfo))
            console.log(formInfo)
      }
    const setRelativeDataHandler = e => {
        e.preventDefault()
        let data = null
        if(info && info.gender === 'ذكر'){
            data = []
            data.push({
                name:addSpouse,
                children:addChildren.split('-')
            })
            if(relativeData) {
                setRelativeData([...relativeData,...data])
            }else {
                setRelativeData(data)
            }
        }else {
            data = {
                name:addSpouse,
                children: addChildren.split('-')
            }
            setRelativeData(data)  
        }
        setIsAddRelative(false)
    }
    const addRelativeHandler = _ => {
        dispatch(addRelativesMember({_id:id,data:relativeData}))
    }
    useEffect(() => {
       dispatch(getMemberInfo(id))
    },[dispatch,id])

    return (
        <Template>
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
            
            {/* Start Model for Full Name */}
           {info && <Modal
             show={isFullName}
             onHide={() => setIsFullName(false)}
            >
            <Modal.Header>
                <strong><em>الإسم الكامل للعضو</em></strong>
            </Modal.Header>
            <Modal.Body>
               {`${info.firstName} ${info.fullName ?info.fullName : ''}`} 
               سعيد غنيم مفرج بركه محمد غنيم المرواني الجهني
            </Modal.Body>
            </Modal>}
            {/* End Model for Full Name */}
            <div className="main__title">بيانات العضو</div>
            {loading ? <Loader/> 
            : error ? <Alert variant='danger'>{error}</Alert>
            :info && 
            <Container>
                {loading_e ? <Loader/> 
                :error_e ? <Popup danger passHandler={() => dispatch({type:MEMBER_EDIT_CLEAR})}><p>{error_e}</p></Popup>
                :message_e && <Popup success passHandler={() => dispatch({type:MEMBER_EDIT_CLEAR})}><p>{message_e}</p></Popup>}
                <div className="member__wrapper">
                    <div className="member__info">
                        <div className="member__data member__personal">
                            <h2 className='member__title'>البيانات الشخصية</h2>
                            <Form onSubmit={(e) => editMemberHandler(e)}>
                                <Row className='member__row'>
                                    <Col>
                                        <Form.Group controlId="formBasicName">
                                            <Form.Label>الإسم</Form.Label>
                                            <button 
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setIsFullName(true)
                                            }}
                                            style={{all:'unset', cursor:'pointer', padding:'0 1rem', fontFamily:' bebasThin'}}>
                                                إظهار الإسم كاملاً
                                            </button>
                                            <Form.Control type="text" 
                                            defaultValue={`${info.firstName} ${info.fullName ?info.fullName : ''}`} 
                                            required
                                            name='firstName'
                                            onFocus={({target}) => target.value = formInfo.firstName ? formInfo.firstName : info.firstName}
                                            onBlur={({target}) => {
                                                target.value = `${formInfo.firstName ? formInfo.firstName : info.firstName} ${info.fullName ? info.fullName : ''}`
                                            }}
                                            onChange={({target}) => setFormInfo({...formInfo, [target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Label>النوع</Form.Label>
                                            <Form.Control as="select" 
                                            name='gender' 
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}
                                            defaultValue={info.gender === 'ذكر' ? 'ذكر' : 'أنثى'}>
                                            <option>الجنس</option>
                                            <option value='ذكر'>ذكر</option>
                                            <option value='أنثى'>أنثى</option>
                                            </Form.Control>
                                        </Form.Group>
                                        
                                        <Form.Group controlId="formBasicaAge">
                                            <Form.Label> العمر</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.age ? ConvertToArabicNumbers(info.age) : ''} 
                                            required
                                            name='age'
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicBirth">
                                            <Form.Label>تاريخ الميلاد</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.birthDate ? ConvertToArabicNumbers(info.birthDate) : ''}
                                            required
                                            name='birthDate'
                                            onFocus= {({target}) => target.type = 'date'}
                                            onBlur = {({target}) => {
                                                target.type = 'text' 
                                                target.value = formInfo.birthDate ? formInfo.birthDate :ConvertToArabicNumbers(info.birthDate)
                                            }}
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formBasicBirth">
                                            <Form.Label>محل الإقامة</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.address} 
                                            required
                                            name='address'
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}/>
                                        </Form.Group>
                                    </Col>
                                    <Col className='member__col_data1'>

                                        <Form.Group controlId="formBasicState">
                                            <Form.Label>الحالة الإجتماعية</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.maritalStatus} 
                                            required
                                            name='maritalStatus'
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicJob">
                                            <Form.Label>الوظيفة</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.job} 
                                            required
                                            name='job'
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicSector">
                                            <Form.Label>القطاع</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.sector} 
                                            required
                                            name='sector'
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicPhone">
                                            <Form.Label>رقم الجوال</Form.Label>
                                            <Form.Control type="tel" 
                                            defaultValue={info.phone ? ConvertToArabicNumbers(info.phone) : ''} 
                                            required
                                            name='phone'
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Label>حالة الشخص</Form.Label>
                                            <Form.Control as="select" 
                                            defaultValue={info.isAlive ? 'على قيد الحياة':'متوفى'}
                                            name='isAlive'
                                            onChange={({target}) => {
                                                if(target.value === 'متوفى') setFormInfo({...formInfo,isAlive:false})
                                                else setFormInfo({...formInfo,isAlive:true})
                                            }}>
                                            <option value='متوفى'>متوفي</option>
                                            <option value='على قيد الحياة'>على قيد الحياة</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col className='member__col_data2'>
                                        <figure className='member__photo' onClick={() => setIsUploadAvatar(true)}>
                                         <img 
                                         src={info.image ? `http://localhost:5000/uploads/${info.image}` : '/image/avatar.jpg'} 
                                         alt="صورة العضو" />
                                        </figure>
                                    </Col>
                                </Row>
                                <Button variant="primary" type="submit">
                                حفظ
                                </Button>
                            </Form>
                        </div>
                        {info.parent && <div className="member__relative_toggle" style={{color:'lavender'}}>
                            <h2 className='member__title'>الاب والأم</h2>
                             <Accordion style={{color:'#162635',margin:'1rem 0'}}>
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="0">
                                    الأب
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                   <Link to={`/info/${info.parent.id}`}>
                                        <Card.Body>{info.parent.name}</Card.Body>
                                   </Link>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="1">
                                   الأم
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="1">
                                    {
                                        info.mother && info.mother.id 
                                        ? <Link to={`/info/${info.mother.id }`}><Card.Body>{info.mother.name}</Card.Body></Link> 
                                        : <Card.Body>{info.mother}</Card.Body>
                                    }
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </div>}
                        <div className="member__data member__relative">
                            <h2 className='member__title'>{info.gender === 'ذكر' ? 'الزوجات والأولاد' : 'الزوج والأولاد'}</h2>
                            <div className='member__relative_toggle'>
                                <Accordion style={{margin:'1rem 0'}}>
                                 {info.gender === 'ذكر'  ? info.wivesAndChildren.map((d, ind) => {
                                       return<> <Card key={ind}>
                                            <Accordion.Toggle as={Card.Header} eventKey={`${ind}`} >
                                                {
                                                    d.id 
                                                    ? <Link to={`/info/${d.id}`}>{d.name}</Link>
                                                    : d.name
                                                }
                                            </Accordion.Toggle>
                                            {d.children.map(c => {
                                            return <Link to={`/info/${c.id}`} key={c.id}>
                                                <Accordion.Collapse eventKey={`${ind}`}>
                                                    <Card.Body>{c.name}</Card.Body>
                                                </Accordion.Collapse>
                                            </Link>
                                            })}
                                        </Card>
                                        </>
                                    }) 
                                    :<><Card>
                                        <Accordion.Toggle as={Card.Header} eventKey='0'>
                                        {info.husbandAndChildren.id 
                                        ? <Link to={`/info/${info.husbandAndChildren.id}`}>{info.husbandAndChildren.name}</Link>
                                        :info.husbandAndChildren.name
                                        }
                                        </Accordion.Toggle>
                                        {info.husbandAndChildren.children.map((c, ind) => (
                                        c.id 
                                        ?  <Link to={`/info/${c.id}`} key={ind}>
                                                <Accordion.Collapse eventKey='0'>
                                                <Card.Body>{c.name}</Card.Body>
                                                </Accordion.Collapse>
                                            </Link>
                                        :<Accordion.Collapse eventKey='0' key={ind}>
                                        <Card.Body>{c.name}</Card.Body>
                                        </Accordion.Collapse>
                                        ))}
                                    </Card>
                                    </>}
                                    
                                </Accordion>
                                <div className= 'member__relative_name member__relative_add'
                                onClick={() => setIsAddRelative(!isAddRelative)}>
                                    {isAddRelative ? <i className="fas fa-minus"></i>:<i className="fas fa-plus"></i>}
                                </div>
                                
                            </div>
                            {loading_r ? <Loader/> 
                            :error_r ? <Popup danger 
                            passHandler={() => dispatch({type:MEMBER_ADD_RELATIVES_CLEAR})}> <p>{error_r}</p></Popup> 
                            :message_r && <Popup success 
                            passHandler={() => dispatch({type:MEMBER_ADD_RELATIVES_CLEAR})}> <p>{message_r}</p></Popup> }
                            {isAddRelative && <Form onSubmit={(e) => setRelativeDataHandler(e)}>
                                <Form.Group controlId="formBasicSpouse"> 
                                    <Form.Control 
                                    type="text"
                                    onChange={({target:{value}}) => setAddSpouse(value)} 
                                    required
                                    placeholder={info.gender === 'ذكر' ?'أضف اسم الزوجة' :'أضف اسم الزوج'}/>
                                    <Form.Control 
                                    as="textarea" 
                                    placeholder='أضف الأولاد مفصولاً بينهم بشرطة -'
                                    onChange={({target:{value}}) => setAddChildren(value)} 
                                    style={{margin:'1rem 0', fontSize:'1.6rem', direction:'ltr'}}/>
                                </Form.Group>
                                <Button variant="primary" type="submit" style={{margin:0}}>
                                تم
                                </Button>
                            </Form>}
                            {addSpouse && <Button variant="primary" onClick={addRelativeHandler}>
                               حفظ
                            </Button>}
                        </div>
                        <h2 className='member__title'>الأخبار المرتبطة</h2>
                        <div className="member__data member__news">
                        {(info.news && info.news.length > 0) 
                           ? <ul className='member__news_block'>
                                {
                                    info.news.map(n => (
                                        <li className='member__news_headline' key={n._id}>
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
