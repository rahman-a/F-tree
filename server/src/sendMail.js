import nodemailer from 'nodemailer'

const template = {
    reset(info){
        return`
        <div style='
    color:#2b2c33; 
    padding:2rem;
    direction: rtl'>
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

const sendEmail = async (to, infoUrl) => {
    // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: 'ahmpeace.2010@gmail.com', // generated ethereal user
      pass: 'ahm4055select189', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '" عائلة  الغنيم  👻" elghoniewm@test.com', // sender address
    to, // list of receivers
    subject: "إعادة ضبط كلمة المرور من موقع عائلة الغنيم", // Subject line
    html: template.reset(infoUrl), // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export default sendEmail