---
layout: empty
stylesheet: /assets/css/maze.css
script: /assets/js/maze/index.js
---
<section class="main-wrapper">
	<div class="control-pane">
		<h1>Mazes</h1>
		<hr/>
		<div class="control-group">
			<h2 class="control-group-title">Generator</h2>
			<div class="control-row">
				<p>Algorithm</p>
				<select id="gen-selector"></select>
			</div>
			<div class="control-row">
				<input type="checkbox" id="gen-auto-animate" class="control-checkbox">
				<p>Animate</p>
			</div>
		</div>
		<div class="control-group">
			<h2 class="control-group-title">Solver</h2>
			<div class="control-row">
				<p>Algorithm</p>
				<select id="alg-selector"></select>
			</div>
			<div class="control-row">
				<input type="checkbox" id="alg-auto-animate" class="control-checkbox">
				<p>Animate</p>
			</div>
		</div>
		<div class="control-group">
			<h2 class="control-group-title">Options</h2>
			<div class="control-row">
				<p>Start</p>
				<input id="start-x" type="number" class="control-number" value="0">
				<input id="start-y" type="number" class="control-number" value="0">
				<input type="checkbox" id="start-rand" class="control-checkbox" checked="true">
				<p>Randomize</p>
			</div>
			<div class="control-row">
				<p>Stop</p>
				<input id="stop-x" type="number" class="control-number" value="0">
				<input id="stop-y" type="number" class="control-number" value="0">
				<input type="checkbox" id="stop-rand" class="control-checkbox" checked="true">
				<p>Randomize</p>
			</div>
			<div class="control-row">
				<p>Autoreset</p>
				<select id="auto-reset"></select>
			</div>
			<div class="control-row">
				<button id="reset" class="control-button">Manual reset</button>
			</div>
		</div>
	</div>
	<div class="canvas-wrapper">
		<canvas id="background-canvas"></canvas>
	</div>
</section>