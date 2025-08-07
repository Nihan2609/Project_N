import React, { useEffect, useState } from "react";
import axios from "axios";

const ZoneInfo = () => {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8800/zone-info")
      .then(res => setZones(res.data))
      .catch(err => console.error("Error loading zones", err));
  }, []);

  return (
    <div>
      <h2>Disaster Zone Overview</h2>
      <table>
        <thead>
          <tr>
            <th>Zone Name</th>
            <th>Last Update</th>
            <th>Disaster Types</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((zone) => (
            <tr key={zone.Zone_ID}>
              <td>{zone.Zone_Name}</td>
              <td>{zone.Last_Updated}</td>
              <td>{zone.Disaster_Types || "N/A"}</td>
              <td>{zone.Severity_Level || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default ZoneInfo;
