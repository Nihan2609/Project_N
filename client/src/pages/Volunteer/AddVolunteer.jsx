import axios from "axios";
import React, { useState }  from "react";
import { useNavigate } from "react-router-dom";

const AddVolunteer =() =>{
    const [volunteer,setVolunteer] = useState({
        Name:"",
        Contact_Info: "",
        Skill: "",
    });

    const navigate = useNavigate()

    const handleChange = (e) =>{
        setVolunteer(prev=>({
            ...prev,
            [e.target.name]:e.target.value,
        }));
    };

    const handleClick = async e =>{
        e.preventDefault()
        try {
            await axios.post("http://localhost:8800/volunteer",volunteer)
            navigate ("/volunteer")
        } catch (err) {
            console.log(err)
        }
    }
    console.log(volunteer)
    return(
        <div className="form">
            <h1>Add new volunteer</h1>
            <input type="text" placeholder="Name" onChange={handleChange} name="Name"/>
            <input type="text" placeholder="Contact_Info"onChange={handleChange} name="Contact_Info"/>
            <input type="text" placeholder="Skill" onChange={handleChange} name="Skill"/>
            <button onClick={handleClick}>Add</button>

        </div>
    )
}

export default AddVolunteer