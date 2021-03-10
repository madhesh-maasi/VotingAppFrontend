import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";
import { API_BASE_URL } from "./../../constants/apiConstant";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions";
import "./Login.css";
import "./../../i18n";
import { useTranslation } from "react-i18next";

function Login(props) {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    email: "",
    password: "",
    successMessage: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [ModalProps, setModalProps] = useState({
    ModalShow: false,
    ModalTitle: "Error",
    ModalMessage: "something went wrong,please try after some time.",
  });

  const { t } = useTranslation();

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    setModalProps((prevState) => ({
      ...prevState,
      ModalShow: false,
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(login(state)).then(
      (response) => {
        // console.log('response',response.status);

        setIsLoading(false);
        if (response.status === 200) {
          redirectToHome();
        } else {
          //console.log('login fail');

          setModalProps((prevState) => ({
            ...prevState,
            ModalMessage: "username or password is wrong",
            ModalShow: true,
          }));
        }
      },
      (error) => {
        setIsLoading(false);
        //  console.log('error',error.status);
        setModalProps((prevState) => ({
          ...prevState,
          ModalShow: true,
        }));
      }
    );
  };
  const redirectToHome = () => {
    //  props.updateTitle('Admin InterFace')
    props.history.push("/meetinglist");
  };

  return (
    <>
      <div className="h-screen flex items-center justify-around log-screen  px-4 sm:px-6 lg:px-8">
        <Loader isLoading={isLoading} />
        <div className="loginillus"></div>
        <div className="max-w-md loginpage">
          <div>
            <h2 className="text-center text-3xl leading-9 font-semibold text-white">
              {t("LoginPage.HeadingText")}
            </h2>
          </div>
          <form className="mt-8">
            <div className="rounded-md shadow-sm">
              <div>
                <input
                  aria-label="Email address"
                  name="email"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded mb-2 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                  placeholder="Email address"
                  id="email"
                  value={state.email}
                  onChange={handleChange}
                />
              </div>
              <div className="-mt-px">
                <input
                  aria-label="Password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                  placeholder="Password"
                  id="password"
                  value={state.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                onClick={handleSubmitClick}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-white group-hover:text-indigo-400 transition ease-in-out duration-150 ml-24"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {t("LoginPage.LoginButtonText")}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Modal
        Message={ModalProps.ModalMessage}
        open={ModalProps.ModalShow}
        Title={ModalProps.ModalTitle}
      />
    </>
  );
}
export default withRouter(Login);
