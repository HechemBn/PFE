import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");


export const sendMail = createAsyncThunk("sendMail/sendEmail", async (action) => {
    const response = await fetch(Configuration.BACK_BASEURL + "sendMail/sendEmail", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(action),
    });
    const mail = await response.json();
    return mail;
  });
  

  
export const verifCode = createAsyncThunk("sendMail/resetPassword", async (action) => {
  var code =  action.code ;
  const response = await fetch(Configuration.BACK_BASEURL + "sendMail/resetPassword", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(action),
  });
  const mail = await response.json();
  return mail;
});
