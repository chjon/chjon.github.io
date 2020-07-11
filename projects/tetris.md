---
override_title: true
title: tetris
layout: empty
override_stylesheet: true
stylesheet: /assets/css/tetris.css
script: /assets/js/tetris.js
---
<div class="title-card">
	<h1 class="title" id="title">Tetris</h1>
</div>
<div class="game-container">
	<div class="ui-panel">
		<h2>Hold</h2>
		<div class="padding">
			<div class="square-wrapper">
				<div class="square-padding"></div>
				<canvas class="square-content piece-display" id="hold-canvas"></canvas>
			</div>
		</div>
		<div class="score-display">
			<h3>Lines:</h3>
			<p>0</p>
		</div>
		<div class="score-display">
			<h3>Score:</h3>
			<p>0</p>
		</div>
	</div>
	<div class="tetris-grid">
		<div class="game-padding">
			<canvas class="game-canvas" id="game-canvas"></canvas>
		</div>
	</div>
	<div class="ui-panel">
		<h2>Next</h2>
		<div class="padding">
			<div class="square-wrapper">
				<div class="square-padding"></div>
				<canvas class="square-content piece-display" id="next-canvas"></canvas>
			</div>
		</div>
	</div>
</div>