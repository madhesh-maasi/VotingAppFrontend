import React, { useState, useEffect } from 'react';
import { Link ,useHistory} from 'react-router-dom';
import axiosConfig from '../../config/axiosConfig';
import Loader from '../Loader/Loader';
import { withRouter } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {AiOutlineEdit,AiFillEye} from 'react-icons/ai';
import './MeetingList.css';
import {useDispatch, useSelector} from 'react-redux';
import {store} from './../../redux/store';

function MeetingList(props) {

  /*const loginInfo = store.getState();
  const userId = loginInfo.loginReducer.userId;
  const role = loginInfo.loginReducer.role;*/

  const loginInfo = JSON.parse(sessionStorage.getItem("user_info"));
  const userId = loginInfo.userId;
  const role = loginInfo.role;

  console.log('role',role);
  const [hideFeature, setHideFeature] = useState(role==='MeetingOwner'?true:false);
    console.log('hideFeature',hideFeature);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let history = useHistory();

   const [state , setState] = useState({
		  currentPage: 1,
		  pageNumber:1,
          dataPerPage: 5
     });
  const { t, i18n } = useTranslation()
  useEffect(() => {
    // GET request using axios inside useEffect React hook
  axiosConfig.get('Meeting/allmeetinginfo?LoginUserId='+userId)
     .then(response =>{
      // console.log('data::',JSON.stringify(response))
      setIsLoading(false)
       setData(response.data);

   });
    // // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);


  // Logic for displaying current data


   const handleClick = (e)=>{
		   e.preventDefault();
		   console.log('value',e.target.id);
		   const {id , value} = e.target
         setState(prevState => ({
          ...prevState,
          currentPage : e.target.id
      }))
      }

   const handlePrev =()=>{
        if(state.currentPage === 1) return

         setState(prevState => ({
          ...prevState,
          currentPage : state.currentPage-1
      }))
    }
    const handleNext =()=>{
        setState(prevState => ({
          ...prevState,
          currentPage : state.currentPage+1
      }))
    }

        let indexOfLastData='';
        let indexOfFirstData = '';
        let currentData = '';

  const redirectToAddMeeting = ()=>{
    history.push('/addmeeting')
  }

  const redirectToUserList = (props)=>{
    history.push('/userslist/'+props.m_id)
  }

  const redirectToQuestionList = (props)=>{
    history.push('/questionlist/'+props.m_id)
  }

  const redirectToUploadUserList = ()=>{
    history.push('/addusers')
  }

  const redirectToUploadQuestionList = ()=>{
    history.push('/addquestion')
  }
  const redirectToEditMeeting = (props)=>{
    history.push('/editmeeting/'+props.m_id)
  }



  function UserUploadButton(){
    return <div>Not Uploaded</div>;
    //return <button onClick={()=>redirectToUploadUserList()} className="bg-red-500  text-white font-bold py-2 px-4 rounded-full">{t('MeetingList.UploadButton')}</button>;

  }

  function UserViewButton(props){
    return <button onClick={()=>redirectToUserList(props.item)} className="group relative w-half flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out">{t('MeetingList.ViewButton')} &nbsp;<AiFillEye className="adjust-pos"/></button>;
  }

  function QuestionUploadButton(){
    return <div>Not Uploaded</div>
    //return <button onClick={()=>redirectToUploadQuestionList()} className="bg-red-500  text-white font-bold py-2 px-4 rounded-full">{t('MeetingList.UploadButton')}</button>;
  }



  function QuestionViewButton(props) {
    return <button onClick={()=>redirectToQuestionList(props.item)} className="group relative w-half flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out">{t('MeetingList.ViewButton')}&nbsp; <AiFillEye className="adjust-pos"/> </button> ;
  }

  console.log('currentData::'+JSON.stringify(data));
  // Logic for displaying page numbers
	const pageNumbers = [];
	for (let i = 1; i <= Math.ceil(data.length / state.dataPerPage); i++) {
	pageNumbers.push(i);
	}

	indexOfLastData = state.currentPage * state.dataPerPage;
	indexOfFirstData = indexOfLastData - state.dataPerPage;
	currentData = data.slice(indexOfFirstData, indexOfLastData);


  if(isLoading){
	  return <Loader />
  }
  else{
  return (


    <div className="min-h-screen flex bg-blk-300   flex-col">
  <div className="container mx-auto px-4">
  <div className="lg:text-center">

      <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
      {t('MeetingList.FormHeadingText')}
      </h3>
    </div>

  <div  className={hideFeature?'hidden':'flex justify-end'}>
  <button onClick={()=>redirectToAddMeeting()} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mr-8 rounded inline-flex items-center">
  <span>{t('MeetingList.AddMeeting')}</span>
  </button>
  <div></div>
  </div>

    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">


             <table className="min-w-full divide-y divide-gray-200">
               <thead >
                 <tr>

                   <th className="px-6 py-3 app_theme_background text-left text-xl leading-4 font-medium text-white  tracking-wider">
                     {t('MeetingList.Name')}
                   </th>
                   <th className="px-6 py-3 app_theme_background text-left text-xl leading-4 font-medium text-white  tracking-wider">
                     {t('MeetingList.Time')}
                   </th>

                   <th className="px-6 py-3 app_theme_background text-left text-xl leading-4 font-medium text-white  tracking-wider">
                     {t('MeetingList.Users')}
                   </th>
                   <th className="px-6 py-3 app_theme_background text-left text-xl leading-4 font-medium text-white  tracking-wider">{t('MeetingList.Questions')}</th>

                   <th className={hideFeature?'hidden':'px-6 py-3 app_theme_background text-left text-xl leading-4 font-medium text-white  tracking-wider'} >{t('MeetingList.Action')}</th>


                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
               {currentData && currentData.map((item,i) => (
                 <tr key={i}>

                   <td className="px-6 py-4 whitespace-no-wrap">
                     <div className="text-sm leading-5 text-black text-lg">{item.m_name}</div>
                   </td>

                   <td className="px-6 py-4 whitespace-no-wrap">
                     <span className="px-2 inline-flex text-lg leading-5 font-semibold rounded-full text-black">
                       {item.m_date}
                     </span>
                   </td>

                   <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-lg text-black">

                 {item.m_userExist?<UserViewButton item ={item}/>:<UserUploadButton item ={item} />}
                   </td>

                   <td className="px-6 py-4 whitespace-no-wrap">

                   {item.m_questionsExist?<QuestionViewButton item ={item}/>:<QuestionUploadButton item ={item} />}

                   </td>

                   <td className={hideFeature?'hidden':'block px-6 py-4 whitespace-no-wrap'}>
                     <button onClick={()=>redirectToEditMeeting(item)} className="group relative w-half flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out">{t('MeetingList.EditButton')} &nbsp;<span className="adjust-pos"><AiOutlineEdit /></span></button>
                   </td>
                 </tr>
               ))}
               </tbody>
             </table>



      </div>

	  <ul className="flex pl-0 list-none rounded my-2 justify-center mt-5">


		<li onClick={handlePrev} className={state.currentPage==1?'hidden':'relative hand-cursor block py-2 px-3 leading-tight bg-indigo-500 border border-gray-300 text-white border-r-0 ml-0 rounded-l hover:bg-indigo-600'} >Previous</li>

		 {pageNumbers && pageNumbers.map(number => (
		            <li className={number===state.currentPage?'relative hand-cursor block py-2 px-3 leading-tight border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200 bg-gray-400':'relative hand-cursor block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200'}
              key={number}
              id={number}
			   onClick={handleClick}
            >
			{number}
            </li>
		 ))}

		<li onClick={handleNext} className={pageNumbers.length===state.currentPage?'hidden':'relative hand-cursor block py-2 px-3 leading-tight bg-indigo-500 border border-gray-300 text-white border-r-0 ml-0 rounded-l hover:bg-indigo-600'}>Next</li>
	</ul>
    </div>
  </div>
</div>

);
  }
}
export default withRouter(MeetingList);
