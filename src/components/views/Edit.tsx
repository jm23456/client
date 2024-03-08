import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { Spinner } from "components/ui/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"


//console.log(user.id)

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Edit = () => {
  const navigate =useNavigate();  
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [birthday, setBirthday] = useState<string>(null);
  const [username, setUsername] = useState(null);

  const doSave = async() => {
    try{
      //token from currently logged in user
      const token=localStorage.getItem("token");
      const requestBody= JSON.stringify({"username":username, "birthday": birthday, "token":token});

      console.log("REQBody" + requestBody)
      const response = await api.put(`/users/${id}`, requestBody);
      console.log("RESBody" + response.data.birthday)
      navigate(`/profile/${id}`)
    } catch (error) {
      alert("Something went wrong while fetching the requested user!!!!")
    }
  }
  useEffect(() => {

    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    
    //navigate(`/profile/${id}`) after save
    async function fetchProfile() {
      console.log("id:" + id);  

      try {

        const response = await api.get(`/users/${id}`);
        //if (response.data.status === "OFFLINE"){
        //  alert("User is offline. You cannot see the User Profile.")
        //  navigate("/game")
        //}
        console.log("request to:", response.request.responseURL);

        console.log("RESPONSE STATUS", response.data.status);

        console.log("status text:", response.statusText);

        console.log("response data:", response.data);
        console.log("RESPONSE Id" + response.data.id);
        setUser(response.data);

        await new Promise(resolve => setTimeout(resolve, 1000)); //current async function waits 1sec (1000 milliseconds) before continuing with the next line of code.

      } catch (error) {

        console.error(`Something went wrong while fetching the requested user: \n${handleError(error)}`);

        console.error("Details:", error);

        alert("Something went wrong while fetching the requested user, See the console for details.");

      }

    }

    
    fetchProfile();
    console.log(user);

  }, [id]);


  let content = <Spinner />;
  if (user) {
    content = (
      <div className="user-profile">
        <h2>User Profile {user.id}</h2>
        <p><strong>Username:</strong> 
          <FormField
            type="text"
            value={username}
            onChange={un => setUsername(un)}
          /></p>
        <p><strong>Birthday:</strong> {user.birthday}
          <DatePicker 
            selected={birthday} 
            onChange={date => setBirthday(date)}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            scrollableYearDropdown
            maxDate={new Date()}
            placeholderText="Select a date"
          />
        </p>
        <p><strong>Account Created:</strong> {user.creation_date}</p>
        <p><strong>Status:</strong> {user.status}</p>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h1>Profile Page</h1>
      {content}
      <div className='button-container'>
        <Button
          //disabled={localStorage.getItem("id")!==id}
          width="100%"
          onClick={() => doSave()}
        >
                    Save Changes
        </Button>
        <Button
          width="100%"
          onClick={() => navigate("/game")}
        >
            Back to Overview
        </Button>
      </div>
    </BaseContainer>
  );
}

export default Edit;