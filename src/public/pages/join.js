const form = document.querySelector(".form");

const checkToken = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const data = await fetch("/join", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { user } = await data.json();
    form.removeEventListener("submit");
    form.style.display = "none";
  }
};

checkToken();
