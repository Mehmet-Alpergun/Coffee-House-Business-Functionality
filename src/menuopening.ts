const menubtn: HTMLElement | null = document.getElementById("menubtn");
const menu: HTMLElement | null = document.getElementById("menuismenulan");
const lan: HTMLElement | null = document.getElementById("yeterlan");

console.log(menubtn);
console.log(menu);
console.log(lan);
menubtn?.addEventListener("click", () => {
  menu?.classList.toggle("active");
  lan?.classList.toggle("active");
  menubtn.classList.toggle("active");
});

lan?.addEventListener("click", () => {
  menu?.classList.remove("active");
  lan?.classList.remove("active");
  menubtn?.classList.remove("active");
});
