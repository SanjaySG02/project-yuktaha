

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

  // Placeholder for detection logic
  const handleDetect = async () => {
    setLoading(true);
    setResult(null);
    setBenchmark(null);
    setAnalysis(null);
    // Simulate API call
    setTimeout(() => {
      // Randomly simulate real or AI-generated
      const isReal = Math.random() > 0.5;
      setResult(isReal ? "Real (Camera-captured)" : "AI-generated");
      setBenchmark(isReal ? "90% Real" : "90% Fake");
      setAnalysis(
        isReal
          ? "The image exhibits natural noise patterns, consistent color gradients, and lacks common AI artifacts such as unnatural textures or irregular edges."
          : "The image shows signs of AI generation: possible texture inconsistencies, smoothness in regions where natural images have detail, and minor edge artifacts detected."
      );
      setLoading(false);
    }, 1800);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleUploadClick = () => {
    inputRef.current.click();
  };

  return (
    <div className={styles.page}>
      <PixelSnow color="#b3e0ff" flakeSize={0.012} minFlakeSize={1.1} pixelResolution={180} speed={1.1} depthFade={7} farPlane={18} brightness={0.8} gamma={0.5} density={0.32} variant="snowflake" direction={120} />
      <main className={styles.main} style={{ position: "relative", zIndex: 1 }}>
        <h1 className={styles.title}>AI-based Image Authenticity Detection</h1>
        <p className={styles.subtitle}>
          Instantly determine if an uploaded image is real (camera-captured) or AI-generated. Prevent the misuse of AI images on your platform.
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
              <img src={previewUrl} alt="Preview" className={styles.previewImg} />
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
            <span className={result.includes("Real") ? styles.real : styles.fake}>
              {result}
            </span>
            <div className={styles.benchmark}>
              <strong>Benchmark Rating:</strong> {benchmark}
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
