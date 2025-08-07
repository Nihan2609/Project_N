import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Center = () => {
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get("http://localhost:8800/reliefcenters");
        setCenters(res.data);
      } catch (err) {
        console.error("Failed to load centers", err);
      }
    };
    fetchCenters();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/reliefcenters/${id}`);
      setCenters(centers.filter(c => c.Center_ID !== id));
    } catch (err) {
      console.error("Failed to delete center", err);
    }
  };

  return (
    <div>
      <h2>Relief Centers</h2>
      
      <ul>
        {centers.map(c => (
          <li key={c.Center_ID}>
            {c.Name} ({c.Location}) - Capacity: {c.Capacity}
            <button onClick={() => handleDelete(c.Center_ID)}>Delete</button>
          </li>
        ))}
      </ul>
      <Link to="/home">
            <button>Home</button>
            </Link>
    </div>
  );
};

export default Center;