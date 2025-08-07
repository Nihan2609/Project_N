import axios from "axios";
import React, { useState }  from "react";
import { useNavigate,Link } from "react-router-dom";

const AddZone =() =>{
    const [disasterZone,setDisasterZone] = useState({
        Name:"",
        Disaster_status: "",
        Last_update: "",
    });

    const navigate = useNavigate()

    const handleChange = (e) =>{
        setDisasterZone(prev=>({
            ...prev,
            [e.target.name]:e.target.value,
        }));
    };

    const handleClick = async e =>{
        e.preventDefault()
        try {
            await axios.post("http://localhost:8800/disasterzone",disasterZone)
            navigate ("/disasterzone")
        } catch (err) {
            console.log(err)
        }
    }
    console.log(disasterZone)
    return(
        <div className="form">
            <h1>Add new Zone</h1>
            <input type="text" placeholder="Name" onChange={handleChange} name="Name"/>
            <input type="text" placeholder="Disaster_status"onChange={handleChange} name="Disaster_status"/>
            <input type="datetime-local" placeholder="Last_update" onChange={handleChange} name="Last_update"/>
            <button onClick={handleClick}>Add</button>
            <Link to="/home">
            <button>Home</button>
            </Link>

        </div>
    )
}

export default AddZone