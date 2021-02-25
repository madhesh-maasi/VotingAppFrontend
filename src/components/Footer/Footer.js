import React from 'react';
import { withRouter } from "react-router-dom";
import './../../i18n';
import { useTranslation } from 'react-i18next';

function Footer(props) {
	const { t, i18n } = useTranslation();
  return (
  
  <footer className='w-full text-center border-t border-grey p-4'>
            <ul className="">
                <li className="md:mx-2 md:inline leading-7 text-lg" id="footer-navi-2"><a className="block px-3 py-2 rounded-md text-sm font-medium text-black mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:bg-gray-800 hover:text-white mr-4" href="/disclaimer">{t('Footer.DisclaimerText')}</a></li>
                <li className="md:mx-2 md:inline leading-7 text-lg" id="footer-navi-2"><a className="font-medium text-black" href="/disclaimer">&#169; voteapp.com</a></li>
                <li className="md:mx-2 md:inline leading-7 text-lg" id="footer-navi-2"><a className="block px-3 py-2 rounded-md text-sm font-medium text-black mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:bg-gray-800 hover:text-white mr-4	" href="/cookie">{t('Footer.CookiePolicyText')}</a></li>
               
                </ul>
        </footer>

 
	      
       
 
);
}
export default withRouter(Footer);
