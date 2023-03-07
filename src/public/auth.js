const loginForm = document.querySelector(".login-form");
const emailInput = document.querySelector(".email");
const passwordInput = document.querySelector(".password");
const loginBtn = document.querySelector(".login-btn");
const joinForm = document.querySelector(".join-form");
const nameInput = document.querySelector(".name");
const confirmInput = document.querySelector(".confirm");

if (joinForm) {
  joinForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;
    const name = nameInput.value;
    const confirm = confirmInput.value;

    emailInput.value = "";
    passwordInput.value = "";
    nameInput.value = "";
    confirmInput.value = "";

    try {
      const data = await fetch("/api/auth/join", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, confirm }),
      });
      const { user, token } = await data.json();
      localStorage.setItem("token", token);
      const ul = document.createElement("ul");
      const li = document.createElement("li");
      li.innerText = `id:${user.id}, email:${user.email}, name:${user.name}, token: ${token}`;
      ul.appendChild(li);
      joinForm.appendChild(ul);
      setTimeout(() => {
        joinForm.removeChild(ul);
      }, 3000);
    } catch (err) {
      alert(err);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      const h3 = document.createElement("h3");
      h3.innerText = "provide email and password";
      loginForm.appendChild(h3);
      return setTimeout(() => {
        loginForm.removeChild(h3);
      }, 3000);
    }

    try {
      const data = await fetch("/api/auth/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const { token } = await data.json();
      localStorage.setItem("token", token);
      const h3 = document.createElement("h3");
      h3.innerText = `token: ${token}`;
      loginForm.appendChild(h3);
      setTimeout(() => {
        loginForm.removeChild(h3);
      }, 3000);
    } catch (err) {
      alert(err);
    }
  });
}

if (loginBtn) {
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const data = await fetch("/api/auth/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { user } = await data.json();
      const span = document.querySelector(".login-btn span");
      span.innerText = "";
      const h3 = document.createElement("h3");
      h3.innerText = `id: ${user.id}, email: ${user.email}, name: ${user.name}`;
      loginBtn.appendChild(h3);
      setTimeout(() => {
        loginBtn.removeChild(h3);
        span.innerText = "&rarr;";
      }, 3000);
    } catch (err) {
      alert(err);
    }
  });
}
