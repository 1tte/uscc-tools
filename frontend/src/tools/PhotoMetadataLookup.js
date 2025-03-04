import React, { useState } from "react";
import EXIF from "exif-js";

const PhotoMetadataLookup = () => {
  const [metadata, setMetadata] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [jsonMetadata, setJsonMetadata] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
        extractMetadata(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractMetadata = (file) => {
    EXIF.getData(file, function () {
      const allMetaData = EXIF.getAllTags(this);
      console.log("Extracted Metadata:", allMetaData);
      setMetadata(allMetaData);
      setJsonMetadata(JSON.stringify(allMetaData, null, 2));
    });
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Photo Metadata Lookup</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4 p-2 border border-gray-600 rounded w-full bg-gray-700"
      />
      {imageSrc && <img src={imageSrc} alt="Uploaded" className="mb-4 w-full rounded" />}
      {metadata && (
        <div className="text-sm">
          <h3 className="text-lg font-medium mb-2">Metadata:</h3>
          <ul className="space-y-2">
            {metadata.Make && <li><strong>Camera Make:</strong> {String(metadata.Make)}</li>}
            {metadata.Model && <li><strong>Camera Model:</strong> {String(metadata.Model)}</li>}
            {metadata.DateTime && <li><strong>Date & Time:</strong> {String(metadata.DateTime)}</li>}
            {metadata.ISOSpeedRatings && <li><strong>ISO:</strong> {String(metadata.ISOSpeedRatings)}</li>}
            {metadata.ExposureTime && (
              <li><strong>Shutter Speed:</strong> {`1/${parseFloat(1 / metadata.ExposureTime).toFixed(2)}`} sec</li>
            )}
            {metadata.FNumber && <li><strong>Aperture:</strong> f/{String(metadata.FNumber)}</li>}
            {metadata.FocalLength && <li><strong>Focal Length:</strong> {String(metadata.FocalLength)}mm</li>}
            {metadata.Flash && <li><strong>Flash:</strong> {metadata.Flash ? "Fired" : "Not Fired"}</li>}
            {metadata.Software && <li><strong>Edited With:</strong> {String(metadata.Software)}</li>}
            {metadata.GPSLatitude && metadata.GPSLongitude ? (
              <li>
                <strong>GPS:</strong> {String(metadata.GPSLatitude)}, {String(metadata.GPSLongitude)} <br />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${metadata.GPSLatitude},${metadata.GPSLongitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  View on Google Maps
                </a>
              </li>
            ) : (
              <li className="text-red-400">No GPS data found.</li>
            )}
          </ul>
          <h3 className="text-lg font-medium mt-4">Full Metadata JSON:</h3>
          <textarea
            className="w-full p-2 bg-gray-700 text-white rounded mt-2"
            rows="6"
            readOnly
            value={jsonMetadata || "No metadata available"}
          />
        </div>
      )}
    </div>
  );
};

export default PhotoMetadataLookup;