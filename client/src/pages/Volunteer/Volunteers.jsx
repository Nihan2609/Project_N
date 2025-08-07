import React, { useEffect, useState }  from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Volunteers =() =>{

    const [volunteers,setVolunteers]=useState([])

    useEffect (() =>{
        const fetchAllVolunteers = async () =>{
            try{
                const res  = await axios.get("http://localhost:8800/volunteer")
                setVolunteers(res.data);
            }catch(err){
                console.log(err)

            }
        };
        fetchAllVolunteers();
    },[]);

    const handleDelete = async(Volunteer_ID) =>{
        try{
            await axios.delete("http://localhost:8800/volunteer/"+ Volunteer_ID)
            window.location.reload()
        }catch(err){
            console.log(err)
        }
    }


  return (
    <div>
      <h1>All volunteers</h1>
      <ul>
        {volunteers.map((vid) => (
          <li key={vid.Volunteer_ID}>
            {vid.Name} - {vid.Contact_Info} - {vid.Skill}
            <div>
              <button className="delete" onClick={() => handleDelete(vid.Volunteer_ID)}>
                Delete Volunteer
              </button>
              <button className="update">
                <Link to={`/updateVolunteer/${vid.Volunteer_ID}`}>Update Volunteer</Link>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button>
        <Link to="/AddVolunteer">Add new Volunteer</Link>
      </button>
    </div>
  );
};

export default Volunteers;