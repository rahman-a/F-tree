import {Button} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import parser from 'html-react-parser'
import CarouselBlock from './Carousel'

const NewsCard = ({info}) => {
    
    return (
        <div className='news__card'>
            <CarouselBlock images={info.image.split(',')}/>
            <div className="news__info">
                <h3 className="news__headline">{info.title}</h3>
                <div className='news__par'>{parser(info.body)}</div>
                <LinkContainer to={`/news/${info._id}`}>
                    <Button variant='outline-light'>قراءة الخبر</Button>
                </LinkContainer>
            </div>
        </div>
    )
}

export default NewsCard
