import { useEffect } from 'react'
import Template from '../components/Template'
import {Container, Alert} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import {getOnePost} from '../actions/blogActions'
import Loader from '../components/Loader'
import parser from 'html-react-parser'
const NewsInfo = () => {
    const dispatch = useDispatch()
    const {loading, error, post} = useSelector(state => state.post)
    const {id} = useParams()
    const getAvatar  = (buffer) => {
        const arrayBufferView = new Uint8Array(buffer)
        const blob = new Blob([ arrayBufferView ], { type: 'image/png' })
        const urlCreator = window.URL || window.webkitURL
        const imageUrl = urlCreator.createObjectURL(blob)
        return imageUrl
    }
    useEffect(() => {
        dispatch(getOnePost(id))
    },[dispatch, id])
    return (
        <Template>
            <Container>
                {loading ? <Loader/>
                :error ? <Alert variant='danger'>{error}</Alert>
                :post && <div className="news__wrapper">
                    <div className="news__article">
                        <h2 className='news__title'>{post.title}</h2>
                        <figure className='news__image'>
                            <img src={getAvatar(post.image.data)} alt="صورة الخبر" />
                        </figure>
                        <p className='news__body'>{parser(post.body)}</p>
                    </div>
                </div>}
            </Container>
        </Template>
    )
}

export default NewsInfo
