import {useState} from 'react'
import Template from "../components/Template"
import {Button, Form, Container, Alert} from 'react-bootstrap'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { WithContext as ReactTags } from 'react-tag-input';
import {createPost} from '../actions/blogActions'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../components/Loader'

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const AddNews = () => {
  const [text, setText] = useState('')
  const [title, setTitle] = useState('')
  const [img, setImg] = useState('')
  const [tags, setTags] = useState([])
  const dispatch = useDispatch()
  const {loading, error, message} = useSelector(state => state.newPost)
  

  
  const handleDelete = i => {
        const newTags = tags.filter((tag, index) => index !== i )
        setTags(newTags)
    }

    const handleAddition = t => {
        const newTags = [...tags, t]
        setTags(newTags)
    }


    const newsHandler = e => {
        e.preventDefault()
        const members = tags.map(tag => {
            return {
                _id:tag.id
            }
        })
        
        const data = new FormData()
        data.append('title', title)
        data.append('body', text)
        data.append('members', JSON.stringify(members))
        for(let i = 0; i < img.length; i++){
            data.append('image', img[i])
        }
        dispatch(createPost(data))
    }

    return (
        <Template>
            <h2 className="main__title">إنشاء خبر جديد</h2>
            <Container>
                <div className="news__add">
                    <Form onSubmit={(e) => newsHandler(e)}>
                        {loading ? <Loader/>
                        :error ? <Alert variant='danger'>{error}</Alert>
                        :message && <Alert variant='success'>{message}</Alert>}
                        <Form.Group controlId="formBasicTitle">
                            <Form.Label>عنوان الخبر</Form.Label>
                            <Form.Control type="text" placeholder="عنوان الخبر" onChange={({target:{value}}) => setTitle(value)} required/>
                        </Form.Group>

                        <Form.Group controlId="formBasicNews">
                            <Form.Label>موضوع الخبر</Form.Label>
                            <div className="editor cke_rtl" style={{color:'#000'}}>
                                <CKEditor
                                editor={ClassicEditor}
                                data={text}
                                config={{
                                    language:{
                                        ui:'ar',
                                        content:'ar'
                                    },
                                    toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList',
                                            'mediaEmbed', '|', 'undo', 'redo', 'color']
        
                                }}
                                onChange= {(evt, editor) => {
                                    const data = editor.getData()
                                    setText(data)
                                }}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group controlId="formBasicTitle" style={{position:'relative'}}>
                            <Form.Label>الأشخاص المرتبطين بالخبر</Form.Label>
                            <ReactTags
                                inline
                                placeholder='أضف المعرف الخاص بالعضو'
                                tags={tags}
                                handleDelete={handleDelete}
                                handleAddition={handleAddition}
                                delimiters={delimiters} />
                        </Form.Group>

                        <Form.Group controlId="formBasicImage">
                            <Form.File id="exampleFormControlFile1" multiple label="أرفق صورة للخبر" onChange={(e) => setImg(e.target.files)}/>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                        حفظ
                        </Button>
                    </Form>
                </div>
            </Container>
            
        </Template>
    )
}

export default AddNews


/**
 * 
 *          { _id:0, id:'أحمد محمد أحمد السيد عبد الرحمن', text: 'أحمد محمد أحمد السيد عبد الرحمن' },
            { _id:1, id:'وليد إبراهيم محمود رزق', text: 'وليد إبراهيم محمود رزق' },
            { _id:2, id:'سمير على السيد مرزوق', text: 'سمير على السيد مرزوق' },
            { _id:3, id:'فارس محمد حسين العوضى' , text: 'فارس محمد حسين العوضى' },
            { _id:4, id:'إسلام على السيد عوضين' , text: 'إسلام على السيد عوضين' },
            { _id:5, id:'علاء محمود السيد دياب' , text: 'علاء محمود السيد دياب' },
 */