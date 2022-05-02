import React from "react";
import "./Login.css";
import loginLogo from "./loginLogo.svg";

export default function Login() {
  return (
    <div className="loginContainer">
      <div className="loginHolder">
        <h1>You are not authorized</h1>
        <div>
          <span>Login</span>
          <a href="https://e-ota.auth.us-west-2.amazoncognito.com/login?client_id=4ueocual9gabq8imtgrch5c6vd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:3000">
            <img src={loginLogo} alt="Login Logo" />
          </a>
        </div>
      </div>
    </div>
  );
}
