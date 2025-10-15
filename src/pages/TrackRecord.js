import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin-bottom: 2rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  resize: vertical;
  font-size: 1rem;
`;

const DropZone = styled.div`
  border: 2px dashed #007bff;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  color: #007bff;
  background-color: ${({ isDragActive }) => (isDragActive ? "#e6f0ff" : "#f9f9f9")};
  transition: all 0.25s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #eef5ff;
  }

  p {
    margin: 0.5rem 0 0;
    font-size: 0.9rem;
  }
`;

const PreviewImage = styled.img`
  height: 200px;
  width: 200px;
  margin-top: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: 0.25s;

  &:hover {
    background: #0069d9;
  }
`;

const TradeCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const TrackRecord = () => {
  const [trades, setTrades] = useState([]);
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchTrades = async () => {
    const res = await axios.get("http://localhost:5000/api/track-record");
    setTrades(res.data);
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // Dropzone
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note && !file) return;

    setUploading(true);

    let base64Image = null;

    const formData = new FormData();
    formData.append("note", note);
    formData.append("date", new Date().toISOString());

    if (file) {
      base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

      formData.append("screenshot", file);
      formData.append("screenshotBase64", base64Image);
    }

    try {
      const res = await axios.post("http://localhost:5000/api/track-record", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Add the new trade immediately to the list with screenshot preview
      setTrades((prev) => [
        { id: res.data.id, note, date: new Date().toISOString(), screenshotUrl: res.data.screenshotUrl },
        ...prev,
      ]);

      setNote("");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <TextArea
          placeholder="Trade note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />

        <DropZone {...getRootProps()} isDragActive={isDragActive}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the screenshot here ...</p>
          ) : (
            <p>📸 Drag & drop a screenshot here, or click to browse</p>
          )}
          {preview && <PreviewImage src={preview} alt="preview" />}
        </DropZone>

        <Button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "💾 Save Trade"}
        </Button>
      </Form>

      {trades.map((trade) => (
        <motion.div
          key={trade.id}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <TradeCard>
            <p>{trade.note.length > 100 ? trade.note.substring(0, 100) + "..." : trade.note}</p>
            {trade.screenshotBase64 && <PreviewImage src={trade.screenshotBase64} alt="screenshot" />}
            <small>{new Date(trade.date).toLocaleString()}</small>
          </TradeCard>
        </motion.div>
      ))}
    </Container>
  );
};

export default TrackRecord;
