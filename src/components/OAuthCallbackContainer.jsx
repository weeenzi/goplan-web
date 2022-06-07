import httpService from "httpService";
import React, { useEffect } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthCallbackContainer(props) {
  const [searchParams] = useSearchParams();
  const authorizationCode = searchParams.get("code");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(searchParams.get("code"))
    if (authorizationCode !== null) {
      httpService.requestAccessTokenWithAuthorizationCode(authorizationCode)
      .then((response) => {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        navigate("/");
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  },[]);

  return (
    <>
      {(authorizationCode === null) && (
        <Navigate to={'/'} />
      )}
    </>
  );
}
