import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const API_URL = "http://localhost:8080/api/reports/match-lost-person";

export default function MatchFaces() {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState("");

  // Capture image from webcam
  const captureAndSend = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    const blob = await fetch(imageSrc).then((res) => res.blob());

    const formData = new FormData();
    formData.append("image", blob, "webcam.jpg");

    setMessage("Matching... please wait.");

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    const text = await response.text();
    setMessage(text);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Match Lost Person</h1>

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
        height={300}
        style={{ borderRadius: "10px", marginBottom: "10px" }}
      />

      <br />
      <button
        onClick={captureAndSend}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          background: "blue",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Capture & Match
      </button>

      <p style={{ marginTop: "20px", fontSize: "18px", fontWeight: "bold" }}>
        {message}
      </p>
    </div>
  );
}
