import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import axiosConfig from "../../config/axiosConfig";
import useInterval from "./../../utilities/useInterval";
import { withRouter } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "./UserQuestionPage.css";
import "./../../i18n";
import { useTranslation } from "react-i18next";
import Modal from "../Modal/Modal";
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import moment from "moment";

function ShowChartToQuestionResponse(props) {
  ////console.log('ShowChartToQuestionResponse',props);

  const [chartData, setChartData] = useState({
    labels: ["Yes", "No", "Pass"],
    datasets: [
      {
        label: null,
        backgroundColor: ["green", "red", "blue"],
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 0,
        data: [65, 59, 80],
      },
    ],
  });

  const [options, setOptions] = useState({
    title: {
      display: true,
      text: props.question,
      fontSize: 20,
    },
    legend: {
      display: false,
      position: "right",
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          barPercentage: 0.4,
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
  });

  const getChartData = () => {
    // get user question answer response
    let data = {
      meetingId: props.meetingId,
      languageId: props.languageId,
      questionId: parseInt(props.questionId),
    };
    axiosConfig
      .post("Meeting/QuestionResponseResult", data)
      .then((response) => {
        // set uniquelink valid or not
        let data = response.data;
        //console.log('data',data.results);

        let labels_data = [];
        let percentage_data = [];

        for (const result of data.results) {
          let key_value = "";
          key_value = result["Key"] + " " + result["Value"];
          percentage_data.push(result["Value"]);

          labels_data.push(key_value);
        }

        ////console.log('labels:'+labels_data);
        ////console.log('percentage_data:'+percentage_data);

        setOptions((prevState) => ({
          ...prevState,
          title: {
            display: true,
            text: props.question,
            fontSize: 20,
          },
        }));
        setChartData((prevState) => ({
          ...prevState,
          labels: labels_data,
          datasets: [
            {
              label: null,
              backgroundColor: ["green", "red", "blue"],
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 0,
              data: percentage_data,
            },
          ],
        }));
      });
  };

  useEffect(() => {
    getChartData();
  }, [props]);

  return (
    <div className="flex items-center flex-col linear-bg justify-center">
      <div className="font-bold rounded-lg border shadow-lg bg-white p-10 mt-10 mb-10">
        <div className="bar_chart_css">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}

function CompletePoll(props) {
  ////console.log('props',props);

  const [summaryData, setSummaryData] = useState([]);
  const [voteCount, setVoteCount] = useState(0);
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [ModalProps, setModalProps] = useState({
    ModalShow: false,
    ModalTitle: "Summary Report Email",
    ModalMessage: "Summary Report send to your email successfully.",
  });

  const getSummaryData = () => {
    // get user question answer response
    let data = {
      meetingId: parseInt(props.meetingId),
      userId: parseInt(props.userId),
      languageId: parseInt(props.languageId),
    };
    axiosConfig.post("Meeting/summaryresult", data).then((response) => {
      // set uniquelink valid or not
      let data = response.data;

      let voteCountValue = data.filter(
        (obj) => !Object.values(obj).includes(null)
      );
      setVoteCount(voteCountValue.length);
      setSummaryData(data);
    });
  };

  const printSummary = (e) => {
    window.print();
  };

  const sendmail = (e) => {
    let data = {
      meetingId: parseInt(props.meetingId),
      userId: parseInt(props.userId),
      languageId: parseInt(props.languageId),
    };
    setIsLoading(true);
    axiosConfig
      .get("/meeting/send/summaryreport/mail?userId=" + parseInt(props.userId))
      .then((response) => {
        setModalProps((prevState) => ({
          ...prevState,
          ModalTitle: "Summary Report Email",
          ModalMessage: "Summary Report send to your email successfully.",
          ModalShow: true,
        }));
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false);
        setModalProps((prevState) => ({
          ...prevState,
          ModalTitle: "Error",
          ModalMessage:
            "Something went wrong, please try again after some time.",
          ModalShow: true,
        }));
      });
  };

  useEffect(() => {
    getSummaryData();
  }, []);

  return (
    <div className="flex items-center flex-col linear-bg justify-center min-h-screen">
      <Loader isLoading={isLoading} />
      <div className="font-bold container rounded-lg border shadow-lg p-10 bg-white mt-10 mb-10">
        <div className="font-semibold text-xl text-center">
          {t("PollPage.SummaryText1")}
        </div>
        <p className="text-red-400 lg:text-base font-medium text-center">
          {t("PollPage.SummaryText2")}
        </p>
        <br />
        <div className="user-detail blue-shadow">
          <div className="font-medium text-md flex">
            <div className="card-label">Name</div>
            <div className="card-dot">:</div>
            <div className="card-value"> {props.userInfo.fullName}</div>
          </div>
          <div className="font-medium text-md flex">
            <div className="card-label">Company Name</div>
            <div className="card-dot">:</div>{" "}
            <div className="card-value"> {props.userInfo.company}</div>
          </div>
          <div className="font-medium text-md flex">
            <div className="card-label"> Date</div>
            <div className="card-dot">: </div>{" "}
            <div className="card-value"> {props.userInfo.meetingDateTime}</div>
          </div>

          <div className="font-medium text-md flex">
            <div className="card-label"> Number of Votes</div>
            <div className="card-dot">: </div>{" "}
            <div className="card-value"> {voteCount}</div>
          </div>
        </div>

        <br />
        <div className="summary-qna">
          {summaryData.map((item, i) => (
            <div key={i} className="font-semibold text-md">
              {item.question}

              <p className="text-gray-800 dark:text-gray-400 text-base font-normal">
                Answer : &nbsp;{item.answer}
              </p>

              <br />
            </div>
          ))}
        </div>
        <div>
          <button
            type="button"
            onClick={() => sendmail()}
            className=" py-2 px-4 float-left text-sm leading-5 font-medium rounded-md text-white bg-green-600 "
          >
            {t("PollPage.SendMailBtn")}
          </button>
          <button
            type="button"
            onClick={() => printSummary()}
            className=" float-right py-2 px-4 text-sm leading-5 font-medium rounded-md text-white bg-green-600 "
          >
            {t("PollPage.PrintBtn")}
          </button>
        </div>
        <Modal
          Message={ModalProps.ModalMessage}
          open={ModalProps.ModalShow}
          Title={ModalProps.ModalTitle}
        />
      </div>
    </div>
  );
}

function LinkNotValidPage(props) {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-800 text-white font-bold rounded-lg border shadow-lg p-10">
        <div className="font-bold text-xl"> {t("PollPage.LinkNotValid")}</div>
      </div>
    </div>
  );
}

