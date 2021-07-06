import { useState, useEffect } from "react"
import { useLocation, useHistory } from "react-router"
import Template from "../components/Template"
import {Dropdown, Table, Form , Button} from 'react-bootstrap'
import MemberData from "../components/MemberData"
import {memberGetAll} from '../actions/memberActions'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Popup from "../components/PopupMessage"
import Pagination from "../components/Pagination"

const Members = () => {
    const [firstName, setFirstName] = useState('')
    const [sortText, setSortText] = useState('')
    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()
    const {loading, error, membersData} = useSelector(state => state.members)

    const searchUrl = (key, value) => {
        // 1. convert location.search into URLSearchParams
         const search = new URLSearchParams(location.search)
        // 2. check if key exist or not in URLSearchParams
        if(search.has(key)){
            // 3. if key exist, remove it
            search.delete(key)
        }
        if(key !== 'page'){
            search.delete('page')
        }
         // 4. add key with its value
         search.append(key, value)
        // 5. convert URLSearchParams into string
        const searchString = search.toString()
        // 6. return this string
        return searchString
    }
    const sortUserHandler = (value, d) => {
        if(d === 'all'){
            history.push(`${location.pathname}`)
            setSortText(value);
        }
        else if(d === 'men') {
            location.search 
            ? history.push(`${location.pathname}?${searchUrl('gender','m')}`)
            :history.push(`${location.pathname}?gender=m`)
            setSortText(value);

        } else{
            location.search 
            ? history.push(`${location.pathname}?${searchUrl('gender','f')}`)
            :history.push(`${location.pathname}?gender=f`)
            setSortText(value);
        }}
    const membersSearchHandler = e => {
        e.preventDefault()
        location.search 
        ? history.push(`${location.pathname}?${searchUrl('keyword',firstName)}`)
        :history.push(`${location.pathname}?keyword=${firstName}`)
        setFirstName('')
    }

    useEffect(() => {
        dispatch(memberGetAll(location.search))
    },[dispatch, location])
    return (
        <Template>
           <h2 className='main__title'>قائمة أعضاء العائلة</h2>
           <div className="users">
               <div className="users__sort">
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                             {sortText ? sortText : 'فلترة الاعضاء'} 
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={({target}) => sortUserHandler(target.innerText,'all')}>جميع الاعضاء</Dropdown.Item>
                            <Dropdown.Item onClick={({target}) => sortUserHandler(target.innerText,'men')}>الرجال</Dropdown.Item>
                            <Dropdown.Item onClick={({target}) => sortUserHandler(target.innerText,'women')}>النساء</Dropdown.Item>
                        </Dropdown.Menu>

                    </Dropdown>
                    <Form className='navigation__search users__search' onSubmit={(e) => membersSearchHandler(e)}>
                        <Form.Control 
                        type="text" 
                        placeholder="بحث بالإسم الأول" 
                        className="mr-sm-2"
                        value={firstName}
                        onChange={({target:{value}}) => setFirstName(value)} />
                        <Button variant="outline-success">بحث</Button>
                    </Form>
               </div>
            { loading ? <Loader/>
            :error ?<Popup danger><p>{error}</p></Popup>
            :(<><div className='users__table'>
                <Table bordered>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th><span>الإسم</span></th>
                        <th><span>الصورة الشخصية</span></th>
                        <th><span>العمر</span></th>
                        <th><span>الحالة الإجتماعية</span></th>
                        <th><span>الوظيفة</span></th>
                        <th><span>مدينة الاقامة</span></th>
                        <th><span>رقم الجوال</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {membersData && membersData.members.map((member, i) => (
                        <MemberData info={member} key={member._id} idx={i+1}/> 
                        ))}
                    </tbody>
                </Table>
            </div>
                {membersData && <Pagination
                count={membersData.membersCounts}
                page={membersData.page}
                searchHandler={searchUrl}
            />}</> 
            )}         
           </div>
        </Template>
            
    )
}

export default Members
