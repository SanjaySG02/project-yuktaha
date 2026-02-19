"use client";
import { useRef, useState } from "react";

import PixelSnow from "./PixelSnow.jsx";
import styles from "./page.module.css";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleDetect = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setResult(null);
    setBenchmark(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      const prediction = data.prediction;

      // 🔥 IMPORTANT FIX
      // Backend confidence is probability of REAL (sigmoid output)
      const probReal = Number(data.confidence);
      const probFake = 1 - probReal;

      // Final confidence = probability of predicted class
      const finalConfidence =
        prediction === 1 ? probReal : probFake;

      const confidencePercent = (finalConfidence * 100).toFixed(2);

      // Dataset mapping:
      // 0 = fake (AI)
      // 1 = real
      const isReal = prediction === 1;

      const threshold = 0.6;

      if (finalConfidence < threshold) {
        setResult("Uncertain Prediction");
        setBenchmark(`${confidencePercent}% Confidence`);
        setAnalysis(
          "⚠️ The model is not sufficiently confident in this prediction. Try another image or improve training data."
        );
      } else {
        setResult(isReal ? "Real (Camera-captured)" : "AI-generated");
        setBenchmark(`${confidencePercent}% Confidence`);

        setAnalysis(
          isReal
            ? "The model predicts this image follows patterns consistent with natural camera-captured photos."
            : "The model detected patterns consistent with AI-generated imagery."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to backend. Make sure server is running.");
    }

    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setBenchmark(null);
      setAnalysis(null);
    }
  };

  const handleUploadClick = () => {
    inputRef.current.click();
  };

  return (
    <div className={styles.page}>
      <PixelSnow
        color="#b3e0ff"
        flakeSize={0.012}
        minFlakeSize={1.1}
        pixelResolution={180}
        speed={1.1}
        depthFade={7}
        farPlane={18}
        brightness={0.8}
        gamma={0.5}
        density={0.32}
        variant="snowflake"
        direction={120}
      />

      <main className={styles.main} style={{ position: "relative", zIndex: 1 }}>
        <h1 className={styles.title}>
          AI-based Image Authenticity Detection
        </h1>

        <p className={styles.subtitle}>
          Instantly determine if an uploaded image is real (camera-captured) or AI-generated.
        </p>

        <div className={styles.uploadSection}>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <button className={styles.uploadBtn} onClick={handleUploadClick}>
            {selectedImage ? "Change Image" : "Upload Image"}
          </button>

          {previewUrl && (
            <div className={styles.previewContainer}>
              <img
                src={previewUrl}
                alt="Preview"
                className={styles.previewImg}
              />
            </div>
          )}
        </div>

        <button
          className={styles.detectBtn}
          onClick={handleDetect}
          disabled={!selectedImage || loading}
        >
          {loading ? "Analyzing..." : "Detect Authenticity"}
        </button>

        {result && (
          <div className={styles.resultBox}>
            <span
              className={
                result.includes("Real")
                  ? styles.real
                  : result.includes("AI")
                  ? styles.fake
                  : styles.uncertain
              }
            >
              {result.includes("Real")
                ? "🟢📷 "
                : result.includes("AI")
                ? "🤖🔴 "
                : "⚠️ "}
              {result}
            </span>

            <div className={styles.benchmark}>
              <strong>Confidence:</strong> {benchmark}
            </div>

            <div className={styles.analysisReport}>
              <strong>Analysis Report:</strong>
              <p>{analysis}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
