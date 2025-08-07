import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AddRequest = () => {
  const [request, setRequest] = useState({
    Zone_ID: "",
    Req_Status: "",
    Urgency: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setRequest((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/request", request);
      navigate("/request");
    } catch (err) {
      console.error(err);
    }
  };

  return(
        <div className="form">
            <h1>Add new Request</h1>
            <input type="number" placeholder="Zone_ID" onChange={handleChange} name="Zone_ID"/>
            <input type="text" placeholder="Req_Status"onChange={handleChange} name="Req_Status"/>
            <input type="text" placeholder="Urgency" onChange={handleChange} name="Urgency"/>
            <button onClick={handleClick}>Add</button>

        </div>
    )
};

export default AddRequest;
