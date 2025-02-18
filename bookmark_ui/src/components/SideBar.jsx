import React, { useState } from "react";

function SideBar() {
  const [categories, setCategories] = useState([
    { name: "All", count: 12 },
    { name: "Development", count: 5 },
    { name: "Design", count: 3 },
    { name: "Business", count: 4 },
  ]);
  return (
    <div className="categories border p-3">
      <h3 className="d-flex justify-content-between">
        Categories <span>+</span>
      </h3>
      <ul className="list-unstyled">
        {categories.map((category, index) => (
          <li key={index} className="d-flex justify-content-between">
            <span>{category.name}</span>
            <span>{category.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default SideBar;
