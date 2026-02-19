

"use client";
import { useRef, useState } from "react";

import PixelSnow from "./PixelSnow.jsx";
import FaceViewer from "./FaceViewer.jsx";
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
        {/* Animated emoji/text on left side */}
        <div
          style={{
            position: 'fixed',
            left: '32px',
            bottom: '160px',
            width: '220px',
            zIndex: 11,
            pointerEvents: 'none',
            display: result ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            height: 'calc(100vh - 160px)',
          }}
        >
          {result && result.includes('Real') && (
            <>
              <div style={{
                animation: 'floatAround 2.5s cubic-bezier(0.4,0,0.2,1)',
                fontSize: '3.2rem',
                marginBottom: '8px',
                color: '#1aaf5d',
                textShadow: '0 4px 16px rgba(26,175,93,0.25), 0 1px 0 #fff',
                pointerEvents: 'auto',
                display: 'inline-block',
                position: 'relative',
              }}>
                😊
              </div>
              <div style={{
                animation: 'moveUp 1.2s cubic-bezier(0.4,0,0.2,1)',
                fontSize: '1.4rem',
                marginBottom: '24px',
                color: '#1aaf5d',
                fontWeight: 700,
                background: 'none',
                borderRadius: 0,
                padding: 0,
                boxShadow: 'none',
                pointerEvents: 'auto',
                display: 'inline-block',
              }}>
                Great! This is a real image!
              </div>
            </>
          )}
          {result && result.includes('AI-generated') && (
            <>
              <div style={{
                animation: 'floatAround 2.5s cubic-bezier(0.4,0,0.2,1)',
                fontSize: '3.2rem',
                marginBottom: '8px',
                color: '#e63946',
                textShadow: '0 4px 16px rgba(230,57,70,0.25), 0 1px 0 #fff',
                pointerEvents: 'auto',
                display: 'inline-block',
                position: 'relative',
              }}>
                😡
              </div>
              <div style={{
                animation: 'moveUp 1.2s cubic-bezier(0.4,0,0.2,1)',
                fontSize: '1.4rem',
                marginBottom: '24px',
                color: '#e63946',
                fontWeight: 700,
                background: 'none',
                borderRadius: 0,
                padding: 0,
                boxShadow: 'none',
                pointerEvents: 'auto',
                display: 'inline-block',
              }}>
                Warning! This is an AI image!
              </div>
            </>
          )}
        </div>
        
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
                {result.includes("Real") ? "🟢📷 " : "🤖🔴 "}{result}
              </span>
              <div className={styles.benchmark}>
                <strong>Benchmark Rating:</strong> {benchmark.includes("Real") ? "🌟" : "⚠️"} {benchmark}
              </div>
              <div className={styles.analysisReport}>
                <strong>Analysis Report:</strong>
                <p>{result.includes("Real") ? "✅ " : "❌ "}{analysis}</p>
              </div>
            </div>
          )}
      </main>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'none',
          pointerEvents: 'none',
          transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)',
          opacity: selectedImage ? 1 : 0,
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          {/* FaceViewer removed as per user request */}
        </div>
      </div>
    </div>
  );
}
