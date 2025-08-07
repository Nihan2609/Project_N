import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MakeDonation = () => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    resourceId: "",
    quantity: "",
  });

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get("http://localhost:8800/resource");
        setResources(res.data);
      } catch (err) {
        console.error("Failed to load resources", err);
      }
    };
    fetchResources();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/donation", {
        Donor_ID: userId,
        Resource_ID: form.resourceId,
        Quantity: form.quantity,
      });
      alert("Donation successful!");
      navigate("/user/dashboard");
    } catch (err) {
      console.error("Donation failed", err);
      alert("Donation failed");
    }
  };

  return (
    <div>
      <h2>Make a Donation</h2>
      <form onSubmit={handleSubmit}>
        <label>Resource:</label>
        <select
          name="resourceId"
          value={form.resourceId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Resource --</option>
          {resources.map((r) => (
            <option key={r.Resource_ID} value={r.Resource_ID}>
              {r.Resource_Type} ({r.Unit})
            </option>
          ))}
        </select>

        <br />
        <label>Quantity:</label>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <br />
        <button type="submit">Donate</button>
      </form>
    </div>
  );
};

export default MakeDonation;
