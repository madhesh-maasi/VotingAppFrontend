import React, { Suspense,useState } from "react";
import Routes from './components/Routes/Routes';
import Loader from './components/Loader/Loader';
function App() {
   const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("auth_token")!==null?true:false);
  return (
    <div>
    <Suspense fallback={<Loader />}>
      <Routes/>
    </Suspense>
    </div>
  );
}
export default App;
