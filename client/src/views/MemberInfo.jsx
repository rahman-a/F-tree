import { useState, useEffect} from "react"
import { useSelector, useDispatch } from "react-redux"
import {useParams, Link} from 'react-router-dom'
import { WithContext as ReactTags } from 'react-tag-input'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {
    getMemberInfo, 
    uploadMemberAvatar,
    memberEdit, 
    addRelativesMember,
    getMembersBySearch,
    deleteRelativesMember
} from '../actions/memberActions'
import {MEMBER_EDIT_CLEAR, MEMBER_ADD_RELATIVES_CLEAR, MEMBER_DELETE_RELATIVES_CLEAR} from '../constants/memberConstant'
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

const KeyCodes = {
    enter: 13
}

const delimiters = [KeyCodes.enter];

const MemberInfo = () => {
    const {id} = useParams()
    const [isAddRelative, setIsAddRelative] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isSpouseTags, setIsSpouseTags] = useState(false)
    const [relativeData, setRelativeData] = useState(null)
    const [spouseTags, setSpouseTags] = useState([])
    const [childrenTags, setChildrenTags] = useState([])
    const [childrenSuggestions, setChildrenSuggestions] = useState([])
    const [spouseSuggestions, setSpouseSuggestions] = useState([])
    const [isFullName, setIsFullName]  = useState(false)
    const [formInfo, setFormInfo]  = useState({id})
    const dispatch = useDispatch()
    const {user} = useSelector(state => state.login)
    const {loading, error, info} = useSelector(state => state.profile)
    const {loading:loading_u, error:error_u, message} = useSelector(state => state.photoUpload)
    const {loading:loading_e, error:error_e, message:message_e} = useSelector(state => state.memberEdit)
    const {loading:loading_r, error:error_r, message:message_r} = useSelector(state => state.memberRelatives)
    const {loading:loading_sg, error:error_sg, members} = useSelector(state => state.memberSearch)
    const {loading:loading_dr, error:error_dr, message:message_dr} = useSelector(state => state.relativeDelete)
    const [isUploadAvatar, setIsUploadAvatar] = useState(false)
    
    const uploadAvatarHandler = e => {
      const avatar = e.target.files[0]
      const data = new FormData()
      data.append('avatar', avatar)
      data.append('memberId', id)
      dispatch(uploadMemberAvatar(data))
    }
    
    const handleSpouseDelete = i => {
        const newTags = spouseTags.filter((tag, index) => index !== i )
        setSpouseTags(newTags)
    }

    const handleSpouseAddition = t => {
        const newTags = [...spouseTags, t]
        setSpouseTags(newTags)
    }

    const handleSpouseInputChange = value => {
        setIsSpouseTags(true)
        dispatch(getMembersBySearch(value))
    }
    const handleChildrenDelete = i => {
        const newTags = childrenTags.filter((tag, index) => index !== i )
        setChildrenTags(newTags)
    }

    const handleChildrenAddition = t => {
        const newTags = [...childrenTags, t]
        setChildrenTags(newTags)
    }

    const handleChildrenInputChange = value => {
        setIsSpouseTags(false)
        dispatch(getMembersBySearch(value))
    }
    const editMemberHandler = e => {
        e.preventDefault()
        dispatch(memberEdit(formInfo))
    }
    const setRelativeDataHandler = _ => {
        if(spouseTags.length > 0){
            if(info && info.gender === 'ذكر'){
                const data = []
                data.push({
                    name:spouseTags[0]._id ?spouseTags[0]._id:spouseTags[0].name, 
                    children:childrenTags.map(ch => {
                        if(ch._id){
                            return ch._id
                        }else{
                            return ch.name
                        }
                    })
                })
                relativeData ? setRelativeData([...relativeData, ...data]):setRelativeData(data)
                
            }else {
                setRelativeData({
                    name:spouseTags[0]._id ? spouseTags[0]._id :spouseTags[0].name,
                    children:childrenTags.map(ch => {
                        if(ch._id){
                            return ch._id
                        }else{
                            return ch.name
                        }
                    })
                })
            }
            setSpouseTags([])
            setChildrenTags([])
            setIsAddRelative(false)
        }
    }
    const addRelativeHandler = _ => {
        dispatch(addRelativesMember({_id:id,data:relativeData}))
    }

    const deleteRelativeHandler = (e, name) => {
        e.stopPropagation()
        const confirm = window.confirm('هل أنت متاكد من حذف الزوجة')
        if(confirm){
            const data = {_id:id, spouseId:name}
            dispatch(deleteRelativesMember(data))
        }
    }
    useEffect(() => {
        if(members){
            isSpouseTags ? setSpouseSuggestions(members) : setChildrenSuggestions(members) 
        }else if(loading_sg){
            setSpouseSuggestions([{id:'جارى البحث ...', name:"جارى البحث ..."}])
        }else if(error_sg){
            setSpouseSuggestions([{id:error_sg, name:error_sg}])
        }
        if(!info || info._id !== id){
            dispatch(getMemberInfo(id))
        }
    },[dispatch, id,info, isSpouseTags, members, loading_sg, error_sg])

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
               {`${info.firstName} ${info.fullName ?info.fullName + ' ' : ''}`} 
                سعيد غنيم مفرج بركه محمد غنيم المرواني الجهني
            </Modal.Body>
            </Modal>}
            {/* End Model for Full Name */}
            <div className="main__title">بيانات العضو</div>
            {loading ? <Loader/> 
            : error ? <Alert variant='danger'>{error}</Alert>
            :info && 
            <Container>
                {(user.data.isAdmin || user.data.isCoAdmin) &&<CopyToClipboard text={id}
                    onCopy={() => setIsCopied(true)}>
                    <div style={{textAlign:'center'}}><Button style={{width:'fit-content', fontSize:'1.4rem'}} variant='light'>إضغط هنا لنسخ المعرف الخاص بالعضو</Button>
                    <span style={{display:isCopied ? 'block' : 'none', color:'#81f781'}}>تم النسخ ✔</span></div>
                </CopyToClipboard>}
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
                                            defaultValue={info.firstName} 
                                            required
                                            name='firstName'
                                            onChange={({target}) => setFormInfo({...formInfo, [target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicParent">
                                            <Form.Label>الأب</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.fullName ? info.fullName : ''} 
                                            required
                                            name='parentId'
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicMother">
                                            <Form.Label>الأم</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.mother ?info.mother.name : ''} 
                                            name='mother'
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="exampleForm.ControlSelect2">
                                            <Form.Label>النوع</Form.Label>
                                            <Form.Control as="select" 
                                            name='gender' 
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}
                                            defaultValue={info.gender === "ذكر" ? "ذكر" :info.gender === "أنثى" ? "أنثى" : "الجنس"}>
                                            <option>الجنس</option>
                                            <option value='ذكر'>ذكر</option>
                                            <option value='أنثى'>أنثى</option>
                                            </Form.Control>
                                        </Form.Group>
                                        
                                        <Form.Group controlId="formBasicaAge">
                                            <Form.Label> العمر</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.age ? ConvertToArabicNumbers(info.age) : ''} 
                                            name='age'
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicBirth">
                                            <Form.Label>تاريخ الميلاد</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.birthDate ? info.birthDate: ''}
                                            name='birthDate'
                                            onFocus= {({target}) => target.type = 'date'}
                                            onBlur = {({target}) => {
                                                target.type = 'text' 
                                                target.value = formInfo.birthDate 
                                                ? formInfo.birthDate 
                                                :info.birthDate ? info.birthDate: ''
                                            }}
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col className='member__col_data1'>
                                        <Form.Group controlId="formBasicBirth">
                                            <Form.Label>محل الإقامة</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.address} 
                                            name='address'
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicState">
                                            <Form.Label>الحالة الإجتماعية</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.maritalStatus} 
                                            name='maritalStatus'
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicJob">
                                            <Form.Label>الوظيفة</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.job} 
                                            name='job'
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicSector">
                                            <Form.Label>القطاع</Form.Label>
                                            <Form.Control type="text" 
                                            defaultValue={info.sector} 
                                            name='sector'
                                            onChange={({target}) => setFormInfo({...formInfo,[target.name]:target.value})}/>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicPhone">
                                            <Form.Label>رقم الجوال</Form.Label>
                                            <Form.Control type="tel" 
                                            defaultValue={info.phone ? ConvertToArabicNumbers(info.phone) : ''} 
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
                                        <figure className='member__photo' onClick={() => (user.data.isAdmin || user.data.isCoAdmin) && setIsUploadAvatar(true)}>
                                         <img 
                                         src={info.image ? `/uploads/${info.image}` : '/image/avatar.jpg'} 
                                         alt="صورة العضو" />
                                        </figure>
                                    </Col>
                                </Row>
                                {(user.data.isCoAdmin || user.data.isAdmin) &&<Button variant="primary" type="submit">
                                حفظ
                                </Button>}
                            </Form>
                        </div>
                        {info.parent && <div className="member__relative_toggle" style={{color:'lavender'}}>
                            {/* <h2 className='member__title'>الاب والأم</h2> */}
                             {/* <Accordion style={{color:'#162635',margin:'1rem 0'}}>
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
                            </Accordion> */}
                        </div>}
                        {loading_dr ? <Loader/> 
                            :error_dr ? <Popup danger 
                            passHandler={() => dispatch({type:MEMBER_DELETE_RELATIVES_CLEAR})}> <p>{error_dr}</p></Popup> 
                            :message_dr && <Popup success 
                            passHandler={() => dispatch({type:MEMBER_DELETE_RELATIVES_CLEAR})}> <p>{message_dr}</p></Popup> }
                        <div className="member__data member__relative">
                            <h2 className='member__title'>{info.gender === 'ذكر' ? 'الزوجات والأولاد' : 'الزوج والأولاد'}</h2>
                            <div className='member__relative_toggle'>
                                <Accordion style={{margin:'1rem 0'}}>
                                 {info.gender === 'ذكر'  ? info.wivesAndChildren.map((d, ind) => {
                                       return<> <Card key={ind}>
                                            <Accordion.Toggle as={Card.Header} eventKey={`${ind}`} >
                                                {
                                                    d.id 
                                                    ? <Link to={`/info/${d.id}`}><span className='member__relative_spouse
                                                    '>{d.name}</span></Link>
                                                    : <span className='member__relative_spouse
                                                    '>{d.name}</span> 
                                                }
                                                {(user.data.isAdmin || user.data.isCoAdmin)&&d.name && <span 
                                                className='member__relative_del'
                                                onClick={(e) => d.id ? deleteRelativeHandler(e,d.id) : deleteRelativeHandler(e,d.name)}
                                                >حذف</span>}
                                            </Accordion.Toggle>
                                            {d.children.map(c => {
                                            return c.id 
                                            ? <Link to={`/info/${c.id}`} key={c.id}>
                                                <Accordion.Collapse eventKey={`${ind}`}>
                                                    <Card.Body>{c.name}</Card.Body>
                                                </Accordion.Collapse>
                                            </Link>
                                            : <Accordion.Collapse eventKey={`${ind}`}>
                                                    <Card.Body>{c.name}</Card.Body>
                                               </Accordion.Collapse>
                                            })}
                                        </Card>
                                        </>
                                    }) 
                                    :info.husbandAndChildren.name&& <><Card>
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
                            </div>
                            {(user.data.isAdmin || user.data.isCoAdmin)&&<><div className= 'member__relative_name member__relative_add'
                            onClick={() => setIsAddRelative(!isAddRelative)}>
                                {isAddRelative ? <i className="fas fa-minus"></i>:<i className="fas fa-plus"></i>}
                            </div>
                            {loading_r ? <Loader/> 
                            :error_r ? <Popup danger 
                            passHandler={() => dispatch({type:MEMBER_ADD_RELATIVES_CLEAR})}> <p>{error_r}</p></Popup> 
                            :message_r && <Popup success 
                            passHandler={() => dispatch({type:MEMBER_ADD_RELATIVES_CLEAR})}> <p>{message_r}</p></Popup> }
                            {isAddRelative && <div style={{width:'30rem', margin:'1rem 0'}}>
                            <ReactTags
                            placeholder={info.gender === 'ذكر' ? 'أضف إسم الزوجة' : 'أضف اسم الزوج'}
                            tags={spouseTags}
                            suggestions={spouseSuggestions}
                            labelField={'name'}
                            handleDelete={handleSpouseDelete}
                            handleAddition={handleSpouseAddition}
                            handleInputChange={handleSpouseInputChange}
                            delimiters={delimiters}
                            allowDeleteFromEmptyInput={false}
                            allowDragDrop={false}
                            inputProps={{disabled:spouseTags.length > 0}}
                            
                            />
                             <div style={{height:'1rem'}}></div> 
                            <ReactTags
                            placeholder='أضف الأولاد'
                            tags={childrenTags}
                            suggestions={childrenSuggestions}
                            labelField={'name'}
                            handleDelete={handleChildrenDelete}
                            handleAddition={handleChildrenAddition}
                            handleInputChange={handleChildrenInputChange}
                            delimiters={delimiters}
                            allowDeleteFromEmptyInput={false}
                            allowDragDrop={false}
                            autofocus={false}
                            />
                            {(spouseTags.length > 0 || childrenTags.length > 0)
                            &&<Button variant="primary" onClick={setRelativeDataHandler}>تم</Button>}  
                            </div>}
                            {relativeData && <Button style={{display:'block'}} variant="primary" onClick={addRelativeHandler}>
                               حفظ
                            </Button>}</>}
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
