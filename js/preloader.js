/*
	             ____                          __
	  ____ _____/ / /_  ____   _________  ____/ /__  _____
	 / __ `/ __  / __ \/ __ \ / ___/ __ \/ __  / _ \/ ___/
	/ /_/ / /_/ / /_/ / /_/ // /__/ /_/ / /_/ /  __(__  )
	\__, /\__,_/_.___/ .___(_)___/\____/\__,_/\___/____/
	  /_/           /_/

*/
const main = document.querySelector("main")
window.addEventListener("load", () => {
    main.classList.add("preloader-animation")
    document.querySelector("canvas").classList.add("preloader-faint")
});