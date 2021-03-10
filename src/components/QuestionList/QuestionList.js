import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import axiosConfig from "../../config/axiosConfig";
import { withRouter } from "react-router-dom";
import "./QuestionList.css";
import Loader from "../Loader/Loader";
import "./QuestionList.css";
import "./../../i18n";
import { useTranslation } from "react-i18next";

import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";

function QuestionList(props) {
  const [data, setData] = useState([]);
  const [allQuestion, setAllQuestion] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [disabledButtons2, setDisabledButtons2] = useState([]);
  const [completePoll, setCompletePoll] = useState({
    isCompleted: false,
    meetingId: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  let history = useHistory();
  const params = useParams();
  const { t, i18n } = useTranslation();
  // const [question, setQuestion] = useState([]);
  // const [question2, setQuestion2] = useState([]);
  const [endpoint, setEndPoint] = useState("http://3.138.200.18/chatHub");
  const [hubconnection, setConnection] = useState();

  /* Pagiation start */

  const [state, setState] = useState({
    currentPage: 1,
    pageNumber: 1,
    dataPerPage: 3,
  });

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

  // Logic for displaying current data
  let indexOfLastData = "";
  let indexOfFirstData = "";
  let currentData = "";
  /* Pagiation end */

  const ShowResult = (props, i) => {
    let language_props = {
      english: props,
      swedish: allQuestion[1]["questions"][i],
    };
    let qnToDisable = props.qn_no;
    let ShowResultParams = {
      meetingId: null,
      questionId: null,
      question: language_props,
      showresult: true,
    };
    ShowResultParams.meetingId = params.id;
    ShowResultParams.questionId = props.qn_no;
    console.log("showResult", ShowResultParams);
    hubconnection.invoke("showresult", ShowResultParams);

    disabledButtons2[qnToDisable] = true;
    setDisabledButtons2((prevState) => ({
      ...prevState,
      qnToDisable: true,
    }));

    //console.log('disabledShowResultButtons',disabledShowResultButtons);
  };

  const CompletePoll = () => {
    let obj = { completepoll: true, meetingId: params.id };
    sessionStorage.setItem("completepoll", JSON.stringify(obj));
    hubconnection.invoke("completepoll", obj);
    setCompletePoll((prevState) => ({
      ...prevState,
      isCompleted: true,
      meetingId: params.id,
    }));
  };

  // adding the function
  const releaseQuestion = (props, i) => {
    let qnToDisable = props.qn_no;
    //console.log('index',i);
    //console.log('qnToDisable',qnToDisable);
    let language_props = {
      meetingId: params.id,
      english: props,
      swedish: allQuestion[1]["questions"][i],
    };

    // console.log('props',props);
    //console.log('allQuestion',allQuestion);
    // console.log('language_props',language_props);
    //  console.log('disabledButtons',disabledButtons);
    // console.log('allQuestion',JSON.stringify(allQuestion[1]['questions'][i]));
    hubconnection.invoke("releasequestion", language_props);

    disabledButtons[qnToDisable] = true;

    setDisabledButtons((prevState) => ({
      ...prevState,
      qnToDisable: true,
    }));
  };

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  useEffect(() => {
    // GET request using axios inside useEffect React hook

    let findPollEnd = JSON.parse(sessionStorage.getItem("completepoll"));

    console.log("findPollEnd", findPollEnd);

    setCompletePoll((prevState) => ({
      ...prevState,
      isCompleted:
        params.completed === "true" ||
        (findPollEnd !== null &&
          findPollEnd.completepoll &&
          findPollEnd.meetingId === params.id)
          ? true
          : false,
      meetingId: params.id,
    }));

    axiosConfig
      .get("Meeting/meetingquestionsinfo?meetingID=" + params.id)
      .then((response) => {
        // console.log('data::',JSON.stringify(response.data[0]['questions']))

        setIsLoading(false);
        setAllQuestion(response.data);
        setData(response.data[0]["questions"]);
        let resultLength = response.data.length + 1;
        const disabledButtons = new Array(resultLength).fill(false);
        const disabledButtons2 = new Array(resultLength).fill(false);
        setDisabledButtons(disabledButtons);
        setDisabledButtons2(disabledButtons2);

        //console.log('data::',JSON.stringify(response.data))

        const socketConnection = new HubConnectionBuilder()
          .configureLogging(LogLevel.Debug)
          .withUrl(endpoint, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
          })
          .build();

        socketConnection.start();
        setConnection(socketConnection);
      });

    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };

    //sendQuesionToServer();
  }, []);

  const redirectToHome = () => {
    history.push("/meetinglist");
  };

  //console.log('currentData::'+JSON.stringify(data));
  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / state.dataPerPage); i++) {
    pageNumbers.push(i);
  }

  indexOfLastData = state.currentPage * state.dataPerPage;
  indexOfFirstData = indexOfLastData - state.dataPerPage;
  currentData = data.slice(indexOfFirstData, indexOfLastData);

  return (
    <div className="min-h-screen flex bg-blk-300 flex-col">
      <Loader isLoading={isLoading} />
      <div className="container mx-auto px-4">
        <div className="lg:text-center">
          <h3 className="mt-2 lg:text-3xl leading-8 font-semibold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
            {t("QuestionList.Heading")}
          </h3>
          <p className="mt-4 max-w-2xl lg:text-md leading-7 text-red-700 text-right lg:ml-auto mr-6">
            {t("QuestionList.SubHeading")}
          </p>
        </div>

        <div className="flex justify-start ml-10">
          <button
            onClick={() => redirectToHome()}
            className="bg-indigo-500 mt-5  hover:bg-grey text-white font-medium py-1 px-4 lg:mr-8 rounded inline-flex items-center"
          >
            <span>{t("VoteApp.BacktoHome")}</span>
          </button>
        </div>

        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <table className="w-full flex flex-row flex-no-wrap sm:bg-white rounded-lg overflow-hidden  my-5">
            <thead className="desktop">
              <tr>
                <th className="px-6 py-3 text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("QuestionList.Question")}
                </th>
                <th className="px-6 py-3 text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("QuestionList.TimeToAnswer")}
                </th>

                <th className="px-6 py-3 text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("QuestionList.Options")}
                </th>

                <th className="px-6 py-3 text-left text-xl leading-4 font-medium text-white  tracking-wider">
                  {t("QuestionList.Action")}
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
                      {t("QuestionList.Question")}
                    </td>
                    <td className="border-grey-light border hover:bg-gray-100 p-3">
                      {" "}
                      {item.question}
                    </td>
                    <td className="p-1 text-left text-white bg-gray-600 lg:hidden md:hidden">
                      {t("QuestionList.TimeToAnswer")}
                    </td>
                    <td className="border-grey-light border hover:bg-gray-100 p-3">
                      {" "}
                      {item.timeToAnswer} seconds
                    </td>

                    <td className="p-1 text-left text-white bg-gray-600 lg:hidden md:hidden">
                      {t("QuestionList.Options")}
                    </td>
                    <td className="border-grey-light border hover:bg-gray-100 p-3">
                      {item.optionsarray &&
                        item.optionsarray.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                    </td>

                    <td className="p-1 text-left text-white bg-gray-600 lg:hidden md:hidden">
                      {t("QuestionList.Action")}
                    </td>
                    <td className="border-grey-light border hover:bg-gray-100 p-3">
                      <button
                        disabled={
                          disabledButtons[item.qn_no] ||
                          completePoll.isCompleted
                        }
                        onClick={() => releaseQuestion(item, i)}
                        className={
                          disabledButtons[item.qn_no] ||
                          completePoll.isCompleted
                            ? "py-2 px-4 float-left text-sm leading-5 w-full font-medium rounded-md text-white bg-gray-600 "
                            : "py-2 px-4 float-left text-sm leading-5 w-full font-medium rounded-md text-white bg-green-600 "
                        }
                      >
                        {disabledButtons[item.qn_no] || completePoll.isCompleted
                          ? t("QuestionList.Released")
                          : t("QuestionList.Release")}
                      </button>

                      <button
                        disabled={
                          disabledButtons2[item.qn_no] ||
                          completePoll.isCompleted
                        }
                        onClick={() => ShowResult(item, i)}
                        className={
                          disabledButtons2[item.qn_no] ||
                          completePoll.isCompleted
                            ? "py-2 px-4 float-right mt-5 w-full text-sm leading-5 font-medium rounded-md text-white  bg-gray-600 "
                            : "py-2 px-4 float-right mt-5 w-full text-sm leading-5 font-medium rounded-md text-white bg-green-600 "
                        }
                      >
                        {t("QuestionList.ShowResult")}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="flex justify-end">
            <button
              onClick={() => CompletePoll()}
              disabled={completePoll.isCompleted}
              className={
                completePoll.isCompleted
                  ? "group relative w-25 flex justify-center py-1 px-6 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition duration-150 ease-in-out mr-8"
                  : "group relative w-25 flex justify-center py-1 px-6 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out mr-8"
              }
            >
              <span>{t("QuestionList.EndPoll")}</span>
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
export default withRouter(QuestionList);
