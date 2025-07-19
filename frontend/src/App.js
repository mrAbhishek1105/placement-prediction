import React, { useState, useContext } from "react";
import { EdaProvider, EdaContext } from "./EdaContext"; 
import Stats from "./Stats"; 
import "./App.css"; 

const App = () => {
  const [formData, setFormData] = useState({
    cgpa: "",
    skills: "",
    internships: "",
    projects: "",
    certifications: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { stats, loading: statsLoading, error } = useContext(EdaContext); // Use EDA context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cgpa: parseFloat(formData.cgpa),
          skills: parseInt(formData.skills),
          internships: parseInt(formData.internships),
          projects: parseInt(formData.projects),
          certifications: parseInt(formData.certifications),
        }),
      });
      const data = await response.json();
      setResult(data.placement_result);
      setModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Placement Prediction</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div key={key} className="input-group">
              <label>{key.toUpperCase()}</label>
              <input
                type="number"
                name={key}
                value={formData[key]}                onChange={handleChange}
                required
              />
            </div>
          ))}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>
      </div>

      {/* Displaying the Stats Component */}
      <Stats />

      {/* Displaying the Prediction Result Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Prediction Result</h3>
            <p className="result-text">{result}</p>
            <button className="close-btn" onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const WrappedApp = () => (
  <EdaProvider>
    <App />
  </EdaProvider>
);

export default WrappedApp;