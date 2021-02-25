import * as t from './actionTypes';
import axios from 'axios';
import {API_BASE_URL} from './../constants/apiConstant';
// this is what our action should look like which dispatches the "payload" to reducer
const setLoginState = (loginData) => {
  return {
    type: t.SET_LOGIN_STATE,
    payload: loginData,
  };
};

export const login = (loginInput) => async dispatch => {

    let formData = new FormData();
    formData.append('UserName', loginInput.email);
    formData.append('Password', loginInput.password);

    const response = await axios.post(API_BASE_URL+'Login/userlogin', formData,{
         headers: {
         'content-type': 'multipart/form-data'
         }
       })
       .then(function (response) {
           if(response){
               sessionStorage.setItem("auth_token",response.data.token);
			   sessionStorage.setItem("user_info",JSON.stringify(response.data));
			   
             return response;
		   }
       })
       .catch(function (error) {
           return error;
       });
       
	return response;
  dispatch(setLoginState({...response.data}));
};
