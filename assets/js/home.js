const theme_classes = ["theme-light", "theme-dark"]
let current_theme = 0
window.onload = () => {
	const theme_button = document.getElementById("theme-toggle-button");
	const dark_mode_icon = document.getElementById("dark-mode-icon");
	const light_mode_icon = document.getElementById("light-mode-icon");
	const themed_items = Array.prototype.slice.call(document.getElementsByClassName(theme_classes[current_theme]));
	theme_button.onclick = () => {
		for (const themed_item of themed_items) {
			themed_item.classList.remove(theme_classes[current_theme    ])
			themed_item.classList.add   (theme_classes[current_theme ^ 1])
		}

		light_mode_icon.style.display = (current_theme) ? "block" : "none";
		dark_mode_icon.style.display  = (current_theme) ? "none"  : "block";
		current_theme ^= 1;
	}
}
