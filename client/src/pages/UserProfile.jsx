import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css"; 

const UserProfile = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/donor/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8800/donor/${userId}`, {
        Name: user.Name,
        Contact_Info: user.Contact_Info,
        Is_Anonymous: user.Is_Anonymous
      });
      alert("Profile updated!");
      setEdit(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Profile update failed");
    }
  };

  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="user-profile-container">
      <h2>My Profile</h2>
      {edit ? (
        <div >
          <input name="Name" value={user.Name} onChange={handleChange} />
          <input name="Contact_Info" value={user.Contact_Info} onChange={handleChange} />
          <label>
            <input
              type="checkbox"
              checked={user.Is_Anonymous}
              onChange={() =>
                setUser((prev) => ({
                  ...prev,
                  Is_Anonymous: !prev.Is_Anonymous
                }))
              }
            />{" "}
            Donate Anonymously
          </label>
          <button onClick={handleUpdate}>Save</button>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> {user.Name}</p>
          <p><strong>Contact:</strong> {user.Contact_Info}</p>
          <p><strong>Anonymous:</strong> {user.Is_Anonymous ? "Yes" : "No"}</p>
          <button onClick={() => setEdit(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

