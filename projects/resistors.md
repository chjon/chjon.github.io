---
layout: default
stylesheet: /assets/css/default.css
script: /assets/js/resistors.js
---
{%- capture input-panel -%}
  <p>Desired resistance</p>
  <input id="desired-resistance" type="number" min="1" value="1">
  <p>Available resistances (comma separated)</p>
  <textarea id="available-resistances" rows="8"></textarea>
  <p>Maximum number of resistors:</p>
  <input id="max-resistors" type="range" min="1" max="5" value="3">
  <p>Tolerance</p>
  <input id="acceptable-tolerance" type="number" min="0" value="1">
  <br/>
  <input id="calculate-button" type="button" value="Calculate">
{%- endcapture -%}

{% capture output-panel %}
  <p>Possible combinations</p>
  <textarea id="combo-output" rows="28" readonly="true"></textarea>
{% endcapture %}

<div class="row">
  {% include card.html
    content=input-panel
  %}
  {% include card.html
    content=output-panel
  %}
</div>