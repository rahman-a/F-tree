import {Button} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import parser from 'html-react-parser'

const NewsCard = ({info}) => {
    const getAvatar  = (buffer) => {
        const arrayBufferView = new Uint8Array(buffer)
        const blob = new Blob([ arrayBufferView ], { type: 'image/png' })
        const urlCreator = window.URL || window.webkitURL
        const imageUrl = urlCreator.createObjectURL(blob)
        return imageUrl
    }
    return (
        <div className='news__card'>
            <figure className='news__figure'>
                <img src={getAvatar(info.image.data)} alt="صورة المقال" />
            </figure>
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
