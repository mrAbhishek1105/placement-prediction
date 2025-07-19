// EdaContext.js
import React, { createContext, useState, useEffect } from 'react';

export const EdaContext = createContext();

export const EdaProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/eda");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <EdaContext.Provider value={{ stats, loading, error }}>
      {children}
    </EdaContext.Provider>
  );
};