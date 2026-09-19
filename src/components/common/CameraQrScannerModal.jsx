import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  X,
  RefreshCw,
  Upload,
  AlertCircle,
  CheckCircle2,
  SwitchCamera
} from "lucide-react";
import { Button } from "./Button";

export function CameraQrScannerModal({ isOpen, onClose, onScanSuccess }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  // Play subtle confirmation beep
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  };

  // Clean and extract Unique ID from raw QR text
  const extractUniqueId = (raw) => {
    if (!raw) return "";
    const text = String(raw).trim();

    // 1. If URL contains /verify/<id>
    const verifyMatch = text.match(/\/verify\/([^/?#]+)/i);
    if (verifyMatch && verifyMatch[1]) {
      return decodeURIComponent(verifyMatch[1]).trim();
    }

    // 2. If URL contains query param ?card_id=... or ?id=...
    const paramMatch = text.match(/[?&](?:card_id|id|unique_id)=([^&#]+)/i);
    if (paramMatch && paramMatch[1]) {
      return decodeURIComponent(paramMatch[1]).trim();
    }

    // 3. If JSON object
    if (text.startsWith("{") && text.endsWith("}")) {
      try {
        const parsed = JSON.parse(text);
        if (parsed.unique_id || parsed.card_id || parsed.id || parsed.public_token) {
          return String(parsed.unique_id || parsed.card_id || parsed.id || parsed.public_token).trim();
        }
      } catch (e) {}
    }

    // 4. Return raw string
    return text;
  };

  // Start Camera Stream
  const startCamera = async (facing = facingMode) => {
    stopCamera();
    setCameraError(null);
    setScannedResult(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCamera(false);
      setCameraError({
        type: "unsupported",
        title: "Camera Not Supported",
        message: "Your browser does not support camera access. Please use modern Google Chrome or Edge."
      });
      return;
    }

    try {
      // First try ideal constraints
      const constraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setIsScanning(true);
        startScanningLoop();
      }
    } catch (err) {
      console.warn("Primary camera start error:", err);
      // Fallback: try basic video: true without constraints
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.setAttribute("playsinline", "true");
          await videoRef.current.play();
          setIsScanning(true);
          startScanningLoop();
        }
      } catch (fallbackErr) {
        console.warn("Fallback camera error:", fallbackErr);
        const isDenied = fallbackErr.name === "NotAllowedError" || fallbackErr.name === "PermissionDeniedError" || err.name === "NotAllowedError";
        const isNotFound = fallbackErr.name === "NotFoundError" || fallbackErr.name === "DevicesNotFoundError";
        
        if (isDenied) {
          setCameraError({
            type: "permission_denied",
            title: "Camera Permission Required",
            message: "Browser ne camera permission block ki hui hai."
          });
        } else if (isNotFound) {
          setCameraError({
            type: "not_found",
            title: "No Camera Device Found",
            message: "Aapke computer me koi physical webcam ya camera detect nahi hua."
          });
        } else {
          setCameraError({
            type: "generic",
            title: "Camera Access Error",
            message: fallbackErr.message || "Camera start nahi ho paya."
          });
        }
      }
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  // Dynamically load jsQR library for universal browser & device QR decoding support
  useEffect(() => {
    if (!window.jsQR && !document.getElementById("jsqr-cdn-script")) {
      const script = document.createElement("script");
      script.id = "jsqr-cdn-script";
      script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Scanning Loop using Native BarcodeDetector + jsQR fallback
  const startScanningLoop = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    scanIntervalRef.current = setInterval(async () => {
      const video = videoRef.current;
      if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) return;

      // 1. Native BarcodeDetector API (Chrome, Android, Edge, Opera)
      if ("BarcodeDetector" in window) {
        try {
          const barcodeDetector = new window.BarcodeDetector({
            formats: ["qr_code", "code_128", "code_39", "ean_13", "upc_a"]
          });
          const barcodes = await barcodeDetector.detect(video);
          if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
            handleCodeFound(barcodes[0].rawValue);
            return;
          }
        } catch (e) {}
      }

      // 2. jsQR Canvas frame analyzer fallback (Universal compatibility)
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          if (window.jsQR) {
            try {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert"
              });
              if (code && code.data) {
                handleCodeFound(code.data);
                return;
              }
            } catch (err) {}
          }
        }
      }
    }, 250);
  };

  const handleCodeFound = (rawText) => {
    if (!rawText) return;
    const cleanId = extractUniqueId(rawText);
    if (!cleanId) return;

    // Stop scanning once found
    stopCamera();
    playBeep();
    setScannedResult(cleanId);

    // Call parent handler after a tiny pause for visual confirmation
    setTimeout(() => {
      onScanSuccess(cleanId);
      onClose();
    }, 450);
  };

  // Handle Photo / File Upload for QR Code
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => (img.onload = resolve));

      // 1. Native BarcodeDetector
      if ("BarcodeDetector" in window) {
        try {
          const barcodeDetector = new window.BarcodeDetector({ formats: ["qr_code"] });
          const barcodes = await barcodeDetector.detect(img);
          if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
            handleCodeFound(barcodes[0].rawValue);
            return;
          }
        } catch (e) {}
      }

      // 2. jsQR on offscreen canvas
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width || 640;
      canvas.height = img.naturalHeight || img.height || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      if (window.jsQR) {
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = window.jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleCodeFound(code.data);
            return;
          }
        } catch (e) {}
      }

      // 3. Fallback match in filename
      const fallbackMatch = file.name.match(/(HMC[A-Z0-9-]+|[0-9a-f]{32})/i);
      if (fallbackMatch && fallbackMatch[1]) {
        handleCodeFound(fallbackMatch[1]);
      } else {
        alert("Could not detect a valid Health Mitra QR code in this image. Please ensure the QR is clear.");
      }
    } catch (err) {
      console.warn("QR Image scan error:", err);
      alert("Error scanning image file.");
    }
  };

  // Toggle Camera Front/Back
  const toggleCamera = () => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);
    startCamera(newMode);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-lg z-10 overflow-hidden transform transition-all text-white animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 text-brand-500 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight flex items-center gap-1.5">
                Scan Patient QR Pass
              </h3>
              <p className="text-[11px] text-slate-400">Align Health Mitra Card QR pass within the viewfinder</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder & Video Stream */}
        <div className="p-6 space-y-4">
          <div className="relative w-full aspect-square max-w-[340px] mx-auto bg-black rounded-3xl overflow-hidden border-2 border-slate-800 flex items-center justify-center shadow-inner">
            {/* Live Video Feed */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Target Scanning Overlay Box */}
            <div className="absolute inset-8 sm:inset-10 border-2 border-brand-500/90 rounded-2xl pointer-events-none flex flex-col justify-between p-2 shadow-orange-glow">
              {/* Corner Accents */}
              <div className="flex justify-between">
                <div className="w-4 h-4 border-t-3 border-l-3 border-brand-400 -mt-1 -ml-1 rounded-tl-sm" />
                <div className="w-4 h-4 border-t-3 border-r-3 border-brand-400 -mt-1 -mr-1 rounded-tr-sm" />
              </div>

              {/* Animated Laser Scanning Line */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-orange-glow animate-pulse" />

              <div className="flex justify-between">
                <div className="w-4 h-4 border-b-3 border-l-3 border-brand-400 -mb-1 -ml-1 rounded-bl-sm" />
                <div className="w-4 h-4 border-b-3 border-r-3 border-brand-400 -mb-1 -mr-1 rounded-br-sm" />
              </div>
            </div>

            {/* Success state overlay */}
            {scannedResult && (
              <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-2 text-center p-4 animate-scaleUp">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="font-extrabold text-sm text-white">QR Code Recognized!</p>
                <p className="font-mono text-xs text-brand-400 font-bold bg-slate-900/80 px-3 py-1 rounded-lg border border-emerald-500/30">
                  {scannedResult}
                </p>
                <p className="text-[11px] text-slate-300">Auto-verifying patient membership...</p>
              </div>
            )}

            {/* Camera error / permission state */}
            {cameraError && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-4 sm:p-5 space-y-3.5 z-20 overflow-y-auto">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {typeof cameraError === "object" ? cameraError.title : "Camera Access Notice"}
                  </h4>
                  <p className="text-[11px] text-slate-300 max-w-xs leading-relaxed">
                    {typeof cameraError === "object" ? cameraError.message : cameraError}
                  </p>
                </div>

                {/* Step by step unblock guide if permission was denied */}
                {typeof cameraError === "object" && cameraError.type === "permission_denied" && (
                  <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 text-left text-[11px] text-slate-300 space-y-1.5 w-full max-w-xs">
                    <p className="font-bold text-amber-300 text-[10px] uppercase tracking-wider">
                      Browser Me Camera On Kaise Karein:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[10.5px]">
                      <li>Upar address bar me <strong>Camera icon (🚫📷)</strong> par click karein.</li>
                      <li><strong>&quot;Always allow http://localhost:3000 to access camera&quot;</strong> select karein.</li>
                      <li>Niche <strong>&quot;Allow Camera &amp; Retry&quot;</strong> button click karein.</li>
                    </ol>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => startCamera(facingMode)}
                    icon={RefreshCw}
                    className="shadow-orange-glow text-xs font-bold"
                  >
                    Allow Camera &amp; Retry
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            {/* Flip camera button */}
            <button
              type="button"
              onClick={toggleCamera}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition border border-slate-700 cursor-pointer"
              title="Switch Front / Rear Camera"
            >
              <SwitchCamera className="w-4 h-4 text-brand-400" />
              <span>Flip Camera</span>
            </button>

            {/* Upload Image Option */}
            <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition border border-slate-700 cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Upload Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
