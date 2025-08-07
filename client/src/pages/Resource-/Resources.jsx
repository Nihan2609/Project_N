import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Resources = () => {
  const [resource, setResources] = useState([]);

  useEffect(() => {
    const fetchAllResources = async () => {
      try {
        const res = await axios.get("http://localhost:8800/resource");
        setResources(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllResources();
  }, []);

  const handleDelete = async (Resource_ID) => {
    try {
      await axios.delete("http://localhost:8800/resource/" + Resource_ID);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Resources</h1>
<ul>
  {resource.map((r) =>
    r.Resource_Type && r.Unit ? (
      <li key={r.Resource_ID}>
        {r.Resource_Type}   -   {r.Unit}
        <button onClick={() => handleDelete(r.Resource_ID)}>Delete</button>
      </li>
    ) : null
  )}
</ul>

      <Link to="/addresource">Add New Resource</Link>
    </div>
  );
};

export default Resources;
