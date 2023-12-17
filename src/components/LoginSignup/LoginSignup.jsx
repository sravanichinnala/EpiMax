import React, { useContext, useEffect, useState } from "react";
import "./loginsignup.css";
import { useNavigate } from "react-router-dom";
import AuthTokenContext from "../../context/AuthTokenContext";

function LoginSignup() {
  let [loginSignupToggleBtn, setLoginSignupToggleBtn] = useState("login");
  let [toggleBtnBackground, setToggleBtnBackground] = useState("login");

  const toggleButton = (e) => {
    setLoginSignupToggleBtn(e.target.value);
    setToggleBtnBackground(e.target.value);
  };
  return (
    <div className="login-signup">
      <div className="login-signup-main">
        <div className="login-signup-btns">
          <button
            value="login"
            className={toggleBtnBackground === "login" ? "selected" : ""}
            onClick={toggleButton}
          >
            Log In
          </button>
          <button
            value="signup"
            className={toggleBtnBackground === "signup" ? "selected" : ""}
            onClick={toggleButton}
          >
            Sign Up
          </button>
        </div>
        {loginSignupToggleBtn === "login" ? (
          <Login
            setLoginSignupToggleBtn={setLoginSignupToggleBtn}
            setToggleBtnBackground={setToggleBtnBackground}
          />
        ) : (
          <Signup />
        )}
      </div>
    </div>
  );
}

export function Login(props) {
  let { setLoginSignupToggleBtn, setToggleBtnBackground } = props;
  let [userDetals, setUserDetails] = useState({
    userName: "",
    password: "",
  });
  let { authToken, setAuthToken } = useContext(AuthTokenContext);
  const navigate = useNavigate();
  const inputHandler = (e) => {
    setUserDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const userLogin = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userDetals),
    }).then(async (res) => {
      const data = await res.json();
      if (res.status === 200) {
        await setAuthToken(data.accessToken);
        setUserDetails({
          userName: "",
          password: "",
        });
        navigate("/tasks", { state: { username: userDetals.userName } });
      } else if (res.status === 301) {
        alert(data.message);
      }
    });
  };
  return (
    <div className="login">
      <h3 style={{ color: "black", padding: "0vw 2vw" }}>
        Login To Your<label style={{ color: "rgb(0, 171, 255)" }}> ToDo </label>
        Manager
      </h3>
      <form className="login" id="login">
        <input
          type="text"
          placeholder="User Name"
          name="userName"
          value={userDetals.userName}
          onChange={inputHandler}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userDetals.password}
          onChange={inputHandler}
          required
        />
        <label
          style={{
            textIndent: "1em",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <a href="">
            <u>Forgot Password?</u>
          </a>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setLoginSignupToggleBtn("signup");
              setToggleBtnBackground("signup");
            }}
          >
            <u>Don't have account?</u>
          </span>
        </label>
        <button id="login-btn" onClick={userLogin}>
          Login
        </button>
      </form>
    </div>
  );
}

export function Signup() {
  let [userDetails, setUserDetails] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const inputHandle = (e) => {
    setUserDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const createUser = (e) => {
    e.preventDefault();
    if (userDetails.password !== userDetails.confirmPassword) {
      alert("Password should match");
    } else {
      fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(userDetails),
      })
        .then(async (response) => {
          const data = await response.json();
          if (response.status === 200) {
            alert(data.message);
          } else if (response.status === 301) {
            alert(data.message);
          }
        })
        .catch((error) => {
          alert(error);
        });
      setUserDetails({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };
  return (
    <div className="signup">
      <h3 style={{ color: "black", padding: "0vw 2vw" }}>
        Create a Your<label style={{ color: "rgb(0, 171, 255)" }}>Todo </label>
        Manager Account..
      </h3>
      <form className="signup" id="signup">
        <input
          type="text"
          id="userName"
          placeholder="User Name"
          name="userName"
          value={userDetails.userName}
          onChange={inputHandle}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={userDetails.email}
          onChange={inputHandle}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={userDetails.password}
          onChange={inputHandle}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={userDetails.confirmPassword}
          onChange={inputHandle}
          required
        />
        <button id="signup-btn" onClick={createUser}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
export default LoginSignup;
