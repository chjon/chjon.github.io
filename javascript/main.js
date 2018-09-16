//Event listeners for adjusting the top menu
if (window.addEventListener) {
	window.addEventListener("scroll", function () {fix_menu(); });
	window.addEventListener("resize", function () {fix_menu(); });	
	window.addEventListener("touchmove", function () {fix_menu(); });	
	window.addEventListener("load", function () {fix_menu(); });
} else if (window.attachEvent) {
	window.attachEvent("onscroll", function () {fix_menu(); });
	window.attachEvent("onresize", function () {fix_menu(); });	
	window.attachEvent("ontouchmove", function () {fix_menu(); });
	window.attachEvent("onload", function () {fix_menu(); });
}

//Detect how far the user has scrolled
function scrolltop() {
	var top = 0;
	
	if (typeof(window.pageYOffset) == "number") {
		top = window.pageYOffset;
	} else if (document.body && document.body.scrollTop) {
		top = document.body.scrollTop;
	} else if (document.documentElement && document.documentElement.scrollTop) {
		top = document.documentElement.scrollTop;
	}
	
	return top;
}

//Adjust top menu according to amount scrolled
function fix_menu() {
	var top = scrolltop();
	
	if (top < 80) {
		document.getElementById("menu").style.top = "0";
		document.getElementById("menu").style.position = "relative";
		document.getElementById("content").style.marginTop = "0px";
	} else {
		document.getElementById("menu").style.top = "0";
		document.getElementById("menu").style.position = "fixed";
		document.getElementById("content").style.marginTop = "50px";
	}
}