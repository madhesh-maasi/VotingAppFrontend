import axios from 'axios';

const axiosConfig = axios.create({
  baseURL:'http://3.138.200.18/api/'
})
// Add a request interceptor
axiosConfig.interceptors.request.use(function (config) {
  // axios.default.headers.common['content-type'] = 'multipart/form-data';
    let token = sessionStorage.getItem('auth_token');
    if(token){
      config.headers.Authorization =  'Bearer '+token;
    }
    else{
      delete axios.defaults.headers.common['Authorization']
    }
    return config;
  },function(error){
  return Promise.reject(error)
});

// Add a response interceptor
axiosConfig.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // if(error.response.status==401){
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  });

export default axiosConfig;
