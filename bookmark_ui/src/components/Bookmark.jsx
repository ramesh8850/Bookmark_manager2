import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiShare1 } from "react-icons/ci";
import Dropdown from "react-bootstrap/Dropdown";

function Bookmark(props) {
  function handleDelete() {
    props.onDelete(props.id);
  }
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4>{props.title}</h4>
        <Dropdown className="custom-dropdown">
          <Dropdown.Toggle as="button" className="dots-button">
            <BsThreeDotsVertical className="dots-icon" />
          </Dropdown.Toggle>

          <Dropdown.Menu className="custom-dropdown-menu">
            <Dropdown.Item onClick={props.onEdit}>Edit</Dropdown.Item>
            <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="bookmarks-body">
        <p>{props.description}</p>
        <span className="category-badge">{props.category}</span>
      </div>
      <div className="bookmarks-footer">
        <a
          href={props.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-primary d-flex align-items-center gap-2"
        >
          <CiShare1 />
          <span>Visit Site</span>
        </a>
      </div>
    </div>
  );
}

export default Bookmark;
