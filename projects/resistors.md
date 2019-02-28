---
layout: default
stylesheet: /assets/css/default.css
script: /assets/js/resistors.js
---
{% capture input-panel %}
  <p>Desired resistance</p>
  <input id="desired-resistance" type="number" min="1" value="1">
  <p>Maximum number of resistors:</p>
  <input id="max-resistors" type="range" min="1" max="5" value="3">
  <p>Available resistances (comma separated)</p>
  <textarea id="available-resistances" rows="8"></textarea>
  <input id="calculate-button" type="button" value="Calculate">
{% endcapture %}

{% capture output-panel %}
  <p>Possible combinations</p>
  <textarea id="combo-output" rows="20" readonly="true"></textarea>
{% endcapture %}

<div class="row">
  {% include card.html
    content=input-panel
  %}
  {% include card.html
    content=output-panel
  %}
</div>