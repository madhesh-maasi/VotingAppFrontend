import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import axiosConfig from "../../config/axiosConfig";
import { withRouter } from "react-router-dom";
import Modal from "../Modal/Modal";
import "./AddMeeting.css";
import DateTimePicker from "react-datetime-picker";
import Loader from "../Loader/Loader";
import moment from "moment";
import "./../../i18n";
import { useTranslation } from "react-i18next";

function AddMeeting(props) {
  const { t, i18n } = useTranslation();

  const [state, setState] = useState({
    Name: "",
    Notes: "",
    CompanyName: "",
    MeetingLink: "",
    MeetingOwner: "",
    MeetingOwnerEmail: "",
    MeetingDateTime: new Date(),
    isEdit: false,
    csvParticipantValid: true,
    csvQuestionsValid: true,
    showErrorMsg: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [submitClicked, setSubmitClicked] = useState(false);

  const params = useParams();

  const [UserList, setUserList] = useState(null);
  const [MeetingDateTime, onChangeDateTime] = useState(null);
  const [QuestionList, setQuestionList] = useState(null);

  const [ModalProps, setModalProps] = useState({
    ModalShow: false,
    ModalTitle: "Add Meeting",
    ModalMessage: "something went wrong,please try after some time.",
  });

  let history = useHistory();

  let csvFileFormat = [
    "text/comma-separated-values",
    "text/csv",
    "application/csv",
    "application/excel",
    "application/vnd.ms-excel",
    "application/vnd.msexcel",
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  useEffect(() => {
    setIsLoading(false);

    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);

  useEffect(() => {
    if (params.id) {
      setIsLoading(true);

      // // GET request using axios inside useEffect React hook
      axiosConfig
        .get("Meeting/meetinginfo?meetingID=" + params.id)
        .then((response) => {
          setIsLoading(false);

          setState((prevState) => ({
            ...prevState,
            MeetingOwner: response.data.m_owner,
            CompanyName: response.data.m_company,
            MeetingLink: response.data.m_link,
            MeetingOwnerEmail: response.data.m_owner_email,
            Name: response.data.m_name,
            Notes: response.data.m_notes == null ? "" : response.data.m_notes,
            MeetingDateTime: new Date(response.data.m_date),
            isEdit: true,
          }));

          onChangeDateTime(new Date(response.data.m_date));
        });
    }
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [params]);

  // get userdata as formdata
  const handleUserList = (e) => {
    //  let users_as_base64 = URL.createObjectURL(e.target.files[0])
    let users_as_files = e.target.files[0];
    //console.log('users_as_files',users_as_files);
    console.log("e.target.files[0].type ", e.target.files[0].type);
    if (!csvFileFormat.includes(e.target.files[0].type)) {
      setState((prevState) => ({
        ...prevState,
        csvParticipantValid: false,
      }));
      e.target.value = null;
    } else {
      setState((prevState) => ({
        ...prevState,
        csvParticipantValid: true,
      }));
      setUserList(users_as_files);
    }
  };

  // get question_list as formdata

  const handleQuestionList = (e) => {
    let questions_as_files = e.target.files[0];
    //console.log('questions_as_files',questions_as_files);

    console.log("e.target.files[0].type ", e.target.files[0].type);

    if (!csvFileFormat.includes(e.target.files[0].type)) {
      setState((prevState) => ({
        ...prevState,
        csvQuestionsValid: false,
      }));

      e.target.value = null;
    } else {
      setState((prevState) => ({
        ...prevState,
        csvQuestionsValid: true,
      }));
      setQuestionList(questions_as_files);
    }
  };

  const redirectToHome = () => {
    history.push("/meetinglist");
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();

    if (
      state.Name === "" ||
      state.MeetingOwner === "" ||
      state.MeetingOwnerEmail === ""
    ) {
      setSubmitClicked(true);
      return;
    }

    let formData = new FormData();
    formData.append("CompanyName", state.CompanyName);
    formData.append("MeetingLink", state.MeetingLink);
    formData.append("Name", state.Name);
    formData.append("Notes", state.Notes);
    formData.append("MeetingOwner", state.MeetingOwner);
    formData.append("MeetingOwnerEmail", state.MeetingOwnerEmail);

    formData.append("UserList", UserList);
    formData.append("QuestionList", QuestionList);

    setIsLoading(true);

    //  console.log('MeetingDateTime::'moment(MeetingDateTime).format("YYYY-MM-DDTHH:mm:ss"));

    if (!state.isEdit) {
      if (MeetingDateTime === null) {
        formData.append("MeetingDateTime", null);
      } else {
        formData.append(
          "MeetingDateTime",
          moment(MeetingDateTime).format("YYYY-MM-DDTHH:mm:ss")
        );
      }
      axiosConfig
        .post("Meeting/addmeeting", formData)
        .then(function (response) {
          if (response) {
            setIsLoading(false);
            setModalProps((prevState) => ({
              ...prevState,
              ModalMessage:
                "Meeting created & login credentials send to meeting owner email successfully.",
              ModalShow: true,
            }));
          } else {
            console.log("something went wrong");
            setIsLoading(false);
          }
        })
        .catch(function (error) {
          console.log(error);
          setIsLoading(false);
          setModalProps((prevState) => ({
            ...prevState,
            ModalTitle: "Error",
            ModalShow: true,
          }));
        });
    } else {
      formData.append("meetingID", params.id);
      formData.append(
        "MeetingDateTime",
        moment(MeetingDateTime).format("YYYY-MM-DDTHH:mm:ss")
      );
      axiosConfig
        .post("Meeting/updatemeeting", formData)
        .then(function (response) {
          if (response) {
            setModalProps((prevState) => ({
              ...prevState,
              ModalTitle: "Update Meeting",
              ModalMessage: "Meeting updated successfully.",
              ModalShow: true,
            }));
            setIsLoading(false);
          } else {
            console.log("something went wrong");

            setIsLoading(false);
          }
        })
        .catch(function (error) {
          console.log(error);
          setIsLoading(false);
          setModalProps((prevState) => ({
            ...prevState,
            ModalTitle: "Error",
            ModalShow: true,
          }));
        });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100  blue-bg flex-col">
      <Loader isLoading={isLoading} />
      <div className="md:grid md:grid-cols-1 md:gap-2 container mx-auto px-4">
        <div className="text-center ">
          <h3 className="mt-2 lg:text-3xl leading-8 font-semibold tracking-tight text-gray-900 sm:text-lg sm:leading-10">
            {state.isEdit
              ? t("AddMeeting.HeadingEdit")
              : t("AddMeeting.HeadingAdd")}
          </h3>
        </div>
        <div className="flex justify-start">
          <button
            onClick={() => redirectToHome()}
            className="bg-indigo-600 lg:ml-12 hover:bg-grey text-white  font-medium py-1 px-4 rounded inline-flex items-center"
          >
            <span>{t("VoteApp.BacktoHome")}</span>
          </button>
        </div>

        <div className="max-w-6xl bg-white pb-10 px-5 m-auto w-full mt-10">
          <form onSubmit={handleSubmitClick}>
            <div className="grid grid-cols-6 gap-6 max-w-5xl m-auto">
              <div className="col-span-3 lg:col-span-3">
                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">
                  {t("AddMeeting.CompanyName")}
                </label>
                <input
                  className="border-solid border-gray-600 border p-1 md:text-md w-full"
                  id="title"
                  type="text"
                  id="CompanyName"
                  onChange={handleChange}
                  value={state.CompanyName}
                />
                <span
                  className={
                    state.CompanyName === "" && submitClicked
                      ? "error-msg"
                      : "hidden"
                  }
                >
                  {" "}
                  Please enter Company name
                </span>
              </div>

              <div className="col-span-3 lg:col-span-3">
                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">
                  {t("AddMeeting.MeetingName")}
                </label>
                <input
                  type="text"
                  className="border-solid border-gray-600 border p-1 md:text-md w-full"
                  id="Name"
                  onChange={handleChange}
                  type="text"
                  value={state.Name}
                />
                <span
                  className={
                    state.Name === "" && submitClicked ? "error-msg" : "hidden"
                  }
                >
                  {" "}
                  Please enter Meeting name
                </span>
              </div>

              <div className="col-span-3 lg:col-span-3">
                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">
                  {t("AddMeeting.MeetingOwner")}
                </label>
                <input
                  type="text"
                  className="border-solid border-gray-600 border p-1 md:text-md w-full"
                  id="MeetingOwner"
                  onChange={handleChange}
                  type="text"
                  value={state.MeetingOwner}
                />
                <span
                  className={
                    state.MeetingOwner === "" && submitClicked
                      ? "error-msg"
                      : "hidden"
                  }
                >
                  {" "}
                  Please enter Meeting owner
                </span>
              </div>

              <div className="col-span-3 lg:col-span-3">
                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">
                  {t("AddMeeting.MeetingOwnerEmail")}
                </label>
                <input
                  className="border-solid border-gray-600 border p-1 md:text-md w-full"
                  id="title"
                  type="text"
                  id="MeetingOwnerEmail"
                  onChange={handleChange}
                  value={state.MeetingOwnerEmail}
                />
                <span
                  className={
                    state.MeetingOwnerEmail === "" && submitClicked
                      ? "error-msg"
                      : "hidden"
                  }
                >
                  {" "}
                  Please enter Meeting owner email
                </span>
              </div>

              <div className="col-span-3 lg:col-span-4">
                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">
                  {t("AddMeeting.MeetingLink")}
                </label>
                <input
                  className="border-solid border-gray-600 border p-1 md:text-md w-full"
                  id="title"
                  type="text"
                  id="MeetingLink"
                  onChange={handleChange}
                  value={state.MeetingLink}
                />
                <span
                  className={
                    state.MeetingLink === "" && submitClicked
                      ? "error-msg"
                      : "hidden"
                  }
                >
                  {" "}
                  Please enter Meeting Link
                </span>
              </div>
              <div className="col-span-4 lg:col-span-2">
                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">
                  {t("AddMeeting.MeetingDateTime")}
                </label>
                <DateTimePicker
                  onChange={onChangeDateTime}
                  locale="sv-sv"
                  format="dd/MM/y HH:mm"
                  value={MeetingDateTime}
                  className="border-solid border-gray-400 border p-0 md:text-xl w-full"
                />
              </div>
              <div className="col-span-4 lg:col-span-6">
                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">
                  {t("AddMeeting.MeetingNotes")}
                </label>
                <textarea
                  id="Notes"
                  rows="3"
                  onChange={handleChange}
                  className="border-solid border-gray-600 border p-3 md:text-md w-full"
                  value={state.Notes}
                ></textarea>
              </div>

              <div className="col-span-4 lg:col-span-3">
                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">
                  {t("AddMeeting.MeetingParticipantList")}
                </label>
                <input
                  aria-label="CSV Upload"
                  name="userdata"
                  accept=".csv"
                  onChange={handleUserList}
                  type="file"
                  className="border-solid border-gray-400 border-0 p-1 md:text-md w-full customUpload"
                  id="userdata"
                />
                <span
                  className={
                    !state.csvParticipantValid ? "error-msg" : "hidden"
                  }
                >
                  {" "}
                  Uploaded file not a csv file{" "}
                </span>
              </div>

              <div className="col-span-4 lg:col-span-2">
                <label className="uppercase tracking-wide text-black text-xs font-bold mb-2">
                  {t("AddMeeting.MeetingQuestionList")}
                </label>
                <input
                  aria-label="CSV Upload"
                  name="question_list"
                  accept=".csv"
                  className="border-solid border-gray-400 border-0 p-1 md:text-md w-full customUpload"
                  onChange={handleQuestionList}
                  type="file"
                  id="question_list"
                />
                <span
                  className={!state.csvQuestionsValid ? "error-msg" : "hidden"}
                >
                  {" "}
                  Uploaded file not a csv file{" "}
                </span>
              </div>

              <div className="col-span-6 text-right float-right">
                <button
                  className="py-3 px-6 bg-green-500 text-white font-bold w-full"
                  type="submit"
                >
                  {state.isEdit
                    ? t("AddMeeting.UpdateMeetingBtn")
                    : t("AddMeeting.CreateMeetingBtn")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Modal
        Message={ModalProps.ModalMessage}
        open={ModalProps.ModalShow}
        Title={ModalProps.ModalTitle}
        RedirectUrl="/meetinglist"
      />
    </div>
  );
}
export default withRouter(AddMeeting);
