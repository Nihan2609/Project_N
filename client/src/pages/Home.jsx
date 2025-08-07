import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./stylehome.css";

const Home = () => {
  const [summary, setSummary] = useState({
    zones: 0,
    volunteers: 0,
    requests: 0,
    resources: 0,
    recentZones: []
  });

  const [volunteers, setVolunteers] = useState([]);
  const [zonesList, setZonesList] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zones, volunteers, requests, resources] = await Promise.all([
          axios.get("http://localhost:8800/disasterzone"),
          axios.get("http://localhost:8800/volunteer"),
          axios.get("http://localhost:8800/request"),
          axios.get("http://localhost:8800/resource")
        ]);

        setSummary({
          zones: zones.data.length,
          volunteers: volunteers.data.length,
          requests: requests.data.length,
          resources: resources.data.length,
          recentZones: zones.data.slice(-3).reverse()
        });

        setVolunteers(volunteers.data);
        setZonesList(zones.data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8800/assignments")
      .then(res => setAssignments(res.data))
      .catch(err => console.error("Error fetching assignments:", err));
  }, []);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donationRes = await axios.get("http://localhost:8800/donation");
        setDonations(donationRes.data);
      } catch (err) {
        console.error("Failed to fetch donation data:", err);
      }
    };
    fetchDonations();
  }, []);

  const assignVolunteerToZone = async () => {
    if (!selectedVolunteer || !selectedZone) {
      alert("Please select both a volunteer and a zone.");
      return;
    }

    try {
      await axios.put(`http://localhost:8800/volunteer/${selectedVolunteer}/assign-zone`, {
        Zone_ID: selectedZone
      });
      alert("Volunteer assigned successfully!");
      setSelectedVolunteer("");
      setSelectedZone("");
      const updatedAssignments = await axios.get("http://localhost:8800/assignments");
      setAssignments(updatedAssignments.data);
    } catch (err) {
      alert("Failed to assign volunteer.");
      console.error(err);
    }
  };

  const handleDeleteAssignment = async (volunteerId, zoneId) => {
    try {
      await axios.delete("http://localhost:8800/volunteering", {
        data: { Volunteer_ID: volunteerId, Zone_ID: zoneId },
      });
      alert("Assignment removed!");
      const updated = await axios.get("http://localhost:8800/assignments");
      setAssignments(updated.data);
    } catch (err) {
      console.error("Failed to remove assignment:", err);
      alert("Error removing assignment.");
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Disaster Relief Admin Dashboard</h1>

      {/* Summary */}
      <section className="summary-cards">
        {[
          { key: "zones", label: "Disaster Zones" },
          { key: "volunteers", label: "Volunteers" },
          { key: "requests", label: "Requests" },
          { key: "resources", label: "Resources" }
        ].map(({ key, label }) => (
          <div className="card" key={key}>
            <h2>{summary[key]}</h2>
            <p>{label}</p>
          </div>
        ))}
      </section>

      {/* Assignment Table */}
      <section className="section">
        <h2>Volunteer Assignments</h2>
        {assignments.length === 0 ? (
          <p>No volunteers have been assigned to zones yet.</p>
        ) : (
          <table className="assignment-table">
            <thead>
              <tr>
                <th>Volunteer ID</th>
                <th>Name</th>
                <th>Skill</th>
                <th>Assigned Zone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, idx) => (
                <tr key={idx}>
                  <td>{a.Volunteer_ID}</td>
                  <td>{a.Volunteer_Name}</td>
                  <td>{a.Skill}</td>
                  <td>{a.Zone_Name}</td>
                  <td>{a.Disaster_Status}</td>
                  <td>
                    <button className="delete" onClick={() => handleDeleteAssignment(a.Volunteer_ID, a.Zone_ID)}>
                      ❌ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Assign Volunteer */}
      <section className="section">
        <h2>Assign Volunteer to Disaster Zone</h2>
        <div className="form-inline">
          <select value={selectedVolunteer} onChange={(e) => setSelectedVolunteer(e.target.value)}>
            <option value="">Select Volunteer</option>
            {volunteers
              .filter(v => !assignments.some(a => a.Volunteer_ID === v.Volunteer_ID))
              .map(v => (
                <option key={v.Volunteer_ID} value={v.Volunteer_ID}>
                  {v.Name} (ID: {v.Volunteer_ID})
                </option>
              ))}
          </select>

          <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
            <option value="">Select Zone</option>
            {zonesList.map(z => (
              <option key={z.Zone_ID} value={z.Zone_ID}>
                {z.Name} (ID: {z.Zone_ID})
              </option>
            ))}
          </select>

          <button className="btn primary" onClick={assignVolunteerToZone}>✅ Assign</button>
        </div>
      </section>

      {/* Recent Zones */}
      <section className="section">
        <h2>Recent Disaster Zone Updates</h2>
        <ul className="recent-updates">
          {summary.recentZones.length === 0 ? (
            <li>No recent updates available.</li>
          ) : (
            summary.recentZones.map(zone => (
              <li key={zone.Zone_ID}>
                <strong>{zone.Name}</strong> – {zone.Disaster_Status}
                <span className="update-date"> ({new Date(zone.Last_Update).toLocaleDateString()})</span>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Donations */}
      <section className="section">
        <h2>Donor Contributions</h2>
        {donations.length === 0 ? (
          <p>No donations recorded yet.</p>
        ) : (
          <table className="assignment-table">
            <thead>
              <tr>
                <th>Donor Name</th>
                <th>Contact Info</th>
                <th>Resource Type</th>
                <th>Quantity</th>
                <th>Donation Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d, idx) => (
                <tr key={idx}>
                  <td>{d.Donor_Name || "Anonymous"}</td>
                  <td>{d.Contact_Info || "N/A"}</td>
                  <td>{d.Resource_Type || "N/A"}</td>
                  <td>{d.Quantity}</td>
                  <td>{new Date(d.Donation_Date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Quick Actions */}
      <section className="section">
        <h2>Quick Navigation</h2>
        <div className="links-grid">
          <Link to="/addZone" className="btn">➕ Add Zone</Link>
          <Link to="/addVolunteer" className="btn">➕ Add Volunteer</Link>
          <Link to="/addRequest" className="btn">➕ Add Request</Link>
          <Link to="/addResource" className="btn">➕ Add Resource</Link>
          <Link to="/addcenter" className="btn">➕ Add Relief Center</Link>

          <Link to="/disasterzone" className="btn">📋 Manage Zones</Link>
          <Link to="/volunteer" className="btn">📋 Manage Volunteers</Link>
          <Link to="/resource" className="btn">📋 Manage Resources</Link>
          <Link to="/request" className="btn">📋 Manage Requests</Link>
          <Link to="/center" className="btn">📋 Manage Centers</Link>
          <Link to="/distribute" className="btn">🚚 Distribute Donations</Link>
          <Link to="/unfiled" className="btn">📌 Assign Zones</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
