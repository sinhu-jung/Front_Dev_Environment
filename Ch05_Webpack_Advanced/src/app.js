import "../css/app.css";
import axios from "axios";

document.addEventListener("DOMContentLoaded", async () => {
  const res = await axios.get("/api/users");
  console.log(res);
  document.body.innerHTML = res.data.map((user) => {
    return `<div>${user.id}: ${user.name}</div>`;
  });
});

console.log(process.env.NODE_ENV);
