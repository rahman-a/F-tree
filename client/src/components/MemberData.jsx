import {Link} from 'react-router-dom'
import { useLocation } from 'react-router'

const MemberInfo = ({info, idx}) => {
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    if(query.get('page')) { 
        idx += (query.get('page') - 1)* 10
    }
    const getAvatar  = (buffer) => {
        const arrayBufferView = new Uint8Array(buffer)
        const blob = new Blob([ arrayBufferView ], { type: 'image/png' })
        const urlCreator = window.URL || window.webkitURL
        const imageUrl = urlCreator.createObjectURL(blob)
        return imageUrl
    }
    return (
        <tr>
            <td>{idx}</td>
            <td><Link to={`/info/${info._id}`}><span>{`${info.firstName} ${info.parentId ? info.parentName : ''}`}</span> </Link></td>
            <td>
               { info.image
               ?(<img 
                src={getAvatar(info.image.data)} 
                alt="صورة شخصية"  
                style={{width:'4rem', height:'4rem', borderRadius:'50%'}}/>)
                :<span>لا يوجد صورة شخصية</span>
                }
            </td>
            <td><span>{info.age}</span></td>
            <td><span>{info.maritalStatus}</span></td>
            <td><span>{info.job}</span></td>
            <td><span>{info.address}</span></td>
            <td><a href={`tel:${info.phone}`}>{info.phone}</a></td>
        </tr>
    )
}

export default MemberInfo
