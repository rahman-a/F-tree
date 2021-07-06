import { useState, useEffect } from "react"
import {useHistory, useLocation} from 'react-router-dom'
import Template from "../components/Template"
import {Table, Dropdown, Form, Button} from 'react-bootstrap'
import UserInfo from "../components/UserInfo"
import {useSelector, useDispatch} from 'react-redux'
import {userGetAll} from '../actions/userActions'
import Loader from '../components/Loader'
import Popup from "../components/PopupMessage"
import Pagination from "../components/Pagination"

const Users = () => {
    const [firstName, setFirstName] = useState('')
    const [sortText, setSortText] = useState('')
    const history = useHistory()
    const location = useLocation()
    const {user:{data}} = useSelector(state => state.login)
    const {loading, error, usersData} = useSelector(state => state.users)
    const {success} = useSelector(state => state.activate)
    const {success:success_p} = useSelector(state => state.promote)
    const {success:success_r} = useSelector(state => state.remove)
    const dispatch = useDispatch()

     const searchUrl = (key, value) => {
        // 1. convert location.search into URLSearchParams
         const search = new URLSearchParams(location.search)
        // 2. check if key exist or not in URLSearchParams
        if(search.has('isActive') && key === 'isCoAdmin'){
            // 3. if key exist, remove it
            search.delete('isActive')
        }
        if(search.has('isCoAdmin') && key === 'isActive'){
            // 3. if key exist, remove it
            search.delete('isCoAdmin')
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
        else if(d === 'active') {
            location.search 
            ? history.push(`${location.pathname}?${searchUrl('isActive','true')}`)
            :history.push(`${location.pathname}?isActive=true`)
            setSortText(value);

        } else if(d === 'deactive') {
            location.search 
            ? history.push(`${location.pathname}?${searchUrl('isActive','false')}`)
            :history.push(`${location.pathname}?isActive=false`)
            setSortText(value);
        } else if(d === 'CoAdmin') {
            location.search 
            ? history.push(`${location.pathname}?${searchUrl('isCoAdmin','true')}`)
            :history.push(`${location.pathname}?isCoAdmin=true`)
            setSortText(value);
        }else {
            location.search 
            ? history.push(`${location.pathname}?${searchUrl('isCoAdmin','false')}`)
            :history.push(`${location.pathname}?isCoAdmin=false`)
            setSortText(value);
        }
    }
    const usersSearchHandler = e => {
        e.preventDefault()
        location.search 
        ? history.push(`${location.pathname}?${searchUrl('keyword',firstName)}`)
        :history.push(`${location.pathname}?keyword=${firstName}`)
        setFirstName('')
    }
    useEffect(() => {
        dispatch(userGetAll(location.search))
    },[dispatch, success, success_p,success_r, location])
    return (
       <Template>
       <>
           <h2 className='main__title'>قائمة المستخدمين</h2>
           <div className="users">
               <div className="users__sort">
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                           {sortText ? sortText : 'فلترة المستخدمين'} 
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={({target}) => sortUserHandler(target.innerText,'all')}> إظهار جميع المستخدمين </Dropdown.Item>
                            <Dropdown.Item onClick={({target}) => sortUserHandler(target.innerText,'active')}> إظهار المستخدمين المفعلين</Dropdown.Item>
                            <Dropdown.Item onClick={({target}) => sortUserHandler(target.innerText,'deactive')}> إظهار المستخدمين الغير مفعلين</Dropdown.Item>
                            {data && data.isAdmin && <><Dropdown.Item onClick={({target}) => sortUserHandler(target.innerText,'CoAdmin')}> إظهار مساعدين المدير</Dropdown.Item>
                            <Dropdown.Item onClick={({target}) => sortUserHandler(target.innerText,'NoCoAdmin')}> إظهار المستخدمين الغير معينيين</Dropdown.Item></>}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form className='navigation__search users__search' onSubmit={(e) => usersSearchHandler(e)}>
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
            : error ? <Popup danger><p>{error}</p></Popup> 
            :(
            <><div className='users__table'>
                <Table bordered>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th><span>الإسم</span></th>
                        <th><span>البريد الإلكترونى</span></th>
                        <th><span>رقم الجوال</span></th>
                        {data.isAdmin && <th><span>مساعد المدير</span></th>}
                        <th><span>حالة الحساب</span></th>
                        <th><span>حذف الحساب</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersData && usersData.users.map((user,i) => (
                        <UserInfo info={user} key={user._id} ind={i}/> 
                        ))}
                    </tbody>
                </Table>
            </div>
            {usersData && <Pagination
                count={usersData.usersCounts}
                page={usersData.page}
                searchHandler={searchUrl}
            />}</>
            )}
            
           </div>
        </>
     </Template>
    )
}

export default Users
