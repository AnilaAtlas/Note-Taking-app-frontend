import { createContext, useEffect, useState } from "react";
import { backend_URL } from "../api/url";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);  

//  GET NOTES
  const getNotes = async () => {
    setLoading(true);
    try {
      const response = await backend_URL.get("/getnotes");
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

  //  CREATE NOTE
  const createNote = async (note) => {
    try{const res = await backend_URL.post("/createnote", note);
    setNotes((prev) => [res.data, ...prev]);
    return res.data;}
    catch(error){
        console.error("Error creating note:", error);
        throw error;
    }
  };

  //  UPDATE NOTE
const updateNote = async (id, note) => {
    try {
        const res = await backend_URL.put(`/updatenote/${id}`, note);
        setNotes((prev) =>
            prev.map((n) => (n._id === id ? res.data : n))
        );
        return res.data;
    } catch (error) {
        console.error("Error updating note:", error);
        throw error;
    }
};
//  DELETE NOTE
const deleteNote = async (id) => {
    try {
        await backend_URL.delete(`/deletenote/${id}`);
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

