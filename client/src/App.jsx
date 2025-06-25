import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post("http://localhost:4000/analyze", formData);
      setResult(res.data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Resume Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Analyze Resume</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h2>AI Feedback</h2>
          <pre>{result.analysis}</pre>

          <h3>Matching Jobs</h3>
          <ul>
            {result.jobs.map((job, i) => (
              <li key={i}>{job.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
