import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import axiosConfig from "../../config/axiosConfig";
import { withRouter } from "react-router-dom";
import "./QuestionList.css";

import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";

function QuestionList(props) {
  const [data, setData] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState([]);
  let history = useHistory();
  const params = useParams();
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
    console.log("value", e.target.id);
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      currentPage: e.target.id,
    }));
  };

  const handlePrev = () => {
    if (state.currentPage === 1) return;

    setState((prevState) => ({
      ...prevState,
      currentPage: state.currentPage - 1,
    }));
  };
  const handleNext = () => {
    setState((prevState) => ({
      ...prevState,
      currentPage: state.currentPage + 1,
    }));
  };

  // Logic for displaying current data
  let indexOfLastData = "";
  let indexOfFirstData = "";
  let currentData = "";
  /* Pagiation end */

  const ShowResult = (props, i) => {
    let ShowResultParams = {
      meetingId: null,
      questionId: null,
      question: props.question,
      showresult: true,
    };
    ShowResultParams.meetingId = params.id;
    ShowResultParams.questionId = props.qn_no;
    console.log("showResult", ShowResultParams);
    hubconnection.invoke("showresult", ShowResultParams);
  };

  const CompletePoll = () => {
    hubconnection.invoke("completepoll", { completepoll: true });
  };

  // adding the function
  const releaseQuestion = (props, i) => {
    console.log("index", i);
    console.log("disabledButtons", disabledButtons);
    hubconnection.invoke("releasequestion", props);
    disabledButtons[i] = true;
    setDisabledButtons((prevState) => ({
      ...prevState,
      i: true,
    }));
  };

  useEffect(() => {
    // GET request using axios inside useEffect React hook

    axiosConfig
      .get("Meeting/meetingquestionsinfo?meetingID=" + params.id)
      .then((response) => {
        // console.log('data::',JSON.stringify(response))
        setData(response.data);
        const disabledButtons = new Array(response.data.length).fill(false);
        setDisabledButtons(disabledButtons);

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
    //sendQuesionToServer();
  }, []);

  const redirectToHome = () => {
    history.push("/meetinglist");
  };

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / state.dataPerPage); i++) {
    pageNumbers.push(i);
  }

  indexOfLastData = state.currentPage * state.dataPerPage;
  indexOfFirstData = indexOfLastData - state.dataPerPage;
  currentData = data.slice(indexOfFirstData, indexOfLastData);

  return (
    <>
      <div className="min-h-screen flex bg-blk-300   flex-col">
        <div className="container mx-auto px-4">
          <div className="lg:text-center">
            <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              Questions
            </h3>
            <p className="mt-4 max-w-2xl text-xl leading-7 text-black lg:mx-auto">
              Note: Release question one by one on voting time
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => redirectToHome()}
              className="bg-gray-600 hover:bg-grey text-white font-bold py-2 px-4 mr-8 rounded inline-flex items-center"
            >
              <span>Back to Home</span>
            </button>
            <div></div>
          </div>

          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 app_theme_background text-left text-xl leading-4 font-medium text-white  tracking-wider">
                      Question
                    </th>

                    <th className="px-6 py-3 app_theme_background text-left text-xl leading-4 font-medium text-white  tracking-wider">
                      Time to Answer
                    </th>
                    <th className="px-6 py-3 app_theme_background text-left text-xl leading-4 font-medium text-white  tracking-wider">
                      Options
                    </th>
                    <th className="px-10 py-3 app_theme_background text-left text-xl leading-4 font-medium text-white  tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData &&
                    currentData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-no-wrap">
                          <div className="text-sm leading-5 text-black text-lg">
                            {item.question}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-no-wrap">
                          <span className="px-2 inline-flex text-lg leading-5 font-semibold rounded-full text-black">
                            {item.timeToAnswer} seconds
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-lg text-black">
                          {item.optionsarray.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </td>

                        <td className="px-0 py-4">
                          <div className="grid gap-4 grid-cols-2">
                            <button
                              disabled={disabledButtons[index] ? "" : ""}
                              onClick={() => releaseQuestion(item, index)}
                              className={
                                disabledButtons[index]
                                  ? "group relative w-18 flex h-10 justify-center py-2 px-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-600 focus:outline-none   transition duration-150 ease-in-out"
                                  : "group relative w-18 flex h-10 justify-center py-2 px-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 focus:outline-none   transition duration-150 ease-in-out"
                              }
                            >
                              {disabledButtons[index] ? "Released" : "Release"}
                            </button>
                            <button
                              onClick={() => ShowResult(item, index)}
                              className="group relative w-24 flex justify-center py-2 px-2 border border-transparent h-10 text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out"
                            >
                              Show Result
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => CompletePoll()}
              className="group relative w-24 flex justify-center py-2 px-2 border border-transparent h-10 text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out mr-8"
            >
              <span>End Poll</span>
            </button>
          </div>

          <ul className="flex pl-0 list-none rounded my-2 justify-center mt-5">
            <li
              onClick={handlePrev}
              className="relative hand-cursor block py-2 px-3 leading-tight bg-indigo-500 border border-gray-300 text-white border-r-0 ml-0 rounded-l hover:bg-indigo-600"
            >
              Previous
            </li>

            {pageNumbers &&
              pageNumbers.map((number) => (
                <li
                  className="relative hand-cursor block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200"
                  key={number}
                  id={number}
                  onClick={handleClick}
                >
                  {number}
                </li>
              ))}

            <li
              onClick={handleNext}
              className="relative hand-cursor block py-2 px-3 leading-tight bg-indigo-500 border border-indigo-300 text-white rounded-r hover:bg-indigo-600"
            >
              Next
            </li>
          </ul>

          <div></div>
        </div>
      </div>
    </>
  );
}
export default withRouter(QuestionList);
