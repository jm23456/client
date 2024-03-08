import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useParams, useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { Spinner } from "components/ui/Spinner";


//console.log(user.id)

const Profile = () => {
  const navigate =useNavigate();  
  const [user, setUser] = useState(null);

  const { id } = useParams();

  useEffect(() => {

    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:

    async function fetchProfile() {
      console.log("id:" + id);  

      try {

        const response = await api.get(`/users/${id}`);
        //if (response.data.status === "OFFLINE"){
        //  alert("User is offline. You cannot see the User Profile.")
        //  navigate("/game")
        //}
        //console.log("request to:", response.request.responseURL);

        //console.log("RESPONSE STATUS", response.data.status);

        //console.log("status text:", response.statusText);

        console.log("requested data:", response.data);
        //console.log("RESPONSE Id" + response.data.id);
        setUser(response.data);

        await new Promise(resolve => setTimeout(resolve, 1000)); //current async function waits 1sec (1000 milliseconds) before continuing with the next line of code.

      } catch (error) {

        console.error(`Something went wrong while fetching the requested user: \n${handleError(error)}`);

        console.error("Details:", error);

        alert("Something went wrong while fetching the requested user! See the console for details.");

      }

    }
    fetchProfile();
    console.log(user);

  }, [id]);

  let content = <Spinner />;
  if (user) {
    content = (
      <div className="user-profile">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Birthday:</strong> {user.birthday}</p>
        <p><strong>Creation Date:</strong> {user.creationdate}</p>
        <p><strong>Status:</strong> {user.status}</p>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h1>Profile Page User {user.name}</h1>
      {content}
      <div className='button-container'>
        {user && user.status === "ONLINE" && ( //check that there is a user && user.status === ONLINE
          <Button
            width="100%"
            onClick={() => navigate(`/edit/${id}`, {state: user.username})}
          >
                    Edit
          </Button>
        )}
    
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

export default Profile;