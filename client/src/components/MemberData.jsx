import {Link} from 'react-router-dom'
import { useLocation } from 'react-router'

const MemberInfo = ({info, idx}) => {
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    if(query.get('page')) { 
        idx += (query.get('page') - 1)* 10
    }
    if(info){
        console.log('info inside: ',info)
    }
    return (
        <tr>
            <td>{idx}</td>
            <td><Link to={`/info/${info._id}`}><span>{`${info.firstName} ${info.fullName ? info.fullName : ''}`}</span> </Link></td>
            <td>
               { info.image
               ?(<img 
                src={`/uploads/${info.image}`} 
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
