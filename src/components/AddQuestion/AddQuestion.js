import React, { useState, useEffect } from 'react';
import { Link ,useHistory} from 'react-router-dom';
import axios from 'axios';
import {API_BASE_URL} from '../../constants/apiConstant';
import { withRouter } from "react-router-dom";
import datajson from '../data/data'
function AddQuestion(props) {
  const [data, setData] = useState({ hits: [] });
  let history = useHistory();

  // useEffect(() => {
  //   // GET request using axios inside useEffect React hook
  //   axios.get(API_BASE_URL+'assets/qn.json')
  //   .then(response => setData(response));
  //
  //   // empty dependency array means this effect will only run once (like componentDidMount in classes)
  // }, []);

  const redirectToHome = ()=>{
    history.push('/meetinglist')
  }

      const handleChange = (e) => {
        /*   const {id , value} = e.target
           setState(prevState => ({
               ...prevState,
               [id] : value
           }))*/
       }

       const handleSubmitClick = (e) => {

        /*  axios.post(API_BASE_URL+'login', payload)
              .then(function (response) {
                  if(response.data.code === 200){
                      setState(prevState => ({
                          ...prevState,
                          'successMessage' : 'Login successful. Redirecting to home page..'
                      }))
                      redirectToHome();
                      props.showError(null)
                  }
                  else if(response.data.code === 204){
                      props.showError("Username and password do not match");
                  }
                  else{
                      props.showError("Username does not exists");
                  }
              })
              .catch(function (error) {
                  console.log(error);
              });*/
      }



  return (
    <div className="min-h-screen flex bg-blk-300   flex-col">
  <div className="container mx-auto px-4">
  <div className="lg:text-center">

      <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
      Upload Questions
      </h3>
      <p className="mt-4 max-w-2xl text-xl leading-7 text-black lg:mx-auto">
        Please choose csv file from your computer and upload
      </p>
    </div>

  <div className="flex justify-end">
  <button  onClick={()=>redirectToHome()} className="bg-gray-600 hover:bg-grey text-white  font-bold py-2 px-4 mr-8 rounded inline-flex items-center">
  <span>Back To Home</span>
  </button>
  <div></div>
  </div>

    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
      <form className="mt-8">
        <div className="rounded-md shadow-sm">
          <div>

            <input aria-label="CSV Upload" name="file" type="file" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Email address" id="email"
            onChange={handleChange} type="file" id="myFile" / >
          </div>

        </div>


        <div className="mt-6">
          <button type="submit"   onClick={handleSubmitClick} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-black hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
              Upload
          </button>
        </div>
      </form>
      </div>
    </div>
  </div>
</div>

);
}
export default withRouter(AddQuestion);
