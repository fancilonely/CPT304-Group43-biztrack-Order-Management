test("jsdom is available", () => {
  document.body.innerHTML = "<main></main>";
  expect(document.querySelector("main")).not.toBeNull();
});

test("localStorage is available", () => {
  localStorage.setItem("biztrack-test", "ok");
  expect(localStorage.getItem("biztrack-test")).toBe("ok");
});