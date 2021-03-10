import React, { useState, useCallback, useEffect } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import "./../../i18n";
import "./Header.css";

import { useTranslation } from "react-i18next";

const Header = (props) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  // const handleVisibility = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("en");

  const [openMenu, setOpenMenu] = useState(false);

  // Other code here..

  // A toggler to update the state when we open or close menu
  const toggleMenu = () => setOpenMenu((openMenu) => !openMenu);

  const changeLanguage = (lang) => {
    // console.log('lang',lang);
    setLanguage(lang);

    let languageId = lang === "en" ? 1 : 2;

    sessionStorage.setItem("languageId", languageId);

    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    sessionStorage.setItem("languageId", 1);
    i18n.changeLanguage("en");
  }, []);

  useEffect(() => {
    setIsUserLoggedIn(
      sessionStorage.getItem("auth_token") !== null ? true : false
    );
    // console.log('useEffect HEader',props);

    let token = sessionStorage.getItem("auth_token");
    if (token) {
      setIsUserLoggedIn(true);
    }
  }, [props]);

  const isLoggedIn = () => {
    return sessionStorage.getItem("auth_token") !== null;
  };

  let history = useHistory();

  const Logout = () => {
    sessionStorage.removeItem("auth_token");
    setIsUserLoggedIn(false);
    history.push("/login");
  };

  function HeaderAfterLogin(props) {
    const loginInfo = JSON.parse(sessionStorage.getItem("user_info"));
    const userName = loginInfo.userName;

    return (
      <nav className="flex items-center bg-white justify-between flex-wrap bg-teal p-6">
        <div className="flex items-center flex-no-shrink text-black mr-6">
          <img
            className="h-8 w-8"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
            alt="Workflow"
          />
          <span className="font-semibold text-xl tracking-tight">
            &nbsp;Vote App
          </span>
        </div>
        <div className="block lg:hidden">
          <button
            onClick={toggleMenu}
            className="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-black hover:border-black-100"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        {/* web */}

        <div className="w-full block flex-grow hidden lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow"></div>
          <div>
            <div className="block px-3 py-2 rounded-md text-sm font-medium text-black mt-4 lg:inline-block lg:mt-0 text-teal-lighter  mr-4">
              Hi {userName}
            </div>

            <Link
              to="/login"
              onClick={() => Logout()}
              className="block px-3 py-2 rounded-md text-sm font-medium text-red-600 mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:bg-red-600 hover:text-white mr-4"
            >
              {t("Header.LogoutMenuText")}
            </Link>
            <div className="dropdown text-black-100 block mt-4 lg:inline-block lg:mt-0 text-teal-lighter font-black hover:text-black-100  mr-1 ">
              <button className="inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black	 hover:border-transparent hover:bg-gray-800 hover:text-white mt-4 lg:mt-0">
                <span className="mr-1">Change language</span>
              </button>
              <ul className="dropdown-menu absolute hidden text-black border-indigo-400 pt-1 pl-5">
                <li
                  onClick={() => changeLanguage("en")}
                  value="en"
                  className="rounded-t bg-gray-200 hover:bg-indigo-400 hover:text-white py-1 px-10 font-semibold block whitespace-no-wrap"
                >
                  English
                </li>
                <li
                  onClick={() => changeLanguage("Swedish")}
                  value="swedish"
                  className="rounded-b bg-gray-200 hover:bg-indigo-400 hover:text-white py-1 px-10 font-semibold block whitespace-no-wrap"
                >
                  Swedish
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* mobile */}

        <div
          className={
            !openMenu
              ? "hidden"
              : "w-full block flex-grow lg:flex lg:items-center lg:w-auto"
          }
        >
          <div className="text-sm lg:flex-grow"></div>
          <div>
            <div className="dropdown text-black-100 block mt-4 lg:inline-block lg:mt-0 text-teal-lighter font-black hover:text-black-100  mr-1 ">
              <button className="inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black	 hover:border-transparent hover:bg-gray-800 hover:text-white mt-4 lg:mt-0">
                <span className="mr-1">{t("Header.LanguageMenuText")}</span>
              </button>
              <ul className="dropdown-menu absolute hidden text-black border-indigo-400 pt-1 pl-5">
                <li
                  onClick={() => changeLanguage("en")}
                  value="en"
                  className="rounded-t bg-gray-200 hover:bg-indigo-400 py-3 px-8 block whitespace-no-wrap"
                >
                  English
                </li>
                <li
                  onClick={() => changeLanguage("Spanish")}
                  value="spanish"
                  className="rounded-b bg-gray-200 hover:bg-indigo-400 py-3 px-8 block whitespace-no-wrap"
                >
                  Spanish
                </li>
              </ul>
            </div>

            <div className="block px-3 py-2 rounded-md text-sm font-medium text-black mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:bg-gray-800 hover:text-white mr-4">
              Hi {userName}
            </div>

            <Link
              to="/login"
              onClick={() => Logout()}
              className="block px-3 py-2 rounded-md text-sm font-medium text-black mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:bg-gray-800 hover:text-white mr-4"
            >
              {t("Header.LogoutMenuText")}
            </Link>
          </div>
        </div>
        {/* mobile */}
      </nav>
    );
  }

  function HeaderBeforeLogin(props) {
    return (
      <nav className="flex items-center bg-white justify-between flex-wrap bg-teal p-6">
        <div className="flex items-center flex-no-shrink text-black mr-6">
          <img
            className="h-8 w-8"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
            alt="Workflow"
          />
          <span className="font-semibold text-xl tracking-tight">
            &nbsp;Vote App
          </span>
        </div>
        <div className="block lg:hidden">
          <button
            onClick={toggleMenu}
            className="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-black hover:border-black-100"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        {/*web*/}
        <div className="w-full hidden block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow"></div>
          <div>
            <a
              href="#responsive-header"
              className="block px-3 py-2 rounded-md text-sm font-medium text-black mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:bg-gray-800 hover:text-white mr-4"
            >
              {t("Header.AboutMenuText")}
            </a>
            <a
              href="#responsive-header"
              className="block px-3 py-2 rounded-md text-sm font-medium text-black mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:bg-gray-800 hover:text-white mr-4"
            >
              {t("Header.ContactMenuText")}
            </a>
            <div className="dropdown text-black-100 block mt-4 lg:inline-block lg:mt-0 text-teal-lighter font-black hover:text-black-100  mr-1 ">
              <button className="inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black	 hover:border-transparent hover:bg-gray-800 hover:text-white mt-4 lg:mt-0">
                <span className="mr-1">{t("Header.LanguageMenuText")}</span>
              </button>
              <ul className="dropdown-menu absolute hidden text-black border-indigo-400 pt-1 pl-5">
                <li
                  onClick={() => changeLanguage("en")}
                  value="en"
                  className="rounded-t bg-gray-200 hover:bg-indigo-400 py-1 hover:text-white font-medium px-8 block whitespace-no-wrap"
                >
                  English
                </li>
                <li
                  onClick={() => changeLanguage("Swedish")}
                  value="swedish"
                  className="rounded-b bg-gray-200 hover:bg-indigo-400 py-1 hover:text-white font-medium px-8 block whitespace-no-wrap"
                >
                  Swedish
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/*mobile*/}

        <div
          className={
            !openMenu
              ? "hidden"
              : "w-full block flex-grow lg:flex lg:items-center lg:w-auto"
          }
        >
          <div className="text-sm lg:flex-grow"></div>
          <div>
            <a
              href="#responsive-header"
              className="block px-3 py-2 rounded-md text-sm font-medium text-black mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:bg-gray-800 hover:text-white mr-4"
            >
              About
            </a>
            <a
              href="#responsive-header"
              className="block px-3 py-2 rounded-md text-sm font-medium text-black mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:bg-gray-800 hover:text-white mr-4"
            >
              Contact
            </a>
            <div className="dropdown text-black-100 block mt-4 lg:inline-block lg:mt-0 text-teal-lighter font-black hover:text-black-100  mr-1 ">
              <button className="inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black	 hover:border-transparent hover:bg-gray-800 hover:text-white mt-4 lg:mt-0">
                <span className="mr-1">Change language</span>
              </button>
              <ul className="dropdown-menu absolute hidden text-black border-indigo-400 pt-1 pl-5">
                <li
                  onClick={() => changeLanguage("en")}
                  value="en"
                  className="rounded-t bg-gray-200 hover:bg-indigo-400 py-3 px-8 block whitespace-no-wrap"
                >
                  English
                </li>
                <li
                  onClick={() => changeLanguage("Spanish")}
                  value="spanish"
                  className="rounded-t bg-gray-200 hover:bg-indigo-400 py-3 px-8 block whitespace-no-wrap"
                >
                  Spanish
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (isUserLoggedIn) {
    return <HeaderAfterLogin />;
  } else {
    return <HeaderBeforeLogin />;
  }
};

export default withRouter(Header);
