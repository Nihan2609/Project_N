import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VolunteerDashboard.css"; // Optional CSS for styling

const VolunteerDashboard = () => {
  const [volunteer, setVolunteer] = useState(null);
  const [zone, setZone] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const volunteerId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        if (!volunteerId) {
          setError("Volunteer not logged in.");
          setLoading(false);
          return;
        }

        const vRes = await axios.get(`http://localhost:8800/volunteer/${volunteerId}`);
        setVolunteer(vRes.data);

        const assignmentRes = await axios.get(`http://localhost:8800/volunteering/volunteer/${volunteerId}`);
        if (assignmentRes.data.length > 0) {
          const zoneId = assignmentRes.data[0].Zone_ID;

          const zRes = await axios.get(`http://localhost:8800/disasterzone/${zoneId}`);
          setZone(zRes.data);

          const rRes = await axios.get(`http://localhost:8800/zone/${zoneId}/resources`);
          setResources(rRes.data);
        } else {
          setZone(null);
          setResources([]);
        }
      } catch (err) {
        console.error("Failed to load volunteer dashboard:", err);
        setError("Something went wrong while loading your dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerData();
  }, [volunteerId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  if (loading) return <div className="dashboard-container">Loading dashboard...</div>;
  if (error) return <div className="dashboard-container error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="welcome-heading">👋 Welcome, {volunteer?.Name}</h1>

      {zone ? (
        <div className="zone-info">
          <h2>📍 Assigned Zone</h2>
          <p><strong>Zone Name:</strong> {zone.Name}</p>
          <p><strong>Status:</strong> {zone.Disaster_Status}</p>
          <p><strong>Last Updated:</strong> {new Date(zone.Last_Update).toLocaleString()}</p>

          <h2>📦 Available Resources</h2>
          {resources.length > 0 ? (
            <ul className="resource-list">
              {resources.map((r) => (
                <li key={r.Resource_ID}>
                  <strong>{r.Resource_Type}</strong>: {r.Quantity} {r.Unit}
                </li>
              ))}
            </ul>
          ) : (
            <p>No resources available in this zone.</p>
          )}
        </div>
      ) : (
        <div className="no-assignment">
          <p>⚠️ You are not assigned to any zone yet. Please wait for the admin to assign you.</p>
        </div>
      )}

      <div className="dashboard-actions">
        <button className="btn" onClick={handleProfile}>👤 My Profile</button>
        <button className="btn logout" onClick={handleLogout}>🚪 Logout</button>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
