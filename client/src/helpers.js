export const ConvertToArabicNumbers = (num) => {
    const arabicNumbers = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
    // eslint-disable-next-line
   return new String(num).replace(/[0123456789]/g, (d)=>{return arabicNumbers[d]});
  }


  export const getAvatar  = (buffer) => {
    const arrayBufferView = new Uint8Array(buffer)
    const blob = new Blob([ arrayBufferView ], { type: 'image/png' })
    const urlCreator = window.URL || window.webkitURL
    const imageUrl = urlCreator.createObjectURL(blob)
    return imageUrl
  }