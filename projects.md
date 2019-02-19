---
title: Projects
layout: default
permalink: /projects/
stylesheet: /assets/css/default.css
script: /assets/js/gol.js
---
{%- capture projects-main -%}
  {%- for project in site.data.projects -%}
    {%- capture project-content -%}
      {%- if project.description -%}
        {{ project.description | markdownify }}
      {%- endif -%}
      <div class="button-bar">
        {%- if project.github-link -%}
          {%- include button.html
            name="GitHub"
            button-class="project-button"
            image="/assets/icons/github-icon.png"
            link=project.github-link
            description="GitHub page"
          -%}
        {%- endif -%}
        {%- if project.page-link -%}
          {%- include button.html
            name="Page"
            button-class="project-button"
            image="/assets/icons/link-icon.png"
            link=project.page-link
            description=project.page-description
          -%}
        {%- endif -%}
      </div>
    {%- endcapture -%}

    <div class="project-wrapper">
      {%- include hover-card.html
        header=project.name
        content=project-content
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