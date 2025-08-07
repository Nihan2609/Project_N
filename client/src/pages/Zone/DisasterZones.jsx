import React, { useEffect, useState }  from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DisasterZones =() =>{

    const [disasterZones,setDisasterZones]=useState([])

    useEffect (() =>{
        const fetchAllZones = async () =>{
            try{
                const res  = await axios.get("http://localhost:8800/disasterzone")
                setDisasterZones(res.data);
            }catch(err){
                console.log(err)

            }
        };
        fetchAllZones();
    },[]);

    const handleDelete = async(Zone_ID) =>{
        try{
            await axios.delete("http://localhost:8800/disasterzone/"+ Zone_ID)
            window.location.reload()
        }catch(err){
            console.log(err)
        }
    }


  return (
    <div>
      <h1>All Disaster Zones</h1>
      <ul>
        {disasterZones.map((zone) => (
          <li key={zone.Zone_ID}>
            {zone.Name} - {zone.Disaster_Status} (Last update:{" "}
            {new Date(zone.Last_Update).toLocaleDateString()})
            <div>
              <button className="delete" onClick={() => handleDelete(zone.Zone_ID)}>
                Delete
              </button>
              <button className="update">
                <Link to={`/updateZone/${zone.Zone_ID}`}>Update</Link>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button>
        <Link to="/AddZone">Add new Zone</Link>
      </button>
    </div>
  );
};

export default DisasterZones