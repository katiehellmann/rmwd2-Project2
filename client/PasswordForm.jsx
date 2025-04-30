import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import helper from './helper.js';

const PasswordForm = () => {
  const [message, setMessage] = React.useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    helper.hideError();
    setMessage("");

    const currentPass = e.target.querySelector("#currentPassword").value;
    const newPass = e.target.querySelector("#newPassword").value;

    if (!currentPass || !newPass) {
      helper.handleError("Both fields are required");
      return;
    }

    const res = await fetch("/updatePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPass, newPass }),
    });

    const msg = await res.text();

    if (!res.ok) {
      setMessage("error! wrong password.");
    } else {
      setMessage(msg);
    }
  };

  return (
    <form id="passwordForm" onSubmit={handlePasswordUpdate} method="POST">
      <label htmlFor="currentPassword">Current Password:</label>
      <input
        id="currentPassword"
        type="password"
        placeholder="Current Password"
      />

      <label htmlFor="newPassword">New Password:</label>
      <input id="newPassword" type="password" placeholder="New Password" />
      <br></br><br></br>
      <input type="submit" value="Update Password" />

      {message && <p style={{ color: "red" }}>{message}</p>}
    </form>
  );
};

export default PasswordForm;
