import React from "react";
// eslint-disable-next-line
// import SomeComponent from "website2/SomeComponent"
// console.log(__non_webpack_require__("../../website2/buildServer/container.js"));
export default () => (
  <div>
    <h1 onClick={() => alert("website1 is interactive")}>This is website 1</h1>
  </div>
);
