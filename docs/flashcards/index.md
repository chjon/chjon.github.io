---
title: Virtual Flashcards
layout: flashcards
---
<div id="carousel" class="carousel">
  <!-- Menu flashcards -->
  {%- capture card-1-header-q -%}
    {{ page.title }} by <a href="/" target="_blank">Jonathan</a>
  {%- endcapture -%}
  {%- capture card-1-body-q -%}
    <p>Welcome to Virtual Flashcards! Use the buttons below to navigate. Click a card to flip it.</p>
  {%- endcapture -%}
  {%- capture card-1-body-a -%}
    <table class="intro-content"><tbody>
      <tr>
        <th>Key</th>
        <th>Action</th>
      </tr>
      <tr>
        <td>A</td>
        <td>Go to previous card</td>
      </tr>
      <tr>
        <td>S</td>
        <td>Flip card</td>
      </tr>
      <tr>
        <td>D</td>
        <td>Go to next card</td>
      </tr>
    </tbody></table>
  {%- endcapture -%}
  {% include flashcard.html
    class="menu-card in-centre"
    q-side-header=card-1-header-q
    q-side-body=card-1-body-q
    a-side-header="Keyboard controls"
    a-side-body=card-1-body-a
  %}

  {%- capture card-2-body-q -%}
    <p>Proceed to the next card to begin studying the selected flashcards.</p>
    <div>
      <input type="radio" name="flashcard-selector" id="flashcard-selector-0" checked />
      <label for="flashcard-selector-0">Botanical nomenclature</label>
    </div>
    <div>
      <input type="radio" name="flashcard-selector" id="flashcard-selector-1" />
      <label for="flashcard-selector-1">Botanical family names</label>
    </div>
  {%- endcapture -%}
  {%- capture card-2-body-a -%}
    <div>
      <label for="select-csv">Select a CSV</label>
      <input type="file" id="select-csv" name="select-csv" class="file-selector" accept="text/csv,.csv">
    </div>
  {%- endcapture -%}
  {% include flashcard.html
    class="menu-card out-right"
    q-side-header="Select flashcards"
    q-side-body=card-2-body-q
    a-side-header="Import flashcards"
    a-side-body=card-2-body-a
  %}

  <!-- Content flashcards -->
  {% include flashcard.html class="content-card out-right" %}
  {% include flashcard.html class="content-card out-right" %}
  {% include flashcard.html class="content-card out-right" %}
</div>
<div class="button-bar">
  <button id="button-back">Back</button>
  <button id="button-next">Next</button>
</div>