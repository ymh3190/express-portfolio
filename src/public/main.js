const loginForm = document.querySelector(".form");
const emailInput = document.querySelector(".email");
const passwordInput = document.querySelector(".password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) return;

  if (!localStorage.getItem("token")) {
    try {
      const data = await fetch("/api/auth", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const { token } = await data.json();
      localStorage.setItem("token", token);
    } catch (err) {}
  }

  const token = localStorage.getItem("token");
  if (token) {
    await fetch("/api/login", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
});
