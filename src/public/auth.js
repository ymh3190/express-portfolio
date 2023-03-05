const form = document.querySelector(".form");

const checkToken = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const data = await fetch("/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { user } = await data.json();
    const ul = document.createElement("ul");
    const id = document.createElement("div");
    id.innerText = `id: ${user.id}`;
    const email = document.createElement("div");
    email.innerText = `email : ${user.email}`;
    const name = document.createElement("div");
    name.innerText = `name: ${user.name}`;
    ul.appendChild(id);
    ul.appendChild(email);
    ul.appendChild(name);
    document.querySelector("body").appendChild(ul);
    if (form) {
      form.style.display = "none";
    }
  }
};

checkToken();
