// import nodemailer from 'nodemailer'

const template = {
    reset(info){
        return`
        <div style='
    color:#2b2c33; 
    padding:2rem;
    direction: rtl'>
        <h1>موقع عائلة سعيد بن غنيم</h1>
        <p>مرحباً ${info.name}</p>
        <p>لقد طلبت إعادة تغيير كلمة المرور</p>
        <p>لتاكيد عملية التغيير اضغط على هذا الرابط</p>
        <a href=${info.link} style='
            all:unset;
            display: block;
            width: 10rem;
            margin:1rem 0;
            padding:0.4rem;
            text-decoration: none;
            text-align: center;
            background-color: #106ebe;
            color:#f1f1f1;
            border-radius: 3px;
            cursor: pointer;
        '>أعد ضبط كلمة المرور</a>
        <h3 style='font-weight: 400;'> برجاء العلم ان هذا الرابط صلاحيتة <span style='
              color: #c60249;
              text-decoration: underline;
              font-weight: 700;
             '>24 ساعة فقط</span> </h3>
        <p>فى حالة إنتهاء صلاحية الرابط يرجى إعادة عملية ضبط كلمة المرور مرة اخرى</p>
    </div>
    `
}
}


import mailgun from 'mailgun-js'
import dotenv from 'dotenv'
dotenv.config()
const mg = mailgun({
  apiKey:process.env.MG_APIKEY, 
  domain:process.env.MG_DOMAIN
})

const sendEmail = async (info) => {
  const data = {
    from: 'noreplay@Ghoneim.com',
    to: info.email,
    subject: 'إعادة ضبط كلمة المرور',
    html: template.reset(info)
  };
  mg.messages().send(data, function (error, body) {
    if(error){
      throw new Error(error)
    }
    console.log('BODY: ',body);
  });
}

export default sendEmail
