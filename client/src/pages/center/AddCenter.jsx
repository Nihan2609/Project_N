import { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

const AddCenter = () => {
  const [form, setForm] = useState({
    Name: "",
    Contact_Info: "",
    Location: "",
    Capacity: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/reliefcenters", form);
      navigate("/centers");
    } catch (err) {
      console.error("Add center failed", err);
    }
  };

  return (
    <div>
      <h2>Add Relief Center</h2>
      <form onSubmit={handleSubmit}>
        <input name="Name" placeholder="Name" onChange={handleChange} required />
        <input name="Contact_Info" placeholder="Contact Info" onChange={handleChange} required />
        <input name="Location" placeholder="Location" onChange={handleChange} required />
        <input name="Capacity" type="number" placeholder="Capacity" onChange={handleChange} required />
        <button type="submit">Add Center</button>
      </form>
      <Link to="/home">
            <button>Home</button>
            </Link>
    </div>
  );
};

export default AddCenter;
