import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UnifiedZoneManagement.css";

const UnifiedZoneManagement = () => {
    const [zones, setZones] = useState([]);
    const [types, setTypes] = useState([]);
    const [severities, setSeverities] = useState([]);
    const [assignedZoneIds, setAssignedZoneIds] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedZone, setSelectedZone] = useState("");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedSeverity, setSelectedSeverity] = useState("");

    // Load initial data
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [zoneInfoRes, typeRes, severityRes, assignedRes] = await Promise.all([
                    axios.get("http://localhost:8800/zone-info"),
                    axios.get("http://localhost:8800/disastertype"),
                    axios.get("http://localhost:8800/severitylevel"),
                    axios.get("http://localhost:8800/zones/assigned"),
                ]);
                setZones(zoneInfoRes.data);
                setTypes(typeRes.data);
                setSeverities(severityRes.data);
                setAssignedZoneIds(assignedRes.data.map(z => z.Zone_ID));
            } catch (err) {
                console.error("Error fetching data:", err);
                alert("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedZone || selectedTypes.length === 0 || !selectedSeverity) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            await axios.post("http://localhost:8800/zone/assign-type", {
                zoneId: selectedZone,
                disasterTypeIds: selectedTypes,
            });

            await axios.post("http://localhost:8800/zone/assign-severity", {
                zoneId: selectedZone,
                severityId: selectedSeverity,
            });

            alert(" Zone assignment successful!");


            setSelectedZone("");
            setSelectedTypes([]);
            setSelectedSeverity("");


            const updatedZones = await axios.get("http://localhost:8800/zone-info");
            const updatedAssigned = await axios.get("http://localhost:8800/zones/assigned");
            setZones(updatedZones.data);
            setAssignedZoneIds(updatedAssigned.data.map(z => z.Zone_ID));
        } catch (err) {
            console.error("Assignment error:", err);
            alert("❌ Failed to assign disaster info.");
        }
    };

  

    if (loading) return <div className="zone-container">Loading zone data...</div>;

    return (
        <div className="zone-container">
            <h2>📊 Disaster Zone Overview</h2>
            <table className="zone-table">
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
                            <td>{zone.Last_Updated ? new Date(zone.Last_Updated).toLocaleDateString() : "N/A"}</td>
                            <td>{zone.Disaster_Types || "None"}</td>
                            <td>{zone.Severity_Level || "None"}</td>
                        

                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>🛠 Assign Disaster Type & Severity</h2>
            <form className="assign-form" onSubmit={handleSubmit}>
                <label htmlFor="zone-select">Zone:</label>
                <select
                    id="zone-select"
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    required
                >
                    <option value="">Select Unassigned Zone</option>
                    {zones
                        .filter((z) => !assignedZoneIds.includes(z.Zone_ID))
                        .map((z) => (
                            <option key={z.Zone_ID} value={z.Zone_ID}>
                                {z.Zone_Name}
                            </option>
                        ))}
                </select>

                <label htmlFor="type-select">Disaster Types:</label>
                <select
                    id="type-select"
                    multiple
                    value={selectedTypes}
                    onChange={(e) => setSelectedTypes(Array.from(e.target.selectedOptions, o => o.value))}
                >
                    {types.map((t) => (
                        <option key={t.Type_ID} value={t.Type_ID}>
                            {t.Type_Name}
                        </option>
                    ))}
                </select>

                <label htmlFor="severity-select">Severity Level:</label>
                <select
                    id="severity-select"
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    required
                >
                    <option value="">Select Severity</option>
                    {severities.map((s) => (
                        <option key={s.Severity_ID} value={s.Severity_ID}>
                            {s.Level}
                        </option>
                    ))}
                </select>

                <button type="submit" className="assign-button">✅ Assign</button>
            </form>
        </div>
    );
};

export default UnifiedZoneManagement;
