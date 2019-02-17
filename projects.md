---
title: Projects
layout: default
permalink: /projects/
stylesheet: /assets/css/default.css
script: /assets/js/gol.js
---
{%- capture projects-main -%}
  {%- for project in site.data.projects -%}
    {%- capture projects-content -%}
      {{ project.description }}
    {%- endcapture -%}

    <div class="project-wrapper">
      {%- include card.html
        header=project.name
        content=projects-content
        card-class="default-card content-card"
        card-header-class="default-card-header content-card-header"
        card-body-class="default card-body content-card-body"
        is-markdown=true
      -%}
    </div>
  {%- endfor -%}
{%- endcapture -%}

<section>
  {% include card.html
    header=page.title
    content=projects-main
    card-class="default-card main-card"
    card-divider-class="main-card-divider"
    card-body-class="main-card-body"
  %}
</section>