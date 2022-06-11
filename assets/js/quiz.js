window.onload = () => {
    const test_ui   = document.getElementsByClassName("test-container");
    const result_ui = document.getElementsByClassName("result-row");
    const scorebtn  = document.getElementById("test-score-btn");
    const backbtn   = document.getElementById("test-back-btn");
    const desc      = document.getElementsByClassName("test-description")[0];

	scorebtn.onclick = () => {
        // Count score and reset checkboxes
        let score = 0;
        for (let e of document.getElementsByClassName("form-check-input")) {
            if (e.checked) score++;
            e.checked = false;
        }

        // Set test to be invisible
        for (let e of test_ui) {
            e.style.display = "none";
        }
        scorebtn.style.display = "none";
        desc.style.display = "none";

        // Set results to be visible
        for (let e of result_ui) {
            if (score >= parseInt(e.dataset.threshold)) {
                e.style.display = null;
                e.firstElementChild.innerHTML = e.firstElementChild.dataset.name + " (" + score + ")";
                break;
            }
        }
        backbtn.style.display = null;
    }
    
    backbtn.onclick = () => {
        // Set results to be invisible
        for (let e of result_ui) {
            e.style.display = "none";
        }
        backbtn.style.display = "none";

        // Set test to be visible
        for (let e of test_ui) {
            e.style.display = null;
        }
        scorebtn.style.display = null;
        desc.style.display = null;
	}
}