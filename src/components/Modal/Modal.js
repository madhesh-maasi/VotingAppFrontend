import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';

export default function Modal(props) {

  //console.log('props',props);
const [showModal, setShowModal] = useState(false);
let history = useHistory();

  useEffect(() => {
    let modalOpen = false;
    if(props.open) {
      modalOpen = true;
    }

    setShowModal(modalOpen);
    //console.log('modalOpen',modalOpen);
  },[props])

  const nullifyModalInfo = (e)=>{
    setShowModal(false);	

    if(props.RedirectUrl){
    history.push(props.RedirectUrl);
	}
    props = null;
	
  }


  return (
    <>
    {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            onClick={nullifyModalInfo}
          ></div>

		  <div className="fixed z-10 inset-0 overflow-y-auto">
  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>

    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">

          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-xl leading-6 font-medium text-gray-900" id="modal-headline">
              {props.Title}
            </h3>
            <div className="mt-2">
              <p className="text-lg text-black">
                {props.Message}
              </p>
            </div>
          </div>
        </div>
      </div>

	  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">

        <button type="button" onClick={nullifyModalInfo} className="mt-3 hand_cursor w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
          Close
        </button>
      </div>

    </div>
  </div>
</div>



                    </>
      ) : null}
    </>
  );
}
