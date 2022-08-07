import React, { Component, useEffect, useState } from "react";
import { Container, Img } from "./styles";
import Icone from "../../assets/img/next.svg";
import Close from "../../assets/img/close-eye.svg";
import Open from "../../assets/img/open-eye.svg";
import AuthService from "../../services/AuthService";
import { Redirect } from "react-router-dom";
import IsAuthenticated from "../../services/VerifyToken";

interface Props { }

interface State {
  username: string;
  password: string;
  loading: boolean;
  error: boolean;
  hidden?: boolean;
}

export const Login = (props: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hidden, setHidden] = useState(false);

  const togglePassword = () => {
    setHidden(!hidden);
  }

  const onsubmit = () => {
    setLoading(true);
    const request = new AuthService();
    request.login(username, password).then(
      (success) => {
        localStorage.setItem("TOKEN", success.access_token);
        setError(false);
        setLoading(false)
      },
      (error) => {
        console.log(error);
        setError(true);
        setLoading(false)
      }
    );
  }

  useEffect(() => {

  }, [])

  return (<Container >
    <div className="card">
      <div className="card-header">
        <h1>Hi!</h1>
        <h2>Welcome Back.</h2>
      </div>
      <form>
        <div className="card-body">
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            defaultValue=""
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="input-password">
            <input
              type={hidden ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              defaultValue=""
              onChange={(e) => setPassword(e.target.value)}
            />
            <Img
              src={hidden ? Close : Open}
              onClick={togglePassword}
            />
          </div>
          <button
            className="btn btn-info"
            style={{ backgroundColor: "black" }}
            type="button"
            onClick={onsubmit}
          >
            <span> {loading ? "Loading..." : "Enter"} </span>
          </button>
        </div>
        {error ? (
          <div className="error">
            <span>
              Oops, we were unable to process your request. Please check your data and try again.
            </span>
          </div>
        ) : (
          <div></div>
        )}
      </form>
    </div>
    {IsAuthenticated() ? <Redirect to="/home" /> : <Redirect to="/" />}
  </Container>)

}

