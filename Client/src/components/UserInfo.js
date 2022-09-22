import React, { useState } from "react";
import { useDataContext } from "../ContextApi/DataContext";
import Clock from "./Clock";

const UserInfo = () => {
  const { currentUser } = useDataContext();

  return (
    <>
      {currentUser !== "" && <div>UserInfo: {currentUser}</div>}
      <span>
        <Clock />
      </span>
    </>
  );
};

export default UserInfo;