function UserAlreadyExist(props) {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-800 text-white font-bold rounded-lg border shadow-lg p-10">
        <div className="font-bold text-xl"> {t("PollPage.LinkAleadyUsed")}</div>
      </div>
    </div>
  );
}

function MeetingAlreadyStarted(props) {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-800 text-white font-bold rounded-lg border shadow-lg p-10">
        <div className="font-bold text-xl">
          {" "}
          {t("PollPage.MeetingAlreadyStarted")}
        </div>
      </div>
    </div>
  );
}
function UserQuestionPage(props) {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [question, setQuestion] = useState(null);
  const [resultResponse, setShowResult] = useState({
    meetingId: null,
    questionId: null,
    languageId: 1,
    showresult: false,
  });
  const [isPollCompleted, setCompletePoll] = useState(false);
  const [endpoint, setEndPoint] = useState("http://3.138.200.18/chatHub");
  const [isLinkValid, setIsLinkValid] = useState(null);
  const [isOtpValid, setIsOtpValid] = useState(null);
  const [isPollStarted, setIsPollStarted] = useState(false);
  const [userAnswer, setUserAnswer] = useState(undefined);
  const [otp, setOtp] = useState("");
  const [isVoteStored, setIsVoteStored] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const otpInput = useRef(null);

  const [seconds, setSeconds] = useState(10);
  const [done, setDone] = useState(false);
  const foo = useRef();

  const [state, setState] = useState({
    questionId: null,
    userAnswer: null,
    company: null,
    gentralMeetingLink: null,
    meetingDateTime: null,
    joiningTime: null,
    userId: null,
    meetingId: null,
    userLanguage: null,
    fullName: null,
    userSession: "allow",
  });

  const [hubconnection, setConnection] = useState();
  const [timeLeftToAnswer, setTimeLeftToAnswer] = useState(60);

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  useEffect(() => {
    if (seconds === 0) {
      clearInterval(foo.current);
      setDone(true);
    }
  }, [seconds]);

  useEffect(() => {
    //  GET request using axios inside useEffect React hook

    axiosConfig
      .get("meeting/join?meetingLink=" + params.uniquelink)
      .then((response) => {
        // set uniquelink valid or not
        let data = response.data;
        //console.log('data',data);
        setIsLoading(false);
        setState((prevState) => ({
          ...prevState,
          userId: data.response.userId,
          meetingId: data.response.meetingId,
          userLanguage: data.response.userLanguage,
          meetingDateTime: moment
            .utc(data.response.meetingDateTime)
            .format("DD-MM-YYYY hh:mm A"),
          joiningTime:
            moment
              .utc(data.response.meetingDateTime)
              .subtract({ minutes: 15 })
              .format("hh:mm A") +
            `-` +
            moment.utc(data.response.meetingDateTime).format("hh:mm A"),
          company: data.response.company,
          gentralMeetingLink: data.response.gentralMeetingLink,
        }));

        //console.log('data.response.userLanguage',data.response.userLanguage);
        //console.log('state',JSON.stringify(state));

        const socketConnection = new HubConnectionBuilder()
          .configureLogging(LogLevel.Debug)
          .withUrl(endpoint, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
          })
          .build();

        //socketConnection.start();

        socketConnection.start().then(() => {
          setConnection(socketConnection);
        });

        setConnection(socketConnection);

        // invoke user session

        socketConnection.on("usersessionresponse", function (res) {
          //console.log("usersessionresponse"+JSON.stringify(res));
          setState((prevState) => ({
            ...prevState,
            userSession: res,
          }));
        });

        // receive question

        socketConnection.on("changequestion", function (res) {
          setIsVoteStored(false);
          setQuestion(res);
          setUserAnswer(undefined);

          foo.current = setInterval(() => tick(), 1000);
          setDone(false);
          setSeconds(60);

          setShowResult((prevState) => ({
            ...prevState,
            showresult: false,
          }));

          setCompletePoll(false);
        });

        // show chart to users by receiving question response
        socketConnection.on("showresponse", function (res) {
          //console.log("showresponse"+JSON.stringify(res));
          setShowResult(res);
        });

        // end poll by receiving poll complete end button click
        socketConnection.on("pollcomplete", function (res) {
          //console.log("pollcomplete"+JSON.stringify(res));
          setCompletePoll(res.completepoll);
        });

        setIsLinkValid(data.isSuccess);

        window.addEventListener("beforeunload", alertUser);
        return () => {
          window.removeEventListener("beforeunload", alertUser);
        };
      });
  }, []);

  // focus otp input on each key stroke
  useEffect(() => {
    if (otp !== "") {
      otpInput.current.focus();
    }
  }, [otp]);

  const goToGeneralMeeting = (e) => {
    e.preventDefault();
    window.open(state.gentralMeetingLink, "_blank");
  };
  const handleChange = (e) => {
    // const {id , value} = e.target;
    setOtp(e.target.value);
    // setState(prevState => ({
    //     ...prevState,
    //     [id] : value
    // }))
  };

  const setUserVote = (value) => {
    setUserAnswer(value);
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("meetingId", state.meetingId);
    formData.append("userId", state.userId);
    formData.append("otp", otp);

    setIsLoading(true);
    axiosConfig
      .post("Meeting/validateotp", formData)
      .then(function (response) {
        //console.log('response'+JSON.stringify(response));
        // setIsOtpValid(true);
        let data = response.data;
        // console.log('response'+JSON.stringify(data));
        setIsLoading(false);
        setState((prevState) => ({
          ...prevState,
          fullName: data.firstName + " " + data.lastName,
        }));

        if (!response.data) {
          setIsOtpValid(false);
        } else {
          setIsOtpValid(true);
          hubconnection.invoke("usersession", response.data);
        }
      })
      .catch(function (error) {
        //console.log(error);
        setIsLoading(false);
      });
  };

  const answerQuestion = (e) => {
    e.preventDefault();

    clearInterval(foo.current); // clearInterval

    let questionInfo = question[state.userLanguage];
    let postData = {
      meetingId: state.meetingId,
      questionId: parseInt(questionInfo.qn_no),
      languageId: parseInt(questionInfo.languageId),
      userId: state.userId,
      userAnswer: userAnswer,
    };

    //console.log('userQuestionAnswer::'+postData);
    // setIsOtpValid(true);
    setIsLoading(true);
    axiosConfig
      .post("Meeting/StoreUserAnswer", postData)
      .then(function (response) {
        //setIsOtpValid(response.data);
        setIsVoteStored(true);
        setIsLoading(false);
        //console.log('response');
      })
      .catch(function (error) {
        //console.log(error);
        setIsLoading(false);
      });
  };

  function tick() {
    setSeconds((prevSeconds) => prevSeconds - 1);
  }

  function PollPage() {
    ////console.log('question',question[state.userLanguage])

    ////console.log('question',question[state.userLanguage])
    const quesobj = question[state.userLanguage];

    //quesobj.options = ['Yes','No','Pass']
    return (
      <>
        {done && (
          <div className="flex items-center flex-col linear-bg justify-center h-screen">
            <div className="font-bold container:sm question-cont rounded-lg border shadow-lg p-10">
              <div className="font-medium text-xl">
                {t("PollPage.TimeIsUp")}&nbsp; <b>{quesobj.question}</b>.
                {t("PollPage.WaitForAnotherQuestion")}&nbsp;{" "}
              </div>
            </div>
          </div>
        )}

        {isVoteStored && (
          <div className="flex items-center flex-col linear-bg justify-center h-screen">
            <div className="font-bold container:sm question-cont rounded-lg border shadow-lg p-10">
              <div className="font-medium text-xl">
                {" "}
                {t("PollPage.VoteStored")}&nbsp; <b>{quesobj.question}</b>.{" "}
                {t("PollPage.WaitForAnotherQuestion")}&nbsp;{" "}
              </div>
            </div>
          </div>
        )}
        {!isVoteStored && !done && (
          <div className="flex  lg:items-center flex-col linear-bg justify-center h-screen">
            <div className="font-medium text-red-400 mb-5 text-xl">
              {t("PollPage.TimeToAnswer")}&nbsp;: {seconds}{" "}
              {t("PollPage.Seconds")}&nbsp;
            </div>
            <div className="font-bold sm:container question-cont rounded-lg border shadow-lg p-10">
              <div className="font-semibold text-xl mb-5">
                {quesobj.question}
              </div>
              <form>
                {quesobj.optionsarray.map((item, i) => (
                  <div className="mt-4" key={i}>
                    <div>
                      <label className="inline-flex items-center font-normal">
                        <input
                          type="radio"
                          className="form-radio"
                          onChange={() => setUserVote(item)}
                          name="radio"
                          checked={userAnswer === item}
                        />
                        &nbsp;&nbsp;{item}
                      </label>
                    </div>
                  </div>
                ))}

                <div className="mt-6 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => answerQuestion(e)}
                    className=" py-2 px-4 text-sm leading-5 font-medium rounded-md text-white bg-green-600 "
                  >
                    {t("PollPage.SubmitVoteBtn")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  function InitialPage(props) {
    return (
      <>
        {question === null && (
          <div className="flex items-center linear-bg justify-center h-screen">
            <div className="font-bold bg-white rounded-lg border shadow-lg p-6">
              <div className="font-bold text-xl text-center">
                {t("PollPage.InitialPageText1")}&nbsp; {state.company}
              </div>

              <div className="font-semibold text-lg mt-10 text-center">
                {t("PollPage.InitialPageText2")}&nbsp;
                {state.meetingDateTime}. {t("PollPage.InitialPageText3")}&nbsp;{" "}
                {state.joiningTime}.
              </div>
              <p className="text-sm font-medium text-blue-500 mt-10 mb-10">
                {t("PollPage.InitialPageText4")}&nbsp;
              </p>
              <div className="mt-6 flex items-center justify-center">
                <button
                  type="button"
                  onClick={goToGeneralMeeting}
                  className=" py-2 px-4 text-sm leading-5 font-medium rounded-md text-white bg-green-600 "
                >
                  {t("PollPage.JoinMeeting")}
                </button>
              </div>
            </div>
          </div>
        )}

        {question !== null && <PollPage />}
      </>
    );
  }

  function OtpVerifyPage(props) {
    return (
      <>
        {!isOtpValid && (
          <div className="h-screen flex otp-screen-bg flex-col">
            <div className="md:grid md:grid-cols-1 md:gap-6  mx-auto px-4 mt-20">
              <div className="lg:text-center">
                <h3
                  className="mt-2 text-2xl leading-8 font-semibold
                 tracking-tight text-white sm:text-2xl sm:leading-10"
                >
                  {t("PollPage.OtpVerificationText1")}
                </h3>
                <p className="mt-2 text-1xl leading-8 text-white sm:text-2xl sm:leading-10">
                  {t("PollPage.OtpVerificationText2")}
                </p>
              </div>

              {!isOtpValid && (
                <div className="mt-5 md:mt-0 md:col-span-1 bg-gray-100 rounded-lg">
                  <form
                    className="bg-gray-100 rounded-lg"
                    onSubmit={handleSubmitClick}
                  >
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                      <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                        <div className="grid grid-cols-3 gap-6">
                          <div className="col-span-3 sm:col-span-2">
                            <label
                              htmlFor="Meeting Name"
                              className="block text-md font-semibold text-black"
                            >
                              {t("PollPage.OtpVerificationText3")}
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                              <input
                                type="text"
                                id="otp"
                                className="border-solid border-gray-500 border p-1 md:text-lg w-full"
                                onChange={handleChange}
                                ref={otpInput}
                                value={otp}
                                type="text"
                                placeholder="Enter otp"
                              />

                              {!isOtpValid && isOtpValid !== null && (
                                <div className="col-span-3 sm:col-span-2 text-red-500">
                                  {t("PollPage.OtpNotValid")}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className=" py-3 bg-gray-50 text-right">
                          <button
                            type="submit"
                            className="inline-flex justify-center py-1 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {t("PollPage.VerifyBtn")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  var contents;
  if (isLinkValid === null) {
    contents = <Loader />;
  } else if (!isLinkValid) {
    contents = <LinkNotValidPage />;
  } else if (state.userSession === "Deny") {
    contents = <UserAlreadyExist />;
  } else if (state.userSession === "MeetingAlreadyStarted") {
    contents = <MeetingAlreadyStarted />;
  } else if (isPollCompleted) {
    contents = (
      <CompletePoll
        userInfo={state}
        meetingId={state.meetingId}
        userId={state.userId}
        languageId={state.userLanguage == "english" ? 1 : 2}
      />
    );
  } else if (resultResponse.showresult) {
    ////console.log('userLanguage:'+JSON.stringify(resultResponse));
    // //console.log('userLanguage:'+state.userLanguage);

    contents = (
      <ShowChartToQuestionResponse
        meetingId={state.meetingId}
        languageId={resultResponse.question[state.userLanguage]["languageId"]}
        questionId={resultResponse.questionId}
        question={resultResponse.question[state.userLanguage]["question"]}
      />
    );
  } else if (isOtpValid) {
    contents = <InitialPage />;
  } else if (isLinkValid) {
    contents = <OtpVerifyPage />;
  }

  return (
    <>
      <Loader isLoading={isLoading} />
      {contents}
    </>
  );
}
export default withRouter(UserQuestionPage);
