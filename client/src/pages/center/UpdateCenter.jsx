import { useEffect, useState } from "react";
import { useNavigate, useParams,Link } from "react-router-dom";
import axios from "axios";

const UpdateCenter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Name: "",
    Contact_Info: "",
    Location: "",
    Capacity: "",
  });

  useEffect(() => {
    const fetchCenter = async () => {
      try {
        const res = await axios.get("http://localhost:8800/reliefcenters");
        const center = res.data.find(c => c.Center_ID.toString() === id);
        if (center) setForm(center);
      } catch (err) {
        console.error("Failed to load center", err);
      }
    };
    fetchCenter();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8800/reliefcenters/${id}`, form);
      navigate("/reliefcenter");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div>
      <h2>Update Relief Center</h2>
      <form onSubmit={handleSubmit}>
        <input name="Name" value={form.Name} onChange={handleChange} required />
        <input name="Contact_Info" value={form.Contact_Info} onChange={handleChange} required />
        <input name="Location" value={form.Location} onChange={handleChange} required />
        <input name="Capacity" type="number" value={form.Capacity} onChange={handleChange} required />
        <button type="submit">Update Center</button>
      </form>
      <Link to="/home">
            <button>Home</button>
            </Link>
    </div>
  );
};

export default UpdateCenter;
