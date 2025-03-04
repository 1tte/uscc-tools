import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { motion } from "framer-motion";

const FaceComparison = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [similarity, setSimilarity] = useState(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        { runtime: "tfjs" }
      );
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const extractFaceLandmarks = async (imgElement) => {
    if (!model) return null;
    const faces = await model.estimateFaces(imgElement);
    return faces.length ? faces[0].keypoints.map((kp) => [kp.x, kp.y]) : null;
  };

  const calculateEuclideanDistance = (landmarks1, landmarks2) => {
    let sum = 0;
    for (let i = 0; i < landmarks1.length; i++) {
      sum += Math.pow(landmarks1[i][0] - landmarks2[i][0], 2) +
             Math.pow(landmarks1[i][1] - landmarks2[i][1], 2);
    }
    return Math.sqrt(sum);
  };

  const compareFaces = async () => {
    if (!image1 || !image2) {
      setSimilarity("Please upload both images.");
      return;
    }

    setLoading(true);
    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");

    const landmarks1 = await extractFaceLandmarks(img1);
    const landmarks2 = await extractFaceLandmarks(img2);

    setLoading(false);
    if (landmarks1 && landmarks2) {
      const distance = calculateEuclideanDistance(landmarks1, landmarks2);
      const similarityScore = Math.max(0, (1 - distance / 1000) * 100);
      setSimilarity(similarityScore.toFixed(2));
    } else {
      setSimilarity("No faces detected. Please try again with clearer images.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center dark:bg-gray-900 text-white p-6">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-lg text-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-white-400">Face Similarity Checker</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <div className="flex flex-col items-center">
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImage1)} className="hidden" id="upload1" />
            <label htmlFor="upload1" className="cursor-pointer bg-blue-500 px-5 py-2 rounded-md hover:bg-blue-600 transition">Upload Target</label>
            {image1 && <img id="img1" src={image1} alt="First" className="mt-3 w-40 h-40 object-cover rounded-lg border-2 border-blue-400" />}
          </div>
          <div className="flex flex-col items-center">
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImage2)} className="hidden" id="upload2" />
            <label htmlFor="upload2" className="cursor-pointer bg-blue-500 px-5 py-2 rounded-md hover:bg-blue-600 transition">Upload ID Photo</label>
            {image2 && <img id="img2" src={image2} alt="Second" className="mt-3 w-40 h-40 object-cover rounded-lg border-2 border-blue-400" />}
          </div>
        </div>
        <button 
          onClick={compareFaces} 
          className="mt-6 bg-green-500 px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-600 transition"
        >
          Compare Faces
        </button>
        {loading && <p className="mt-4 text-yellow-400">Processing...</p>}
        {similarity && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mt-6"
          >
            <h3 className="text-lg font-semibold">Similarity Score: {similarity}%</h3>
            <div className="w-full bg-gray-700 rounded-md h-4 mt-3 overflow-hidden relative">
              <motion.div 
                className="h-full bg-green-400" 
                initial={{ width: 0 }} 
                animate={{ width: `${similarity}%` }} 
                transition={{ duration: 1.5 }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FaceComparison;