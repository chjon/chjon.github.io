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
    <p>Welcome to Virtual Flashcards! Use the buttons below to move between flashcards and click cards to reveal their opposite sides.</p>
    <p><i>Hint: Try clicking this card!</i></p>
  {%- endcapture -%}
  {%- capture card-1-body-a -%}
    <table class="intro-content"><tbody>
      <tr>
        <th>Key</th>
        <th>Action</th>
      </tr>
      <tr>
        <td><kbd>A</kbd></td>
        <td>Go to previous card</td>
      </tr>
      <tr>
        <td><kbd>S</kbd></td>
        <td>Flip card</td>
      </tr>
      <tr>
        <td><kbd>D</kbd></td>
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
    <p>Try flashcards for one of these topics! Note that the flashcards here are a work in progress.</p>
    <div>
      <input
        type="radio" name="flashcard-selector" id="flashcard-selector-0" class="flashcard-selector"
        data-flashcard-path="/flashcards/data/botanical-nomenclature.json" disabled checked
      />
      <label for="flashcard-selector-0">Botanical nomenclature</label>
    </div>
    <div>
      <input
        type="radio" name="flashcard-selector" id="flashcard-selector-1" class="flashcard-selector"
        data-flashcard-path="/flashcards/data/botanical-family-names.json" disabled
      />
      <label for="flashcard-selector-1">Botanical family names</label>
    </div>
    <p>Go to the next card to proceed with your selection. Returning to this card will shuffle all the flashcards.</p>
  {%- endcapture -%}
  {%- capture card-2-body-a -%}
    <p>To use a custom set of flashcards, select a JSON file with the following format:</p>
    <pre><code>{
  "columns":["English","German"],
  "rows":[["one","eins"],["two","zwei"],...]
}</code></pre>
    <input
      type="file" id="select-json-file" name="select-json-file"
      class="file-selector" accept="text/json,.json" disabled
    />
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
  <button id="button-back" disabled>Back</button>
  <button id="button-next">Next</button>
</div>