---
layout: default
stylesheet: /assets/css/default.css
script: /assets/js/resistors.js
---
{% capture resistor-color-decoder %}
  <canvas id="resistor-color-decoder"></canvas>
  <p>Test</p>
{% endcapture %}
<div>
  {% include card.html
    content=resistor-color-decoder
  %}
</div>