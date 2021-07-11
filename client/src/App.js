import Login from './views/Authentication'
import Home from './views/Home'
import Profile from './views/Profile'
import Members from './views/Members'
import Users from './views/Users'
import News from './views/News'
import AddNews from './views/AddNews'
import NewsInfo from './views/NewsInfo'
import MemberInfo from './views/MemberInfo'
import NewMember from './views/NewMember'
import Reset from './views/Reset'
import NotMatch from './views/NotMatch'
import {Route, Switch, Redirect} from 'react-router-dom'
import {useSelector} from 'react-redux'


function App() {
  const {user} = useSelector(state => state.login)
  return (
    <div className="App">
      <Switch>
        <Route path='/' exact>
          <Login/>
        </Route>
        <Route path='/reset'>
          <Reset/>
        </Route>
        <Route path='/home'>
          {user ? <Home/> : <Redirect to='?redirect=home'/>}
        </Route>
        <Route path='/news' exact>
          {user ? <News/> : <Redirect to='?redirect=news'/>}
        </Route>
        <Route path='/me'>
          {user ? <Profile/> : <Redirect to='?redirect=me'/>}
        </Route>
        <Route path='/info/:id'>
          {user ? <MemberInfo/> : <Redirect to='?redirect=info'/>}
        </Route>
        <Route path='/users'>
          {user && (user.data.isAdmin || user.data.isCoAdmin) ? <Users/> : <Redirect to='/home'/>}
        </Route>
        <Route path='/members'>
          {user && (user.data.isAdmin || user.data.isCoAdmin) ? <Members/> : <Redirect to='/home'/>}
        </Route>
        <Route path='/news/new'>
          {user && (user.data.isAdmin || user.data.isCoAdmin) ? <AddNews/> : <Redirect to='/news'/>}
        </Route>
        <Route path='/new'>
          {user && (user.data.isAdmin || user.data.isCoAdmin) ? <NewMember/> : <Redirect to='/news'/>}
        </Route>
        <Route path='/news/:id'>
          {user ? <NewsInfo/> : <Redirect to='?redirect=news/:id'/>}
        </Route>
        <Route path='*' component={NotMatch}/>
      </Switch> 
    </div>
  );
}

export default App;
