import React, { useContext, useState } from 'react';
import { NoteContext } from '../context/noteContext';
import PropTypes from 'prop-types';

function Notecard({note}) {
    const {deleteNote, updateNote} = useContext(NoteContext);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false); // Add loading state
    const [editData, setEditData] = useState({
        title: note.title,
        content: note.content
    });

    const handleUpdate = async () => {
        // Prevent empty updates
        if (!editData.title.trim() || !editData.content.trim()) {
            alert('Title and content cannot be empty');
            return;
        }

        setIsUpdating(true);
        try {
            await updateNote(note._id, editData);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update note:', error);
            alert('Failed to update note. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await deleteNote(note._id);
            } catch (error) {
                console.error('Failed to delete note:', error);
                alert('Failed to delete note. Please try again.');
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all p-5 flex flex-col">
            {isEditing ? (
                <>
                    {/* Edit Mode */}
                    <input
                        type="text"
                        className="border rounded-lg p-2 w-full mb-3 
                                   focus:ring-2 focus:ring-blue-500 outline-none 
                                   bg-white dark:bg-gray-700 
                                   text-gray-900 dark:text-white"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        placeholder="Title"
                        disabled={isUpdating}
                    />
                    <textarea
                        className="border rounded-lg p-2 w-full mb-3 
                                   focus:ring-2 focus:ring-blue-500 outline-none 
                                   bg-white dark:bg-gray-700 
                                   text-gray-900 dark:text-white"
                        rows="3"
                        value={editData.content}
                        onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                        placeholder="Content"
                        disabled={isUpdating}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleUpdate}
                            disabled={isUpdating}
                            className={`${
                                isUpdating 
                                    ? 'bg-green-300 cursor-not-allowed' 
                                    : 'bg-green-500 hover:bg-green-600'
                            } text-white px-4 py-1.5 rounded-lg transition flex items-center gap-2`}
                        >
                            {isUpdating ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Saving...
                                </>
                            ) : (
                                'Save'
                            )}
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            disabled={isUpdating}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1.5 rounded-lg transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {/* View Mode */}
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white break-words">
                        {note.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 flex-1 break-words whitespace-pre-wrap">
                        {note.content}
                    </p>

                    {/* Footer: date + actions */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>
                            {new Date(note.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Notecard;
Notecard.propTypes = {
    note: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired
    }).isRequired
};