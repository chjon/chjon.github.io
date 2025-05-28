---
title: Virtual Flashcards
layout: flashcards
---
<div id="carousel" class="carousel">
  {%- capture intro-card-body-q -%}
    <p>Use the keyboard or the buttons to navigate. Click a card to flip it.</p>
    <table class="intro-content"><tbody>
      <tr>
        <th>Key</th>
        <th>Action</th>
      </tr>
      <tr>
        <td>Spacebar</td>
        <td>Flip card</td>
      </tr>
      <tr>
        <td>B</td>
        <td>Go to previous card</td>
      </tr>
      <tr>
        <td>N</td>
        <td>Go to next card</td>
      </tr>
    </tbody></table>
  {%- endcapture -%}
  {%- capture intro-card-body-a -%}
    <div>
      <label for="select-csv">Select a CSV</label>
      <input type="file" id="select-csv" name="select-csv" class="file-selector" accept="text/csv,.csv">
    </div>
    <a href="/" target="_blank">https://jonathanchung.xyz</a>
  {%- endcapture -%}
  {% include flashcard.html class="out-left" %}
  {% include flashcard.html
    class="in-centre"
    q-side-header=page.title
    q-side-body=intro-card-body-q
    a-side-body=intro-card-body-a
  %}
  {% include flashcard.html class="out-right" %}
</div>
<div class="button-bar">
  <button id="button-back">Back</button>
  <button id="button-next">Next</button>
</div>