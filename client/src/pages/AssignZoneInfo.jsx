import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignZoneInfo = () => {
  const [zones, setZones] = useState([]);
  const [types, setTypes] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [zoneRes, typeRes, severityRes] = await Promise.all([
        axios.get("http://localhost:8800/disasterzone"),
        axios.get("http://localhost:8800/disastertype"),
        axios.get("http://localhost:8800/severitylevel"),
      ]);
      setZones(zoneRes.data);
      setTypes(typeRes.data);
      setSeverities(severityRes.data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/zone/assign-type", {
        zoneId: selectedZone,
        disasterTypeIds: selectedTypes,
      });
      await axios.post("http://localhost:8800/zone/assign-severity", {
        zoneId: selectedZone,
        severityId: selectedSeverity,
      });
      alert("Zone updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to assign zone info");
    }
  };

  return (
    <div>
      <h2>Assign Disaster Type & Severity</h2>
      <form onSubmit={handleSubmit}>
        <label>Zone:</label>
        <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)} required>
          <option value="">-- Select Zone --</option>
          {zones.map((z) => (
            <option key={z.Zone_ID} value={z.Zone_ID}>{z.Name}</option>
          ))}
        </select>

        <label>Disaster Types:</label>
        <select multiple onChange={(e) => setSelectedTypes([...e.target.selectedOptions].map(o => o.value))}>
          {types.map((t) => (
            <option key={t.Type_ID} value={t.Type_ID}>{t.Type_Name}</option>
          ))}
        </select>

        <label>Severity Level:</label>
        <select value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)} required>
          <option value="">-- Select Severity --</option>
          {severities.map((s) => (
            <option key={s.Severity_ID} value={s.Severity_ID}>{s.Level}</option>
          ))}
        </select>

        <button type="submit">Assign</button>
      </form>
    </div>
  );
};

export default AssignZoneInfo;