---
title: Projects
layout: default
permalink: /projects/
---
{% capture projects-content %}
Nested project content
{% endcapture %}

{% capture projects-main %}

{%- for i in (0..29) -%}
  {%- include card.html
    content=projects-content
    card-class="default-card content-card"
    card-header-class="default-card-header"
    is-markdown=true
  -%}
{%- endfor -%}

{% endcapture %}

<section>
  {% include card.html
    header=page.title
    content=projects-main
    card-class="default-card main-card"
    card-divider-class="main-card-divider"
    card-body-class="main-card-body"
  %}
</section>