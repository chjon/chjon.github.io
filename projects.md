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
      {%- if project.description -%}
        <p>{{ project.description }}</p>
      {%- endif -%}
    {%- endcapture -%}

    <div class="project-wrapper">
      {%- include hover-card.html
        header=project.name
        content=project.description
        card-class="project-card"
        card-overlay-class="project-card-overlay"
        card-header-class="project-card-header"
        card-body-class="project-card-body"
        img=project.image
        link=project.link
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