// import * as math from "./math.js";
// import { sum } from "./math.js";
import "../css/app.css";
import nyancat from "../image/nyancat.jpg";

// console.log(math.sum(1, 2));
// console.log(sum(3, 4));

document.addEventListener("DOMContentLoaded", () => {
  document.body.innerHTML = `
        <img src="${nyancat}" />
    `;
});
