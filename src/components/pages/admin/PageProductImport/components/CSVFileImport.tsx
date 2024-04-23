import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Get the presigned URL
      const response = await axios.get(url, {
        params: {
          name: encodeURIComponent(file.name),
        },
      });

      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data);

      // Upload file to the presigned URL
      await fetch(response.data, {
        method: "PUT",
        body: file,
      });

      console.log("Upload complete");
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <Typography>{file.name}</Typography>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload file"}
          </button>
        </div>
      )}
    </Box>
  );
}
