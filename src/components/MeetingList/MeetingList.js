import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axiosConfig from "../../config/axiosConfig";
import Loader from "../Loader/Loader";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AiOutlineEdit,
  AiFillEye,
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineExport,
  AiOutlineDownload,
} from "react-icons/ai";
import "./MeetingList.css";
import { useDispatch, useSelector } from "react-redux";
import { store } from "./../../redux/store";
import moment from "moment";

const baseURL = "http://3.138.200.18/api/";

function MeetingList(props) {
  /*const loginInfo = store.getState();
  const userId = loginInfo.loginReducer.userId;
  const role = loginInfo.loginReducer.role;*/

  const loginInfo = JSON.parse(sessionStorage.getItem("user_info"));
  const userId = loginInfo.userId;
  const role = loginInfo.role;

  //console.log('role',role);
  const [hideFeature, setHideFeature] = useState(
    role === "MeetingOwner" ? true : false
  );
  //   console.log('hideFeature',hideFeature);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [nameToSearch, setnameToSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const [ascendingOrderDateTime, setAscendingOrderDateTime] = useState(true);
  let history = useHistory();

  const [state, setState] = useState({
    currentPage: 1,
    pageNumber: 1,
    dataPerPage: 5,
  });

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  let indexOfLastData = "";
  let indexOfFirstData = "";
  let currentData = "";
  let filtered_data = "";

  indexOfLastData = state.currentPage * state.dataPerPage;
  indexOfFirstData = indexOfLastData - state.dataPerPage;

  currentData =
    nameToSearch !== ""
      ? filteredData.slice(indexOfFirstData, indexOfLastData)
      : data.slice(indexOfFirstData, indexOfLastData);

  const filterText = (e) => {
    setnameToSearch(e.target.value);
    var search = new RegExp(e.target.value, "i"); // prepare a regex object

    filtered_data = data.filter((item) => search.test(item.m_name));
    setFilteredData(filtered_data);
    setState((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));

    let pages = [];
    for (
      let i = 1;
      i <= Math.ceil(filtered_data.length / state.dataPerPage);
      i++
    ) {
      pages.push(i);
    }
    setPageNumbers(pages);
  };

  const sortAscending = () => {
    let sortedDataAsc;
    let field = "m_name";
    sortedDataAsc = data.sort((a, b) =>
      (a[field] || "").toString().localeCompare((b[field] || "").toString())
    );
    setData(sortedDataAsc);
    setAscendingOrder(false);
  };

  const sortDescending = () => {
    let sortedDataDesc;
    let field = "m_name";
    sortedDataDesc = data.sort((a, b) =>
      (b[field] || "").toString().localeCompare((a[field] || "").toString())
    );
    setData(sortedDataDesc);
    setAscendingOrder(true);
  };

  const sortAscendingDateTime = () => {
    let sortedDataAsc;
    let field = "m_date";
    sortedDataAsc = data.sort((a, b) =>
      moment(a[field]).diff(moment(b[field]))
    );
    setData(sortedDataAsc);
    setAscendingOrderDateTime(false);
  };

  const sortDescendingDateTime = () => {
    let sortedDataDesc;
    let field = "m_date";
    sortedDataDesc = data.sort((a, b) =>
      moment(b[field]).diff(moment(a[field]))
    );
    setData(sortedDataDesc);
    setAscendingOrderDateTime(true);
  };

  useEffect(() => {
    let pages = [];
    for (let i = 1; i <= Math.ceil(data.length / state.dataPerPage); i++) {
      pages.push(i);
    }
    setPageNumbers(pages);
  }, [data]);

  const { t, i18n } = useTranslation();
  useEffect(() => {
    // GET request using axios inside useEffect React hook
    axiosConfig
      .get("Meeting/allmeetinginfo?LoginUserId=" + userId)
      .then((response) => {
        // console.log('data::',JSON.stringify(response))
        setIsLoading(false);
        setData(response.data);
      });

    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);

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

  const redirectToAddMeeting = () => {
    history.push("/addmeeting");
  };

  const redirectToUserList = (props) => {
    history.push("/userslist/" + props.m_id);
  };

  const redirectToQuestionList = (props) => {
    history.push(
      "/questionlist/" + props.m_id + "/" + props.m_meeting_completed
    );
  };

  const redirectToUploadUserList = () => {
    history.push("/addusers");
  };

  const redirectToUploadQuestionList = () => {
    history.push("/addquestion");
  };
  const redirectToEditMeeting = (props) => {
    history.push("/editmeeting/" + props.m_id);
  };

  const redirectToExportList = (props) => {
    let languageId = parseInt(sessionStorage.getItem("languageId"));
    window.open(
      baseURL +
        "Meeting/download/report?meetingId=" +
        props.m_id +
        "&languageId=" +
        languageId,
      "_blank"
    );
  };

  function UserUploadButton() {
    return <div>Not Uploaded</div>;
    //return <button onClick={()=>redirectToUploadUserList()} className="bg-red-500  text-white font-bold py-2 px-4 rounded-full">{t('MeetingList.UploadButton')}</button>;
  }

  function UserViewButton(props) {
    return (
      <button
        onClick={() => redirectToUserList(props.item)}
        className="group relative w-half flex justify-center py-1 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out"
      >
        {t("MeetingList.ViewButton")} &nbsp;
        <AiFillEye className="adjust-pos" />
      </button>
    );
  }

  function QuestionUploadButton() {
    return <div>Not Uploaded</div>;
    //return <button onClick={()=>redirectToUploadQuestionList()} className="bg-red-500  text-white font-bold py-2 px-4 rounded-full">{t('MeetingList.UploadButton')}</button>;
  }

  function QuestionViewButton(props) {
    return (
      <button
        onClick={() => redirectToQuestionList(props.item)}
        className="group relative w-half flex justify-center py-1 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out"
      >
        {t("MeetingList.ViewButton")}&nbsp; <AiFillEye className="adjust-pos" />{" "}
      </button>
    );
  }

  function ExportButton(props) {
    return (
      <button
        onClick={() => redirectToExportList(props.item)}
        className="group relative w-half flex justify-center py-1 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out"
      >
        {t("MeetingList.DownloadButton")}&nbsp;{" "}
        <AiOutlineDownload className="adjust-pos" />{" "}
      </button>
    );
  }

  return (
    <div className="min-h-screen flex bg-blk-300 flex-col">
      <Loader isLoading={isLoading} />
      <div className="container mx-auto px-4">
        <div className="lg:text-center">
          <h3 className="lg:text-3xl leading-8 font-semibold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
            {t("MeetingList.FormHeadingText")}
          </h3>
        </div>

        <div className={hideFeature ? "hidden" : "flex justify-between mt-5"}>
          <div className="col-span-3 lg:col-span-1 ml-10">
            <input
              type="text"
              className="border-solid border-gray-600 border p-1 md:text-md"
              id="Name"
              onChange={filterText}
              type="text"
              value={nameToSearch}
              placeholder="Search Meeting name"
            />
          </div>
          <button
            onClick={() => redirectToAddMeeting()}
            className="bg-indigo-500 text-white  lg:mr-8 font-medium py-1 px-4  rounded inline-flex items-center"
          >
            <span>{t("MeetingList.AddMeeting")}</span>
          </button>
        </div>

        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <table className="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden my-5">
            <thead className="desktop">
              <tr>
                <th className="px-2 py-3  text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("MeetingList.CompanyName")}
                </th>

                <th className="px-2 py-3  text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("MeetingList.MeetingLink")}
                </th>

                <th className="px-2 py-3  text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("MeetingList.Name")} &nbsp;
                  <AiOutlineArrowUp
                    className={ascendingOrder ? "hidden" : ""}
                    onClick={sortDescending}
                  />{" "}
                  <AiOutlineArrowDown
                    className={!ascendingOrder ? "hidden" : ""}
                    onClick={sortAscending}
                  />
                </th>
                <th className="px-2 py-3  text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("MeetingList.Time")} &nbsp;
                  <AiOutlineArrowUp
                    className={ascendingOrderDateTime ? "hidden" : ""}
                    onClick={sortDescendingDateTime}
                  />{" "}
                  <AiOutlineArrowDown
                    className={!ascendingOrderDateTime ? "hidden" : ""}
                    onClick={sortAscendingDateTime}
                  />
                </th>

                <th className="px-2 py-3  text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("MeetingList.Users")}
                </th>
                <th className="px-2 py-3  text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("MeetingList.Questions")}
                </th>

                <th
                  className={
                    hideFeature
                      ? "hidden"
                      : "px-2 py-3  text-left text-xl leading-4 font-medium text-white  tracking-wider"
                  }
                >
                  {t("MeetingList.Action")}
                </th>
              </tr>
            </thead>

            <tbody className="flex-1 sm:flex-none">
              {currentData &&
                currentData.map((item, i) => (
                  <tr
                    key={i}
                    className="flex flex-col flex-no wrap mt-4 sm:table-row "
                  >
                    <td className="p-1 text-left text-white bg-gray-600 lg:hidden md:hidden">
                      {t("MeetingList.CompanyName")}
                    </td>
                    <td className="p-1 text-left text-white bg-gray-600 lg:hidden md:hidden">
                      {t("MeetingList.MeetingLink")}
                    </td>
                    <td className="border-grey-light border hover:bg-gray-100 p-3">
                      {" "}
                      {item.m_company}
                    </td>
                    <td className="border-grey-light border hover:bg-gray-100 p-3">
                      {" "}
                      {item.m_link}
                    </td>

                    <td className="p-1 text-left text-white bg-gray-600 lg:hidden md:hidden">
                      {t("MeetingList.Name")}
                    </td>
                    <td className="border-grey-light border hover:bg-gray-100 p-3">
                      {" "}
                      {item.m_name}
                    </td>

                    <td className="p-1 text-left text-white bg-gray-600 lg:hidden md:hidden">
                      {t("MeetingList.Time")}
                    </td>
                    <td className="border-grey-light border hover:bg-gray-100 p-3">
                      {" "}
                      {moment(item.m_date).format("DD-MM-YYYY HH:mm:ss")}
                    </td>
                    <td className="p-1 text-left bg-gray-600 text-white lg:hidden md:hidden">
                      {t("MeetingList.Users")}
                    </td>

                    <td className="border-grey-light border hover:bg-gray-100 p-3">
                      {item.m_userExist ? (
                        <UserViewButton item={item} />
                      ) : (
                        <UserUploadButton item={item} />
                      )}
                    </td>
                    <td className="p-1 text-left bg-gray-600 text-white lg:hidden md:hidden">
                      {t("MeetingList.Questions")}
                    </td>
                    <td className="border-grey-light border hover:bg-gray-100 p-3">
                      {item.m_questionsExist ? (
                        <QuestionViewButton item={item} />
                      ) : (
                        <QuestionUploadButton item={item} />
                      )}
                    </td>

                    <td className="p-1 text-left bg-gray-600 text-white lg:hidden md:hidden">
                      {t("MeetingList.Action")}
                    </td>
                    <td
                      className={
                        hideFeature
                          ? "hidden"
                          : "border-grey-light border hover:bg-gray-100 p-3"
                      }
                    >
                      {item.m_meeting_completed ? (
                        <ExportButton item={item} />
                      ) : (
                        <button
                          onClick={() => redirectToEditMeeting(item)}
                          className="group relative w-half flex justify-center py-1 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out"
                        >
                          {t("MeetingList.EditButton")} &nbsp;
                          <span className="adjust-pos">
                            <AiOutlineEdit />
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

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
                      ? "relative hand-cursor block py-2 px-3 leading-tight border border-gray-300 text-white border-r-0 bg-gray-800"
                      : "relative hand-cursor block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0"
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
export default withRouter(MeetingList);
