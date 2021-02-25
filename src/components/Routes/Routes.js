import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Login from '../Login/Login';
import QuestionList from '../QuestionList/QuestionList';
import UserQuestionPage from '../UserQuestionPage/UserQuestionPage';
import AddQuestion from '../AddQuestion/AddQuestion';
import AddUsers from '../AddUsers/AddUsers';
import UserList from '../UserList/UserList';
import AddMeeting from '../AddMeeting/AddMeeting';
import MeetingList from '../MeetingList/MeetingList';
import { Provider } from 'react-redux';
import {store} from './../../redux/store';

const authGuard = (Component)=>()=>{
  return sessionStorage.getItem("auth_token")!==null?
  (<Component/>):(
    <Redirect to="/users/uniquelink" />
  )
}

const Routes = (props)=>(
  <Provider store={store}>
  <Router {...props}>
  <Switch>
  <Route exact path="/">
  <Redirect to="/login" />
  </Route>
  <>
  <Header />
  <Route path="/login" component={Login} />
  <Route path="/questionlist/:id/:completed" render={authGuard(QuestionList)}></Route>
  <Route path="/addquestion" render={authGuard(AddQuestion)}></Route>
  <Route path="/meetinglist" render={authGuard(MeetingList)}></Route>
  <Route path="/addmeeting" render={authGuard(AddMeeting)}></Route>
  <Route path="/editmeeting/:id" render={authGuard(AddMeeting)}></Route>
  <Route path="/addusers" render={authGuard(AddUsers)}></Route>
  <Route path="/userslist/:id" render={authGuard(UserList)}></Route>
  <Route path="/users/:uniquelink" component={UserQuestionPage}></Route>
  <Footer/>
  </>
  </Switch>
  </Router>
  </Provider>
)
export default Routes;
