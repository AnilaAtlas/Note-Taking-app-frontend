import { createContext, useEffect, useState } from "react";
import { backend_URL } from "../api/url";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Generate unique session ID 
  useEffect(() => {
    let storedSessionId = localStorage.getItem('noteapp_session_id');
    if (!storedSessionId) {
      storedSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('noteapp_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  // GET NOTES 
  const getNotes = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    try {
      const response = await backend_URL.get("/getnotes", {
        headers: { 'X-Session-ID': sessionId }
      });
      setNotes(response.data);
    } catch (error) {
      console.error("Error in fetching notes:", error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      getNotes();
    }
  }, [sessionId]);

  // CREATE NOTE 
  const createNote = async (note) => {
    if (!sessionId) return;
    
    try {
      const res = await backend_URL.post("/createnote", note, {
        headers: { 'X-Session-ID': sessionId }
      });
      setNotes((prev) => [res.data, ...prev]);
      return res.data;
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  };

  // UPDATE NOTE 
  const updateNote = async (id, note) => {
    if (!sessionId) return;
    
    try {
      const res = await backend_URL.put(`/updatenote/${id}`, note, {
        headers: { 'X-Session-ID': sessionId }
      });
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? res.data : n))
      );
      return res.data;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  };

  // DELETE NOTE
  const deleteNote = async (id) => {
    if (!sessionId) return;
    
    try {
      await backend_URL.delete(`/deletenote/${id}`, {
        headers: { 'X-Session-ID': sessionId }
      });
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        loading,
        sessionId,
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
