import React from "react";
import { CiSearch } from "react-icons/ci";

function Search({handleSearch}) {
  return (
    <div className="search d-flex align-items-center gap-2 mb-3">
      <input type="text" placeholder="Search..." className="form-control" onChange={(e) => handleSearch(e.target.value)} />
      <button className="btn btn-dark d-flex align-items-center gap-1">
        <CiSearch style={{ fontSize: "20px" }} />
        <span>Search</span>
      </button>
    </div>
  );
}

export default Search;
