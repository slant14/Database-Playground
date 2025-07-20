import React from "react";
import { useNavigate } from "react-router-dom";
import ClassRooms from "./Classrooms";

const ClassRoomsWrapper = (props) => {
  const navigate = useNavigate();
  return <ClassRooms {...props} navigate={navigate} />;
};

export default ClassRoomsWrapper;