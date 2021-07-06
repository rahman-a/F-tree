import { useEffect, useState } from "react"
import Template from "../components/Template"
import NewsCard from "../components/NewsCard"
import {Container, Button, Alert, Form} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {useSelector, useDispatch} from 'react-redux'
import {listAllPosts} from '../actions/blogActions'
import Loader from '../components/Loader'
import Pagination from "../components/Pagination"
import {useHistory, useLocation} from 'react-router-dom'

const News = () => {
  const {user} = useSelector(state => state.login)
  const {loading, error, posts,count,page} = useSelector(state => state.news)
  const dispatch = useDispatch()
  const [newsTitle, setNewsTitle] = useState('')
  const location = useLocation()
  const history = useHistory()
  const searchUrl = (key, value) => {
      // 1. convert location.search into URLSearchParams
      const search = new URLSearchParams(location.search)
      // 2. check if key exist or not in URLSearchParams
      if(search.has(key)){
          // 3. if key exist, remove it
          search.delete(key)
      }
      if(key !== 'page'){
          search.delete('page')
      }
      // 4. add key with its value
      search.append(key, value)
      // 5. convert URLSearchParams into string
      const searchString = search.toString()
      // 6. return this string
      return searchString
  }
  const newsSearchHandler = e => {
    e.preventDefault()
    history.push(`${location.pathname}?keyword=${newsTitle}`)
  }
  const resetSearchHandler = _ => {
    history.push(`${location.pathname}`)
  }

  useEffect(() => {
    dispatch(listAllPosts(location.search))
  },[dispatch, location])
    
  return (
      <Template>
        <h2 className='main__title'>صحيفة الاخبار</h2>  
        <Container>
        <div className="news__header">
          {(user.data.isAdmin || user.data.isCoAdmin) && <LinkContainer to='/news/new'>
            <Button variant='light' className='news__new'>إضافة خبر جديد</Button>
          </LinkContainer>}
          <Button onClick={resetSearchHandler} variant='info' className='news__new' style={{marginRight:'1rem'}}>إظهار جميع الاخبار</Button>
          <Form className='navigation__search users__search' onSubmit={(e) => newsSearchHandler(e)}>
            <Form.Control 
            type="text" 
            placeholder="ابحث بعنوان الخبر" 
            className="mr-sm-2"
            value={newsTitle}
            onChange={({target:{value}}) => setNewsTitle(value)} />
            <Button variant="outline-success">بحث</Button>
          </Form>
        </div>
        {loading ? <Loader/> 
        :error ? <Alert variant='danger'>{error}</Alert>
        :<><div className='news'>
            {posts && posts.map(n => (
              <NewsCard key={n._id} info={n}/>
            ))}
          </div>
           {posts && <Pagination
            count={count}
            page={page}
            searchHandler={searchUrl}
            />}
            </>}
        </Container>
      </Template>
    )
}

export default News