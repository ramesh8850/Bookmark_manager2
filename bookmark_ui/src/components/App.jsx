import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Dialog from "./DialogBox";
import Search from "./Search";
// import SideBar from "./SideBar";
import Bookmark from "./Bookmark";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";
import { SignOutButton,useUser } from '@clerk/clerk-react';

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

  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useUser(); // Get the logged-in user

  // Extract the first letter of the user's email
  const firstLetter = user?.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase() || "U";

  return (
    <div className="App">
      <div className="container">
        {/* top menu mar for signout and heading of website */}
      <div className="header d-flex justify-content-between align-items-center m-3">
      {/* Left side - Bookmark Manager heading */}
      <h1 className="fw-semibold">Bookmark Manager</h1>

      {/* Right side - Dropdown for Sign Out */}
      <div className="position-relative">
        <button
          className="btn rounded-circle"
          onClick={() => setShowDropdown(!showDropdown)}
          style={{backgroundColor:"darkblue",color:"white"}}
        >
          {firstLetter}
        </button>

        {showDropdown && (
          <div className="dropdown-menu show position-absolute end-0 mt-2 rounded-5" style={{ minWidth: "90px"}} >
            <SignOutButton>
              <button className="dropdown-item text-danger text-center">Sign Out</button>
            </SignOutButton>
          </div>
        )}
      </div>
    </div>
        {/* Header */}
        <div className="search-body d-flex justify-content-start align-items-center mt-5">
      <div className="search-bar mt-3 d-flex justify-content-center p-2">
      <Search handleSearch={handleSearch} />
      </div>
        <button
          onClick={() => {
            setIsEditing(false);
            setIsDialogOpen(true);
            setEditBookmark(null);
          }}
          className="d-flex justify-content-center align-items-center rounded-4 p-2 gap-1 bg-dark text-white col-2 shadow rounded-5"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
          
        <div className="grid">
            <div className="body-container shadow  rounded">
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
        </div>
      </div>
    </div>
  );
}


export default App;
