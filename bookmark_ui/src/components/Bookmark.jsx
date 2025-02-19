import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiShare1 } from "react-icons/ci";
import Dropdown from "react-bootstrap/Dropdown";

function Bookmark(props) {
  function handleDelete() {
    props.onDelete(props.id);
  }
  return (
    <div className="card shadow glass-card p-3 fade-in hover-shadow transition-all rounded-5">
  {/* Card Header */}
  <div
    className="card-header d-flex justify-content-between align-items-center"
    style={{ backgroundColor: "white", color: "black", borderBottom: "none" }}
  >
    <div className="d-flex align-items-center gap-3">
      <img
        src={`https://www.google.com/s2/favicons?domain=${props.url}&sz=32`}
        alt={props.title}
        className="rounded-circle"
        style={{ width: "24px", height: "24px" }}
      />
      <h5 className="fw-semibold">{props.title}</h5>
    </div>

    <Dropdown className="custom-dropdown">
      <Dropdown.Toggle as="button" className="dots-button border-0 bg-transparent">
        <BsThreeDotsVertical className="dots-icon" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="custom-dropdown-menu rounded-4" style={{ minWidth: "10px", padding: "5px" }}>
        <Dropdown.Item onClick={props.onEdit}>Edit</Dropdown.Item>
        <Dropdown.Item className="text-danger" onClick={handleDelete}>
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>

  {/* Card Content */}
  <div className="card-body text-start">
    <p className="small text-muted">{props.description}</p>
    <span
      className="badge text-dark text-capitalize"
      style={{ backgroundColor: "rgb(246,246,246)", padding: "5px", borderRadius: "6px" }}
    >
      {props.category}
    </span>
  </div>

  {/* Card Footer */}
  <div className="card-footer bg-transparent mt-2" style={{ borderTop: "none" }}>
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-outline-dark d-flex align-items-center gap-2 rounded-5"
      style={{ border: "1px solid #ddd" }} 
    >
      <CiShare1 />
      <span>Visit Site</span>
    </a>
  </div>
</div>

  );
}

export default Bookmark;
