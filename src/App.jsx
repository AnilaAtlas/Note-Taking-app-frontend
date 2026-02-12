import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NoteProvider } from "./context/noteContext.jsx/";
import Navbar from "./components/nav.jsx";
import Footer from "./components/footer.jsx";
import Home from "./pages/Home.jsx";
import CreateNote from "./pages/CreateNotePage.jsx";
import ErrorBoundary from './components/errorBoundary.jsx';

function App() {
    return (
        <ErrorBoundary>
            <NoteProvider>                    
                <div className='flex flex-col min-h-screen bg-indigo-200 text-white'>
                    <Navbar />
                    <main className="flex-1 container mx-auto p-4">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/create" element={<CreateNote />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </NoteProvider>
        </ErrorBoundary>
    );
}

export default App;