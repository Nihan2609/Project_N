import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const res = await axios.get("http://localhost:8800/request");
        setRequests(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllRequests();
  }, []);

  const handleDelete = async (Request_ID) => {
    try {
      await axios.delete("http://localhost:8800/request/" + Request_ID);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>All Requests</h1>
      <ul>
        {requests.map((rid) => (
          <li key={rid.Request_ID}>
            {rid.Request_ID} - {rid.Zone_ID} - {rid.Req_Status} - {rid.Urgency}
            <div>
              <button className="delete" onClick={() => handleDelete(rid.Request_ID)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>


      <div style={{ marginTop: "20px" }}>
        <Link to="/AddRequest">
          <button>Add New Request</button>
        </Link>{" "}
        <Link to="/home">
          <button>Home</button>
        </Link>
      </div>
    </div>
  );
};

export default Requests;