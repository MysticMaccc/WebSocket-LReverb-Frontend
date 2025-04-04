"use client";
import React, { useState } from "react";
import Header from "../Header";
import { Button, TextField } from "@mui/material";
import { useNotification } from "@/hooks/api/useNotification";
import Snackbar from "@mui/material/Snackbar";

function page() {
  const [message, setMessage] = useState();
  const { store } = useNotification();
  //
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    storeResponse: "",
  });
  const { vertical, horizontal, open, storeResponse } = state;
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleSubmit = async () => {
    const object = { message: message };
    const { data: response } = await store(object);
    setState((prevState) => ({
      ...prevState,
      storeResponse: response.message,
      open: true,
    }));
    setMessage("");
  };

  return (
    <>
      <Header title="Store Notification" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              {/*  */}
              <div className="flex flex-col gap-2">
                <TextField
                  id="outlined-multiline-static"
                  label="Multiline"
                  multiline
                  rows={4}
                  defaultValue={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button variant="contained" onClick={() => handleSubmit()}>
                  Send
                </Button>
              </div>
              {/*  */}
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={storeResponse}
        key={vertical + horizontal}
      />
    </>
  );
}

export default page;
