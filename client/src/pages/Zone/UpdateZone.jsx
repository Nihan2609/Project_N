import axios from "axios";
import React, { useState }  from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateZone =() =>{
    const [disasterZone,setDisasterZone] = useState({
        Name:"",
        Disaster_status: "",
        Last_update: "",
    });

    const navigate = useNavigate()
    const location = useLocation()

    const Zone_ID = location.pathname.split("/")[2]

    console.log(location.pathname.split("/")[2])

    const handleChange = (e) =>{
        setDisasterZone(prev=>({
            ...prev,
            [e.target.name]:e.target.value,
        }));
    };

    const handleClick = async e =>{
        e.preventDefault()
        try {
            await axios.put("http://localhost:8800/disasterzone/"+Zone_ID,disasterZone)
            navigate ("/disasterzone")
        } catch (err) {
            console.log(err)
        }
    }
    console.log(disasterZone)
    return(
        <div className="form">
            <h1>Update the Zone</h1>
            <input type="text" placeholder="Name" onChange={handleChange} name="Name"/>
            <input type="text" placeholder="Disaster_status"onChange={handleChange} name="Disaster_status"/>
            <input type="datetime-local" placeholder="Last_update" onChange={handleChange} name="Last_update"/>
            <button onClick={handleClick}>Update</button>

        </div>
    )
}

export default UpdateZone