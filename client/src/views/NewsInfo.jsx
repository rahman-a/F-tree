import { useEffect } from 'react'
import Template from '../components/Template'
import {Container, Alert, Button} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import {getOnePost, deletePost} from '../actions/blogActions'
import Loader from '../components/Loader'
import parser from 'html-react-parser'
import CarouselBlock from '../components/Carousel'

const NewsInfo = () => {
    const dispatch = useDispatch()
    const {loading, error, post} = useSelector(state => state.post)
    const {user:{data}} = useSelector(state => state.login)
    const {loading:loading_r, error:error_r, message} = useSelector(state => state.removePost)
    const {id} = useParams()

    const deleteNewHandler = _ => {
        const confirm = window.confirm('هل أنت متاكد من حذف الخبر')
        if(confirm) {
            dispatch(deletePost(id))
        }
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
                    {loading_r ? <Loader/>
                    :error_r ? <Alert style={{margin:'1rem 0'}} variant='danger'>{error_r}</Alert>
                    :message && <Alert style={{margin:'1rem 0'}} variant='success'>{message}</Alert>}
                    {data && (data.isCoAdmin || data.isAdmin) && <Button variant='danger' 
                    style={{margin:'2rem 0'}} 
                    className='news__new' 
                    onClick={deleteNewHandler}>
                        حذف الخبر
                    </Button>}
                        <h2 className='news__title'>{post.title}</h2>
                        {post.image && <CarouselBlock images={post.image.split(',')}/>}
                        <p className='news__body'>{parser(post.body)}</p>
                    </div>
                </div>}
            </Container>
        </Template>
    )
}

export default NewsInfo
