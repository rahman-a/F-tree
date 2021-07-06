import {Pagination} from 'react-bootstrap'
import {useHistory, useLocation} from 'react-router-dom'


const PaginationItems = ({count, page, searchHandler}) => {
    const history = useHistory()
    const location = useLocation()
    const size = Math.ceil(count / 10)
    const items = []
    const paginationHandler = num => {
       history.push(`${location.pathname}?${searchHandler('page', num)}`)
    }
    for(let num = 1; num <= size; num++){
        items.push(
            <Pagination.Item key={num} active={num === page} onClick={() => paginationHandler(num)}>
                {num}
            </Pagination.Item>
        )
    }
    return (
        <>
           {
               size > 1 
               && <Pagination style={{margin:'2rem 0'}}>
                   {items}
               </Pagination> 
           } 
        </>
    )
}

export default PaginationItems
