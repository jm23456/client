import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
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

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      console.log("REQ DATA " + requestBody);
      const response = await api.post("/users/login", requestBody);
      console.log("RESP DATA " + JSON.stringify(response.data));
      const id = response.data.id


      // Get the returned user and update a new object.
      const user = new User({
        id: response.data.id,
        name: response.data.name,
        username: response.data.username,
        password: response.data.password,
        token: response.data.token, // Set the token property
        status: response.data.status
      });      console.log(JSON.stringify(user));

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);
      console.log("USER TOKEN " + user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during the registry: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
          <div className="register button-container">
            <Button
              width="100%"
              onClick={() => navigate("/register")}
            >
              Register instead?
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
