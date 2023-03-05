const loginForm = document.querySelector(".login-form");
const emailInput = document.querySelector(".email");
const passwordInput = document.querySelector(".password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) return;

  const data = await fetch("/api/auth/token", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const { token } = await data.json();
  localStorage.setItem("token", token);
});
