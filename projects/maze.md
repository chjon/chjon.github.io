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
		</div>
		<div class="control-group">
			<h2 class="control-group-title">Solver</h2>
			<div class="control-row">
				<p>Algorithm</p>
				<select id="alg-selector"></select>
			</div>
		</div>
	</div>
	<div class="canvas-wrapper">
		<canvas id="background-canvas"></canvas>
	</div>
</section>