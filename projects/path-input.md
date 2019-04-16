---
title: Path Input
layout: vis
stylesheet: /assets/css/default.css
script: /assets/js/path-input.js
---
<div class="control-group">
  <h2 class="control-group-title">Mode</h2>
  <div class="control-row">
    <p id="mode-label">Current mode: Draw</p>
  </div>
  <div class="control-row">
    <div class="button-array">
      <button id="mode-draw">Draw</button>
      <button id="mode-connect">Connect</button>
      <button id="mode-select">Select</button>
      <button id="mode-move">Move</button>
      <button id="mode-rotate">Rotate</button>
      <button id="mode-scale">Scale</button>
      <button id="mode-view">View</button>
      <button id="mode-set-start">Set start point</button>
    </div>
  </div>
</div>
<div class="control-group">
  <h2 class="control-group-title">Data</h2>
  <div class="control-row">
    <textarea id="data" class="control-textarea" rows="10"></textarea>
  </div>
  <div class="button-array">
    <button id="data-input">Import</button>
    <button id="data-output">Export</button>
  </div>
</div>