---
title: The Innocence Test
override_title: true
layout: empty
stylesheet: /assets/css/quiz.css
script: /assets/js/quiz.js
---

{% for t in site.data.quizzes.innocence limit: 1 %}
    {%- include quiz.html test=t -%}
{% endfor %}