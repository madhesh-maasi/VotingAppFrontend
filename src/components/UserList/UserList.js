import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axiosConfig from "../../config/axiosConfig";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";
import { withRouter } from "react-router-dom";
import "./UserList.css";
import "./../../i18n";
import { useTranslation } from "react-i18next";

function UserList(props) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [state, setState] = useState({
    currentPage: 1,
    pageNumber: 1,
    dataPerPage: 5,
  });
  const { t, i18n } = useTranslation();
  const [ErorModalProps, setErrorModalProps] = useState({
    ModalShow: false,
    ModalTitle: "Error",
    ModalMessage: "something went wrong,please try after some time.",
  });

  const [SuccessModalProps, setSuccessModalProps] = useState({
    ModalShow: false,
    ModalTitle: "Success",
    ModalMessage: "Unique link send to users Successfully.",
  });
  const [uniqueLinBaseUrl, setUniqueLinBaseUrl] = useState(
    "http://3.138.200.18:81"
  );
  let history = useHistory();
  const params = useParams();

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  // Logic for displaying current data

  const handleClick = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      currentPage: parseInt(e.target.id),
    }));
  };

  const handlePrev = () => {
    if (state.currentPage === 1) return;

    let currentPageVal = parseInt(state.currentPage) - 1;

    setState((prevState) => ({
      ...prevState,
      currentPage: currentPageVal,
    }));
  };
  const handleNext = () => {
    let currentPageVal = parseInt(state.currentPage) + 1;
    setState((prevState) => ({
      ...prevState,
      currentPage: currentPageVal,
    }));
  };

  let indexOfLastData = "";
  let indexOfFirstData = "";
  let currentData = "";

  useEffect(() => {
    // // GET request using axios inside useEffect React hook
    axiosConfig
      .get("Meeting/meetingusersinfo?meetingID=" + params.id)
      .then((response) => {
        // console.log('data::',JSON.stringify(response))
        setData(response.data);
        setIsLoading(false);
      });

    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);

  const redirectToHome = () => {
    history.push("/meetinglist");
  };

  const UniqueLinktoUser = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axiosConfig
      .get("Meeting/SendMeetingInvitation?meetingId=" + params.id)
      .then(function (response) {
        setIsLoading(false);
        if (response) {
          setSuccessModalProps((prevState) => ({
            ...prevState,
            ModalShow: true,
          }));
          //  console.log('Link send Successfully',response);
        } else {
          setIsLoading(false);
          setErrorModalProps((prevState) => ({
            ...prevState,
            ModalShow: true,
          }));
          //  console.log('something went wrong');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / state.dataPerPage); i++) {
    pageNumbers.push(i);
  }

  indexOfLastData = state.currentPage * state.dataPerPage;
  indexOfFirstData = indexOfLastData - state.dataPerPage;
  currentData = data.slice(indexOfFirstData, indexOfLastData);

  return (
    <div className="min-h-screen flex bg-blk-300  flex-col">
      <Loader isLoading={isLoading} />
      <div className="container mx-auto px-4">
        <div className="lg:text-center">
          <h3 className="mt-2 lg:text-3xl leading-8 font-semibold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
            {t("UserList.Heading")}
          </h3>
        </div>

        <div className="flex justify-start ml-12  mt-5">
          <button
            onClick={() => redirectToHome()}
            className="bg-indigo-500 hover:bg-grey text-white font-medium py-1 px-4 mr-8 rounded inline-flex items-center"
          >
            <span>{t("VoteApp.BacktoHome")}</span>
          </button>
        </div>

        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <table className="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden my-5">
            <thead className="desktop">
              <tr>
                <th className="px-6 py-3 text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("UserList.UserName")}
                </th>
                <th className="px-6 py-3 text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("UserList.Email")}
                </th>

                <th className="px-6 py-3 text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("UserList.UniqueLink")}
                </th>

                <th className="px-6 py-3 text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("UserList.ContactNo")}
                </th>
              </tr>
            </thead>

            <tbody className="flex-1 sm:flex-none">
              {currentData &&
                currentData.map((item, i) => (
                  <tr
                    key={i}
                    className="flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0"
                  >
                    <td className="p-1 text-left text-white bg-gray-600 lg:hidden md:hidden">
                      {t("UserList.UserName")}
                    </td>
                    <td className="border-grey-light border hover:bg-gray-100 p-3">
                      {" "}
                      {item.user_name}
                    </td>
                    <td className="p-1 text-left text-white bg-gray-600 lg:hidden md:hidden">
                      {t("UserList.Email")}
                    </td>
                    <td className="border-grey-light border hover:bg-gray-100 p-3">
                      {" "}
                      {item.email}
                    </td>
                    <td className="p-1 text-left text-white bg-gray-600 lg:hidden md:hidden">
                      {t("UserList.UniqueLink")}
                    </td>
                    <td className="border-grey-light uniquelink border hover:bg-gray-100 p-3">
                      {uniqueLinBaseUrl + "/users/" + item.unique_link}
                    </td>

                    <td className="p-1 text-left text-white bg-gray-600 lg:hidden md:hidden">
                      {t("UserList.ContactNo")}
                    </td>
                    <td className="border-grey-light border hover:bg-gray-100 p-3">
                      {item.contact_number}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <Modal
            Message={ErorModalProps.ModalMessage}
            open={ErorModalProps.ModalShow}
            Title={ErorModalProps.ModalTitle}
          />
          <Modal
            Message={SuccessModalProps.ModalMessage}
            open={SuccessModalProps.ModalShow}
            Title={SuccessModalProps.ModalTitle}
          />
          <div className="flex justify-end">
            <button
              onClick={UniqueLinktoUser}
              className="group relative w-26 flex justify-center py-1 px-6 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out mr-8"
            >
              <span> {t("UserList.SendLink")}</span>
            </button>
          </div>

          <ul className="flex pl-0 list-none rounded my-2 justify-center mt-5">
            <li
              onClick={handlePrev}
              className={
                parseInt(state.currentPage) === 1
                  ? "hidden"
                  : "relative hand-cursor block py-2 px-3 leading-tight bg-indigo-500 border border-gray-300 text-white border-r-0 ml-0 rounded-l hover:bg-indigo-600"
              }
            >
              Previous
            </li>

            {pageNumbers &&
              pageNumbers.map((number) => (
                <li
                  className={
                    parseInt(number) === parseInt(state.currentPage)
                      ? "relative hand-cursor block py-2 px-3 leading-tight border border-gray-300 text-white border-r-0  bg-gray-800"
                      : "relative hand-cursor block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200"
                  }
                  key={number}
                  id={number}
                  onClick={handleClick}
                >
                  {number}
                </li>
              ))}

            <li
              onClick={handleNext}
              className={
                parseInt(pageNumbers.length) === parseInt(state.currentPage)
                  ? "hidden"
                  : "relative hand-cursor block py-2 px-3 leading-tight bg-indigo-500 border border-gray-300 text-white border-r-0 ml-0 rounded-r hover:bg-indigo-600"
              }
            >
              Next
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default withRouter(UserList);
