import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) return;

        const userRes = await axios.get(`http://localhost:8800/donor/${userId}`);
        setUser(userRes.data);

        const donationRes = await axios.get(`http://localhost:8800/donor/${userId}/donations`);
        setDonations(donationRes.data);
      } catch (err) {
        console.error("Failed to load user dashboard", err);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user) return <div>Loading your dashboard...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>
        Welcome, {user.Is_Anonymous ? "Valued Donor 🙏" : user.Name}
      </h1>

      <section style={styles.section}>
        <h2>💝 Your Donations</h2>
        {donations.length > 0 ? (
          <ul style={styles.list}>
            {donations.map((d) => (
              <li key={d.Donation_ID} style={styles.listItem}>
                <strong>{d.Resource_Type}</strong> – {d.Quantity} Unit
                <br />
                <span style={styles.date}>
                  Donated on: {new Date(d.Donation_Date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noDonations}>You haven’t made any donations yet. 💬</p>
        )}
      </section>

      <section style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => navigate("/donate")}>
          🎁 Make a Donation
        </button>
        <button style={styles.button} onClick={() => navigate("/donor")}>
          🙍‍♂️ My Profile
        </button>
        <button
          style={styles.logoutButton}
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          🚪 Logout
        </button>
      </section>
    </div>
  );
};

export default UserDashboard;

const styles = {
  container: {
    maxWidth: "700px",
    margin: "auto",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    lineHeight: 1.6,
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  section: {
    marginTop: "1.5rem",
  },
  list: {
    listStyleType: "none",
    paddingLeft: 0,
  },
  listItem: {
    background: "#f9f9f9",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  date: {
    fontSize: "0.9rem",
    color: "#666",
  },
  noDonations: {
    color: "#888",
    fontStyle: "italic",
  },
  buttonGroup: {
    marginTop: "2rem",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  logoutButton: {
    padding: "10px 16px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
