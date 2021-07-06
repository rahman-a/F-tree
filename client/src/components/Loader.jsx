import {Spinner} from 'react-bootstrap'

const Loader = ({children}) => {
    return (
        <div className='spinner__wrapper'>
           <Spinner animation="border"/>
           {children}
        </div>
    )
}

export default Loader
