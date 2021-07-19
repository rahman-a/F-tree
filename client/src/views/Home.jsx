import { useState, useEffect} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import {
    userUploadCSV, 
    userGenerateCSV, 
    userGenerateData, 
    convertToPNG, 
    userGenerateFamilyCSV
} from '../actions/memberActions'
import {
    MEMBER_GENERATE_CSV_CLEAR,
    CONVERT_TO_PNG_CLEAR,
    MEMBER_GENERATE_FAMILY_CSV_CLEAR
} from '../constants/memberConstant'
import Template from '../components/Template'
import {Button, Form,Alert} from 'react-bootstrap'
// import Tree from '../components/Tree'
import TreeFix from '../components/TreeFix'
import Modal from '../components/Modal'
import Loader from '../components/Loader'
import { useHistory } from 'react-router'

const Home = () => {
    const [isUploadOn, setIsUploadOn] = useState(false)
    const [isGenerateOn, setIsGenerateOn] = useState(false)
    const [countId, setCountId] = useState(0)
    const [isProfile, setIsProfile] = useState(false)
    const [isPoint, setIsPoint] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const {user:{data}} = useSelector(state => state.login) 
    const {loading, error, message, isUploaded} = useSelector(state => state.csvReducer) 
    const {loading:loading_g, error:error_g, csvData} = useSelector(state => state.generateCSV)
    const {loading:loading_f, error:error_f, familyData} = useSelector(state => state.familyData)
    const {loading:loading_p, pngData} = useSelector(state => state.PNGTree)
    const {familyCSV} = useSelector(state => state.familyCSV)
    
    const uploadCSVHandler = (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append('csv', e.target.files[0])
        dispatch(userUploadCSV(data))
    }
    const generateCSVHandler = e => {
        e.preventDefault()
        dispatch(userGenerateCSV(countId))
    }
    const generateCSVFamilyHandler = _ =>{
        dispatch(userGenerateFamilyCSV())
    }

    const getAvatar  = (buffer) => {
        const arrayBufferView = new Uint8Array(buffer)
        const blob = new Blob([ arrayBufferView ], { type: 'image/png' })
        const urlCreator = window.URL || window.webkitURL
        const imageUrl = urlCreator.createObjectURL(blob)
        return imageUrl
      }

    const SVGTOPNGHandler = async  _ => {
        if(document.querySelector('svg')){
            const svgString = new XMLSerializer().serializeToString(document.querySelector('svg'))
            dispatch(convertToPNG(svgString))
        }
       
    }
    // const SVGTOPDFHandler = async  _ => {
    //     const svgString = new XMLSerializer().serializeToString(document.querySelector('svg'))
    //     dispatch(convertToPDF(svgString))
       
    // }
    useEffect(() => {
        if(csvData) {
            const hiddenElement = document.createElement('a');
                  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
                  hiddenElement.download = 'family_template.csv';
                  hiddenElement.click();
            dispatch({type:MEMBER_GENERATE_CSV_CLEAR})
        }
        if(pngData){
            const source = getAvatar(pngData.data)
            const hiddenElement = document.createElement('a');
                  hiddenElement.href = source;
                  hiddenElement.download = 'family-tree.png'
                  hiddenElement.click();
                  dispatch({type:CONVERT_TO_PNG_CLEAR})
        };
        if(familyCSV){
            const hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(familyCSV);
            hiddenElement.download = 'family_data.csv';
            hiddenElement.click()
            dispatch({type:MEMBER_GENERATE_FAMILY_CSV_CLEAR})
        };
        if(!familyData) dispatch(userGenerateData())
    },[isUploaded, csvData, dispatch, pngData, history, familyCSV, familyData])
    return (
        <Template>
            {/* Start Model for upload csv file */}
            <Modal
            heading='رفع ملف الــ Excel المحتوى على بيانات أعضاء العائلة'
            show={isUploadOn}
            onHide={() => setIsUploadOn(false)}
            >
            {loading && <Loader/>}
            {error && <Alert variant='danger'>{error}</Alert>}
            {message ? <Alert variant='success'>{message}</Alert>
            :<Form>
                <Form.Group>
                    <label htmlFor='formUpload' className='home__upload'>إضغط هنا لإختيار الملف</label>
                    <Form.Control
                            style={{display:'none'}}
                            id='formUpload' 
                            type="file"
                            required
                            disabled={loading}
                            onChange={(e) => uploadCSVHandler(e)}/>
                </Form.Group>
            </Form>}
            {/* End Model for upload csv file */}
            </Modal>
            
            {/* Start Model for generate template csv with ids */}
            <Modal
            heading='إنشاء قالبـ CSV يحتوى على المعرفات لإدخال البيانات'
            show={isGenerateOn}
            onHide={() => setIsGenerateOn(false)}
            >
            {loading_g && <Loader/>}
            {error_g && <Alert variant='danger'>{error_g}</Alert>}
            <Form>
                <Form.Group>
                    <label htmlFor='formGenerate'>إختر رقم لعدد المعرفات التى تريد إنشائها</label>
                    <Form.Control
                            id='formGenerate' 
                            type='number'
                            required
                            disabled={loading}
                            onChange={({target:{value}}) => setCountId(value)}
                            />
                </Form.Group>
                <Button variant='info' onClick={(e) => generateCSVHandler(e)}>تحميل القالب</Button>
            </Form>
            </Modal>
            {/* End Model for generate template csv with ids */}
            
            <div className="home__header">  
                {data && (data.isAdmin || data.isCoAdmin)  
                &&
                <><Button variant='dark' onClick={() => setIsGenerateOn(true)}>إنشاء قالب البيانات</Button>
                <Button variant='success' onClick={() => setIsUploadOn(true)}>
                    رفع ملف البيانات
                </Button>
                <Button variant='light' onClick={generateCSVFamilyHandler}>
                    جلب ملف البيانات
                </Button>
                <Button style={{width:'14rem', height:'3.5rem', position:'relative'}} variant='warning' onClick={SVGTOPNGHandler}>
                   {loading_p ? <div className="lds-dual-ring"></div> : 'تصدير الشجرة كـ PNG'}
                </Button>
                <Button variant='danger' onClick={() => history.push('/new')}>
                    إضافة عضو جديد
                </Button>
                </>} 
                <Button variant='info' onClick={() => setIsProfile(!isProfile)}> 
                    وضع العرض 
                    <i className="fas fa-circle" 
                    style={{color:isProfile ? '#197802': '#7b8a8b', textShadow: isProfile && '0px 12px 18px #18bc9c'}}>
                    </i>
                </Button>
                <Button variant='info' onClick={() => setIsPoint(!isPoint)}> 
                    وضع الإشارة 
                    <i className="fas fa-hand-point-up"
                    style={{color:isPoint? '#197802': '#7b8a8b', textShadow: isPoint && '0px 12px 18px #18bc9c'}}>
                    </i>
                </Button>
                {/* <Button variant='danger' onClick={() => setSvgScale(svgScale - 0.1)} disabled = {svgScale <= 0}>
                تصغير حجم الشجرة
                </Button> */}
            </div>
            <div className="home__main">
                {/* <Tree familyData={familyData} isProfile={isProfile}/> */}
               {error_f && <Alert variant='danger'>{error_f}</Alert>}
               {loading_f ? <Loader/>
               :familyData && familyData.length > 1 ? <TreeFix familyData={familyData} isProfile={isProfile} isPoint={isPoint}/>
               :<div className="home__fallback">
                     ليس هناك بيانات لعرض شجرة العائلة 
                    <span> من فضلك ارفع ملف البيانات لجلب المعلومات اللازمة </span>
                </div>}
            </div>
        </Template>
    )
}

export default Home
