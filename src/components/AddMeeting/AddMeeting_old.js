import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import axiosConfig from "../../config/axiosConfig";
import { withRouter } from "react-router-dom";
import Modal from "../Modal/Modal";
import "./AddMeeting.css";
import DateTimePicker from "react-datetime-picker";

function AddMeeting(props) {
  const [state, setState] = useState({
    Name: "",
    Notes: "",
    MeetingOwner: "",
    MeetingOwnerEmail: "",
    MeetingDateTime: new Date(),
    isEdit: false,
  });

  const params = useParams();

  const [UserList, setUserList] = useState(null);
  const [MeetingDateTime, onChangeDateTime] = useState(null);
  const [QuestionList, setQuestionList] = useState(null);
  const [ModalShow, setModalShow] = useState(false);
  const [MeetingTitle, setMeetingTitle] = useState("Meeting Info");
  const [Message, setMessage] = useState(
    "Meeting created & login credentials send to meeting owner email successfully."
  );

  let history = useHistory();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  useEffect(() => {
    if (params.id) {
      // // GET request using axios inside useEffect React hook
      axiosConfig
        .get("Meeting/meetinginfo?meetingID=" + params.id)
        .then((response) => {
          setState({
            Name: response.data.m_name,
            Notes: response.data.m_notes == null ? "" : response.data.m_notes,
            MeetingDateTime: response.data.m_date,
            isEdit: true,
          });
        });
    }
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [params]);

  // get userdata as formdata
  const handleUserList = (e) => {
    //  let users_as_base64 = URL.createObjectURL(e.target.files[0])
    let users_as_files = e.target.files[0];
    console.log("users_as_files", users_as_files);
    setUserList(users_as_files);
  };

  // get question_list as formdata

  const handleQuestionList = (e) => {
    let questions_as_files = e.target.files[0];
    console.log("questions_as_files", questions_as_files);
    setQuestionList(questions_as_files);
  };

  const redirectToHome = () => {
    history.push("/meetinglist");
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    console.log("userss");
    let formData = new FormData();
    formData.append("Name", state.Name);
    formData.append("Notes", state.Notes);
    formData.append("MeetingOwner", state.MeetingOwner);
    formData.append("MeetingOwnerEmail", state.MeetingOwnerEmail);
    formData.append("MeetingDateTime", MeetingDateTime.toISOString());
    formData.append("UserList", UserList);
    formData.append("QuestionList", QuestionList);

    console.log("formdata Notification::" + formData);
    console.log("state.isEdi::" + state.isEdit);
    if (!state.isEdit) {
      axiosConfig
        .post("Meeting/addmeeting", formData)
        .then(function (response) {
          if (response) {
            setModalShow(true);
            console.log("Meeting Added Successfully", response);
          } else {
            console.log("something went wrong");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      formData.append("meetingID", params.id);
      axiosConfig
        .post("Meeting/updatemeeting", formData)
        .then(function (response) {
          if (response) {
            setMessage("Meeting updated Successfully");
            setModalShow(true);
            console.log("Meeting updated Successfully", response);
          } else {
            console.log("something went wrong");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100   flex-col">
      <div className="md:grid md:grid-cols-1 md:gap-6 container mx-auto px-4">
        <div className="lg:text-center">
          <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
            {state.isEdit ? "Edit" : "Add"} Meeting Details
          </h3>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => redirectToHome()}
            className="bg-gray-600 hover:bg-grey text-white  font-bold py-2 px-4 mr-8 rounded inline-flex items-center"
          >
            <span>Back To Home</span>
          </button>
          <div></div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-1 bg-gray-100">
          <form className="bg-gray-100" onSubmit={handleSubmitClick}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="Meeting Name"
                      className="block text-sm font-medium text-black"
                    >
                      Meeting Name
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        id="Name"
                        onChange={handleChange}
                        className="h-10 border flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-black"
                        value={state.Name}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-black"
                  >
                    Meeting Owner
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      id="MeetingOwner"
                      onChange={handleChange}
                      className="h-10 border flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-black"
                      value={state.MeetingOwner}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-black"
                  >
                    Meeting Owner Email
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      id="MeetingOwnerEmail"
                      onChange={handleChange}
                      className="h-10 border flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-black"
                      value={state.MeetingOwnerEmail}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-black"
                  >
                    Meeting Notes
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="Notes"
                      rows="3"
                      onChange={handleChange}
                      className="shadow-sm h-20 border border-black mt-1 block w-full sm:text-sm
                rounded-md"
                      value={state.Notes}
                    ></textarea>
                  </div>
                  <p className="mt-2 text-sm text-black">
                    Brief description about meeting.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="Meeting Time"
                    className="block text-sm font-medium text-black"
                  >
                    Meeting Date & Time
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <DateTimePicker
                      onChange={onChangeDateTime}
                      value={MeetingDateTime}
                    />
                  </div>
                  <p className="mt-2 text-sm text-black">
                    Please choose the meeting date & time.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black">
                    Upload participants
                  </label>
                  <br />
                  <input
                    aria-label="CSV Upload"
                    name="userdata"
                    onChange={handleUserList}
                    type="file"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-black text-black rounded-t-md focus:outline-none focus:shadow-outline-black focus:border-black-300 focus:z-10 sm:text-sm sm:leading-5"
                    id="userdata"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black">
                    Upload Questions
                  </label>
                  <input
                    aria-label="CSV Upload"
                    name="question_list"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-black text-black rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                    onChange={handleQuestionList}
                    type="file"
                    id="question_list"
                  />
                </div>
              </div>
              <div className="px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Modal
        Message={Message}
        open={ModalShow}
        Title={MeetingTitle}
        RedirectUrl="/meetinglist"
      />
    </div>
  );
}
export default withRouter(AddMeeting);
