
const Footer = ({show, hide}) => {
    const date = new Date()
    const style = {
        textAlign:'center',
        fontSize:'1.35rem'
    }
    return (
        <p style={style} className={`${show && 'footer__show'} ${ hide && 'footer__hide'}`}>
           الحقوق محفوظة لعائلة الغنيم &copy; {date.getFullYear()}  -  تم تطوير الموقع بواسطة   &nbsp;
           <a href="mailto:ahm.abdrahman@gmail.com" style={{color:'#95a5a6'}}>أحمد عبد الرحمن</a>
        </p>
    )
}

export default Footer
