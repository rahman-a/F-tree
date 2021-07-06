import {useEffect, useRef} from 'react'

const PopupMessage = ({children, danger, success, passHandler, hide}) => {
    const ref = useRef(null)
    const popupCloseHandler = _ => {
        ref.current.style.top = '0'
        ref.current.style.opacity = '0'
        if(passHandler) {
            setTimeout(() => {
                passHandler()
            }, 500)
        }
    }
    useEffect(() => {
        ref.current.style.top = '5rem'
        ref.current.style.opacity = '1'
        if(danger) {
            ref.current.style.color = '#700404'
            ref.current.style.backgroundColor = '#ffdede'
        }
        if(success) {
            ref.current.style.color = '#025c0d'
            ref.current.style.backgroundColor = '#d7fadb'
        }
    })
    return (
        <div className='popup' ref={ref}>
           {!hide && <span className='popup__close' onClick={popupCloseHandler}>
                <i className="fas fa-times-circle"></i>
            </span>}
            {children}
        </div>
    )
}

export default PopupMessage
