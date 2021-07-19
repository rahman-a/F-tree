
const Footer = ({show, hide}) => {
    const date = new Date()
    const style = {
        textAlign:'center',
        fontSize:'1.35rem'
    }
    return (
        <p style={style} className={`${show && 'footer__show'} ${ hide && 'footer__hide'}`}>
           الحقوق محفوظة لعائلة سعيد بن غنيم &copy; {date.getFullYear()}  -  تم تطوير الموقع بواسطة   &nbsp;
           <a href="https://www.abdrahman.me" target='_blank' style={{color:'#95a5a6'}} rel="noreferrer">أحمد عبد الرحمن</a>
        </p>
    )
}

export default Footer
