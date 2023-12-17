import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomeNavigation() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login-signup");
  }, [navigate]);
  return <div>H</div>;
}

export default HomeNavigation;
