import React, { useState, useEffect } from 'react';
import { Link ,useHistory,useParams} from 'react-router-dom';
import axiosConfig from '../../config/axiosConfig';
import { withRouter } from "react-router-dom";


function Pagiation(props) {

    let history = useHistory();
    const params = useParams();
	/* Pagiation start */

	 const [state , setState] = useState({
		  currentPage: 1,
		  pageNumber:1,
      dataPerPage: 5,
      data:[]
     });


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

	 // Logic for displaying current data
        let indexOfLastData='';
        let indexOfFirstData = '';
        let currentData = '';
	/* Pagiation end */

useEffect(() => {

},[]);

useEffect(() => {

},[props]);

  // Logic for displaying page numbers
	const pageNumbers = [];
	for (let i = 1; i <= Math.ceil(state.data.length / state.dataPerPage); i++) {
	pageNumbers.push(i);
	}

	indexOfLastData = state.currentPage * state.dataPerPage;
	indexOfFirstData = indexOfLastData - state.dataPerPage;
	currentData = props.data.slice(indexOfFirstData, indexOfLastData);


  return (
    <>
    <ul className="flex pl-0 list-none rounded my-2 justify-center mt-5">
		<li onClick={handlePrev} className="relative hand-cursor block py-2 px-3 leading-tight bg-indigo-500 border border-gray-300 text-white border-r-0 ml-0 rounded-l hover:bg-indigo-600">Previous</li>

		 {pageNumbers && pageNumbers.map(number => (
		            <li className="relative hand-cursor block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200"
              key={number}
              id={number}
			   onClick={handleClick}
            >
			{number}
            </li>
		 ))}

		<li onClick={handleNext} className="relative hand-cursor block py-2 px-3 leading-tight bg-indigo-500 border border-indigo-300 text-white rounded-r hover:bg-indigo-600">Next</li>
	</ul>
</>
);
}
export default withRouter(Pagiation);
