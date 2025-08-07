import axios from "axios";
import React, { useState }  from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateVolunteer =() =>{
    const [volunteer,setVolunteer] = useState({
        Name:"",
        Contact_Info: "",
        Skill: "",
    });

    const navigate = useNavigate()
    const location = useLocation()

    const Volunteer_ID = location.pathname.split("/")[2]

    console.log(location.pathname.split("/")[2])

    const handleChange = (e) =>{
        setVolunteer(prev=>({
            ...prev,
            [e.target.name]:e.target.value,
        }));
    };

    const handleClick = async e =>{
        e.preventDefault()
        try {
            await axios.put("http://localhost:8800/volunteer/"+Volunteer_ID,volunteer)
            navigate ("/volunteer")
        } catch (err) {
            console.log(err)
        }
    }
    console.log(volunteer)
    return(
        <div className="form">
            <h1>Update the Volunteer</h1>
            <input type="text" placeholder="Name" onChange={handleChange} name="Name"/>
            <input type="text" placeholder="Contact_Info"onChange={handleChange} name="Disaster_status"/>
            <input type="text" placeholder="Skill" onChange={handleChange} name="Last_update"/>
            <button onClick={handleClick}>Update</button>

        </div>
    )
}

export default UpdateVolunteer