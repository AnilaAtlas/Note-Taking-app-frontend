import { createContext, useEffect, useState } from "react";
import { backend_URL } from "../api/url";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

// ////////////////////////////////////////////////////////////////////////////////////////////////////
  const API_BASE = "https://echonote-taking-app.onrender.com/api/v1/noteapp";  

//  GET NOTES
  const getNotes = async () => {
    setLoading(true);
    try {
      // const response = await backend_URL.get("/getnotes");/////////////////////////////////////////
      const response = await axios.get(`${API_BASE}/getnotes`);
      setNotes(response.data);
    } catch (error) {
      console.error("Error in fetching notes:", error);
      setNotes([]); // safety
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  // 🔹 CREATE NOTE
  const createNote = async (note) => {
    // const res = await backend_URL.post("/createnote", note);////////////////////////////////////////
     const res = await axios.post(`${API_BASE}/createnote`, note);
    setNotes((prev) => [res.data, ...prev]);
  };

  // 🔹 UPDATE NOTE
  const updateNote = async (id, note) => {
    const res = await backend_URL.put(`/updatenote/${id}`, note);
    setNotes((prev) =>
      prev.map((n) => (n._id === id ? res.data : n))
    );
  };

  // 🔹 DELETE NOTE
  const deleteNote = async (id) => {
    await backend_URL.delete(`/deletenote/${id}`);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        loading,
        getNotes,
        createNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export default NoteProvider;

