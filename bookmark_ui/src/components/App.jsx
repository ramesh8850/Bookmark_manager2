import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Dialog from "./DialogBox";
import Search from "./Search";
// import SideBar from "./SideBar";
import Bookmark from "./Bookmark";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";
import { SignOutButton } from '@clerk/clerk-react';

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBookmark, setEditBookmark] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  const API_URL ="https://backend-bookmark-manager.onrender.com/bookmarks"; // Update with your backend URL

  // Fetch bookmarks from backend
  const fetchBookmarks = async () => {
    try {
      const res = await axios.get(API_URL);
      setBookmarks(res.data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  // Use Effect hook to fetch bookmarks initially
  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Add a new bookmark
  const handleAddBookmark = async (bookmark) => {
    try {
      const res = await axios.post(API_URL, bookmark);
      setBookmarks([...bookmarks, res.data]); // Add new bookmark to state
    } catch (err) {
      console.error("Error adding bookmark:", err);
    }
  };

  // Edit an existing bookmark
  const handleEditBookmark = async (updatedBookmark) => {
    try {
      await axios.put(`${API_URL}/${updatedBookmark.id}`, updatedBookmark);
      setBookmarks((prevBookmarks) =>
        prevBookmarks.map((bookmark) =>
          bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
        )
      );
    } catch (err) {
      console.error("Error updating bookmark:", err);
    }
  };

  // Delete a bookmark
  const handleDeleteBookmark = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
    } catch (err) {
      console.error("Error deleting bookmark:", err);
    }
  };

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  // Filter bookmarks based on search query
  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery) ||
      bookmark.description.toLowerCase().includes(searchQuery) ||
      bookmark.category.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="App">

      <div className="header d-flex justify-content-between align-items-center m-2">
        {/* Left side - Bookmark Manager heading */}
        <h1>Bookmark Manager</h1>

        {/* Right side - Sign Out button */}
        <SignOutButton>
          <button className="btn btn-danger">Sign Out</button>
        </SignOutButton>
      </div>

      {/* Header */}
      <div className="header m-4 d-flex justify-content-between">
        <h2 className="fw-bolder">Bookmarks</h2>
        <button
          onClick={() => {
            setIsEditing(false);
            setIsDialogOpen(true);
            setEditBookmark(null);
          }}
          className="d-flex justify-content-center align-items-center rounded-4 p-2 gap-2 bg-dark text-white"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-plus"
            viewBox="0 0 16 16"
          >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
          Add Bookmark
        </button>

        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onAddBookmark={handleAddBookmark}
          onEditBookmark={handleEditBookmark}
          isEditing={isEditing}
          bookmark={editBookmark}
        />
      </div>


          {/* Search Bar */}
          <Search handleSearch={handleSearch} />

          {/* Show filtered bookmarks */}
          {searchQuery ? (
            <div className="bookmark-list">
              {filteredBookmarks.length > 0 ? (
                filteredBookmarks.map((bookmark, index) => (
                  <Bookmark
                    key={index}
                    id={bookmark.id}
                    title={bookmark.title}
                    url={bookmark.url}
                    description={bookmark.description}
                    category={bookmark.category}
                    onEdit={() => {
                      setIsEditing(true);
                      setEditBookmark(bookmark);
                      setIsDialogOpen(true);
                    }}
                    onDelete={handleDeleteBookmark}
                  />
                ))
              ) : (
                <p>No bookmarks found</p>
              )}
            </div>
          ) : (
            // Show all bookmarks when there is no search query
            <div className="cards-container ms-2">
              {bookmarks.map((bookmark, index) => (
                <Bookmark
                  key={index}
                  id={bookmark.id}
                  title={bookmark.title}
                  url={bookmark.url}
                  description={bookmark.description}
                  category={bookmark.category}
                  onEdit={() => {
                    setIsEditing(true);
                    setEditBookmark(bookmark);
                    setIsDialogOpen(true);
                  }}
                  onDelete={handleDeleteBookmark}
                />
              ))}
            </div>
          )}
    </div>
  );
}


export default App;
