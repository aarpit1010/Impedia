import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";

const Logout = () => {
  const history = useHistory();
  const [removeCookie] = useCookies(["user"]);

  useEffect(() => {
    removeCookie("user");
    return history.push("/");
  }, []);

  return <></>;
};

export default Logout;
