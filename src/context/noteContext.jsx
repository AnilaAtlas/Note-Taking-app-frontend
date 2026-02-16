import { createContext, useEffect, useState, useCallback } from "react";
import { backend_URL } from "../api/url";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);


  useEffect(() => {
    let storedSessionId = localStorage.getItem('noteapp_session_id');
    if (!storedSessionId) {
      storedSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('noteapp_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  // GET NOTES 
  const getNotes = useCallback(async () => {
    if (!sessionId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await backend_URL.get("/getnotes", {
        headers: { 'X-Session-ID': sessionId }
      });
      
      console.log('API Response:', response.data); 
      

      if (response.data && response.data.data) {
        setNotes(response.data.data);
      } else if (Array.isArray(response.data)) {
        setNotes(response.data);
      } else {
        console.warn('Unexpected response structure:', response.data);
        setNotes([]);
      }
    } catch (error) {
      console.error("Error in fetching notes:", error);
      setError(error.response?.data?.message || error.message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      getNotes();
    }
  }, [sessionId, getNotes]);

  // CREATE NOTE
  const createNote = async (note) => {
    if (!sessionId) return;
    
    try {
      const res = await backend_URL.post("/createnote", note, {
        headers: { 'X-Session-ID': sessionId }
      });
      
      console.log('Create response:', res.data);
      
      const newNote = res.data.data || res.data;
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
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
      
      console.log('Update response:', res.data);
      
      const updatedNote = res.data.data || res.data;
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? updatedNote : n))
      );
      return updatedNote;
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
        error,
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