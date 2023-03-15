const createdAts = document.querySelectorAll("#createdAt");

createdAts.forEach((createdAt) => {
  const createdAtDateTime = new Date(
    new Date(createdAt.innerText).getTime() -
      new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .substring(0, 19);

  const [createdAtDate, createdAtTime] = createdAtDateTime.split("T");
  createdAt.innerText = `createdAt: ${createdAtDate} ${createdAtTime}`;
});
