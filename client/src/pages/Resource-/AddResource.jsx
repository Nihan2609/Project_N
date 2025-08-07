import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddResource = () => {
const [resource, setResource] = useState({
  Resource_Type: "",
  Unit: "",
  Description: ""
});


  const navigate = useNavigate();

  const handleChange = (e) => {
    setResource((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/resource", resource);
      navigate("/resource");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Add Resource</h1>
      <form onSubmit={handleClick}>
        <input type="text" name="Resource_Type" placeholder="Type" onChange={handleChange} required />
<input type="text" name="Unit" placeholder="Unit" onChange={handleChange} required />
<input type="text" name="Description" placeholder="Description" onChange={handleChange} />

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddResource;
