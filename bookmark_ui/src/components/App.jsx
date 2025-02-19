import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; // Import axios
import Dialog from "./DialogBox";
import Search from "./Search";
// import SideBar from "./SideBar";
import Bookmark from "./Bookmark";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";
import { SignOutButton, useUser } from '@clerk/clerk-react';


function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBookmark, setEditBookmark] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL; // Update with your backend URL

  console.log("API URL", REACT_APP_API_URL);
  // Memoize fetchBookmarks so it doesn't change on every render
  const fetchBookmarks = useCallback(async () => {
    try {
      const res = await axios.get(REACT_APP_API_URL);
      setBookmarks(res.data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  }, [REACT_APP_API_URL]);

  // Now fetchBookmarks is stable and can be included in the dependency array
  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Add a new bookmark
  const handleAddBookmark = async (bookmark) => {
    try {
      const res = await axios.post(REACT_APP_API_URL, bookmark);
      setBookmarks([...bookmarks, res.data]); // Add new bookmark to state
    } catch (err) {
      console.error("Error adding bookmark:", err);
    }
  };

  // Edit an existing bookmark
  const handleEditBookmark = async (updatedBookmark) => {
    try {
      await axios.put(`${REACT_APP_API_URL}/${updatedBookmark.id}`, updatedBookmark);
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
      await axios.delete(`${REACT_APP_API_URL}/${id}`);
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

  //filtering data like in chrom bookmark

  const [categoryFilter, setCategoryFilter] = useState("all"); // Default: "all"
  const [sortOrder, setSortOrder] = useState("title-asc");

  const visibleBookmarks = bookmarks.filter((bookmark) => {
    const matchesCategory = categoryFilter === "all" ||
      bookmark.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch = searchQuery === "" ||
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 🔹 Sorting Function
  const sortedVisibleBookmarks = [...visibleBookmarks].sort((a, b) => {
    if (sortOrder === "title-asc") return a.title.localeCompare(b.title);
    if (sortOrder === "title-desc") return b.title.localeCompare(a.title);
    if (sortOrder === "category-asc") return a.category.localeCompare(b.category);
    if (sortOrder === "category-desc") return b.category.localeCompare(a.category);
    return 0;
  });


  //for signout from website
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
          <h1 className="fw-semibold pb-2 px-3">Bookmark Manager</h1>

          {/* Right side - Dropdown for Sign Out */}
          <div className="position-relative">
            <button
              className="btn rounded-circle"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ backgroundColor: "darkblue", color: "white" }}
            >
              {firstLetter}
            </button>

            {showDropdown && (
              <div className="dropdown-menu show position-absolute end-0 mt-2 rounded-5" style={{ minWidth: "90px" }} >
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

          {/* filter and sorting Bookmarks */}
          <div className="category-container m-3">
            {/* 🔹 Filter and Sort Dropdowns */}
            <div className="bar d-flex justify-content-between gap-2 m-3">
              {/* Category Filter */}
              <select
                className="px-3 py-2 rounded-4 border shadow-sm"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  transition: "0.3s ease-in-out",
                  cursor: "pointer",
                }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
              >
                <option className="dropdown-option" value="all">📁 All Categories</option>
                <option className="dropdown-option" value="Development">💻 Development</option>
                <option className="dropdown-option" value="Design">🎨 Design</option>
                <option className="dropdown-option" value="Business">📊 Business</option>
              </select>

              {/* Sorting Dropdown */}
              <select
                className="px-3 py-2 rounded-4 border shadow-sm"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  transition: "0.3s ease-in-out",
                  cursor: "pointer",
                }}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
              >
                <option className="dropdown-option" value="title-asc">🔤 Title (A-Z)</option>
                <option className="dropdown-option" value="title-desc">🔠 Title (Z-A)</option>
                <option className="dropdown-option" value="category-asc">📁 Category (A-Z)</option>
                <option className="dropdown-option" value="category-desc">📂 Category (Z-A)</option>
              </select>
            </div>


          </div>
          
          <div className="body-container">
            {/* Show filtered bookmarks */}
            {searchQuery ? (
              <div className="bookmark-list">
                {filteredBookmarks.length > 0 ? (
                  sortedVisibleBookmarks.map((bookmark, index) => (
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
                {sortedVisibleBookmarks.map((bookmark, index) => (
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
