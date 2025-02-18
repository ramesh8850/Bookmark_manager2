import React, { useRef, useState, useEffect } from "react";

export default function Dialog({
  isOpen,
  onClose,
  onAddBookmark,
  onEditBookmark,
  isEditing,
  bookmark,
}) {
  const dialogRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    category: "development",
    description: "",
  });

  // Open or close dialog based on prop change
  useEffect(() => {
    if (isOpen) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isEditing && bookmark) {
      setFormData(bookmark); // Prepopulate the form for editing
    }
  }, [isEditing, bookmark]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEditing) {
      onEditBookmark(formData); // Call onEditBookmark when editing
    } else {
      onAddBookmark(formData); // Call onAddBookmark when adding
    }
    setFormData({
      title: "",
      url: "",
      category: "development",
      description: "",
    }); // Reset form
    onClose();
  };

  return (
    <dialog ref={dialogRef} className="dialog-box" onClose={onClose}>
      <div className="dialog-header">
        <h3>{isEditing ? "Edit Bookmark" : "Add Bookmark"}</h3>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} className="dialog-form">
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          URL:
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
          </select>
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </label>

        <div className="dialog-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="add-btn">
            {isEditing ? "Save Changes" : "Add Bookmark"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
