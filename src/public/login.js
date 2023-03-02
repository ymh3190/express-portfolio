const loginForm = document.querySelector(".login-form");
const emailInput = document.querySelector(".email");
const passwordInput = document.querySelector(".password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    return;
  }

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
  } catch (err) {
    console.log(err);
    return;
  }

  try {
    const token = localStorage.getItem("token");
    await fetch("/login", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    window.location.href = "/";
  } catch (err) {
    console.log(err);
    return;
  }
});
