import React from 'react';
import './Loader.css';

function Loader(props) {
 var displayProp = props.isLoading?'block':'none'; 
 return (
 <div id="overlay" style={{"display":displayProp}}>
    <div className="spinner"></div>
    <br/>
    Loading...
</div>)	       
 

}
export default Loader;

