---
layout: resume
title: Resume
permalink: /resume/
---
<div class="page"><div class="page-content">
<div id="header">
    <h1>Jonathan Chung</h1>
    <div class="infobox">
        {% include resume-infobox-entry.html data=site.data.resume.infobox.github %}
        {% include resume-infobox-entry.html data=site.data.resume.infobox.website %}
    </div>
    <div class="infobox">
        {% include resume-infobox-entry.html data=site.data.resume.infobox.email %}
        {% include resume-infobox-entry.html data=site.data.resume.infobox.phone %}
    </div>
</div>

<section id="experience">
    <div class="vertical-separator-circle"></div>
    <div class="vertical-separator"></div>
    <h2>Experience</h2>
    <div class="section-content">
        {% for item in site.data.resume.experience %}
            {%- capture experience-header-left -%}
                **{{ item.details }}**, *{{ item.name }}*, {{ item.location }}
            {%- endcapture -%}
            {%- capture experience-header-right -%}
                {%- for subitem in item.stack -%}
                `{{- subitem -}}`
                {%- endfor -%}
            {%- endcapture -%}
            {%- capture experience-content -%}
                {{ item.content | markdownify }}
                <ul>{%- for subitem in item.content-list %}
                    <li>{{ subitem | markdownify }}</li>
                {% endfor -%}</ul>
            {%- endcapture -%}
            {%- include resume-entry.html
                entry-header-left=experience-header-left
                entry-header-right=experience-header-right
                entry-content=experience-content
                entry-float=item.date
            -%}
        {% endfor %}
    </div>
</section>

<section id="education">
    <div class="vertical-separator-circle"></div>
    <div class="vertical-separator"></div>
    <h2>Education</h2>
    <div class="section-content">
        {% for item in site.data.resume.education %}
            {%- capture experience-header-left -%}
                **{{ item.name }}**, *{{ item.details }}*, {{ item.location }}
            {%- endcapture -%}
            {%- capture experience-content -%}
                {%- for subitem in item.content-list %}
                    {{ subitem | markdownify }}
                {% endfor -%}
            {%- endcapture -%}
            {%- include resume-entry.html
                entry-header-left=experience-header-left
                entry-content=experience-content
                entry-float=item.date
            -%}
        {% endfor %}
    </div>
</section>
</div></div>

<div class="page"><div class="page-content">
<section id="volunteering">
    <div class="vertical-separator-circle"></div>
    <div class="vertical-separator"></div>
    <h2>Volunteering</h2>
    <div class="section-content">
        {% for item in site.data.resume.volunteering %}
            {%- capture experience-header-left -%}
                **{{ item.details }}**, *{{ item.name }}*, {{ item.location }}
            {%- endcapture -%}
            {%- capture experience-header-right -%}
                {%- for subitem in item.stack -%}
                `{{- subitem -}}`
                {%- endfor -%}
            {%- endcapture -%}
            {%- capture experience-content -%}
                {{ item.content | markdownify }}
                <ul>{%- for subitem in item.content-list %}
                    <li>{{ subitem | markdownify }}</li>
                {% endfor -%}</ul>
            {%- endcapture -%}
            {%- include resume-entry.html
                entry-header-left=experience-header-left
                entry-header-right=experience-header-right
                entry-content=experience-content
                entry-float=item.date
            -%}
        {% endfor %}
    </div>
</section>

<section id="publications">
    <div class="vertical-separator-circle"></div>
    <div class="vertical-separator"></div>
    <h2>Publications</h2>
    <div class="section-content">
        {% for item in site.data.resume.publications %}
            {%- capture experience-header-left -%}
                {%- if item.details -%}
                    [{{ item.name }}]({{ item.details }})
                {%- else -%}
                    {{ item.name }}
                {%- endif -%}
            {%- endcapture -%}
            {%- capture experience-header-right -%}
                {{ item.location }}
            {%- endcapture -%}
            {%- capture experience-content -%}
                {{ item.content | markdownify }}
            {%- endcapture -%}
            {%- include resume-entry.html
                entry-header-left=experience-header-left
                entry-header-right=experience-header-right
                entry-content=experience-content
                entry-float=item.date
            -%}
        {% endfor %}
    </div>
</section>

<section id="projects">
    <div class="vertical-separator-circle"></div>
    <div class="vertical-separator"></div>
    <h2>Projects</h2>
    <div class="section-content">
        {% for item in site.data.resume.projects %}
            {%- capture experience-header-left -%}
                [**{{ item.name }}**]({{ item.link }}), *{{ item.details }}*
            {%- endcapture -%}
            {%- capture experience-header-right -%}
                {%- for subitem in item.stack -%}
                `{{- subitem -}}`
                {%- endfor -%}
            {%- endcapture -%}
            {%- capture experience-content -%}
                {%- for subitem in item.content-list %}
                    {{ subitem | markdownify }}
                {% endfor -%}
            {%- endcapture -%}
            {%- include resume-entry.html
                icon=item.icon
                icon-size=item.icon-size
                entry-header-left=experience-header-left
                entry-header-right=experience-header-right
                entry-content=experience-content
                entry-float=item.date
            -%}
        {% endfor %}
    </div>
</section>

<section id="skills">
    <div class="vertical-separator-circle"></div>
    <div class="vertical-separator"></div>
    <h2>Skills</h2>
    <div class="section-content">
        {% for item in site.data.resume.skills %}
            {%- capture experience-header-left -%}
                **{{ item.name }}:**
            {%- endcapture -%}
            {%- capture experience-header-right -%}
                {{ item.stack | join: ", " }}
            {%- endcapture -%}
            {%- include resume-entry.html
                entry-header-left=experience-header-left
                entry-header-right=experience-header-right
            -%}
        {% endfor %}
    </div>
</section>
</div>
<div id="footer">
    {% assign resume-stack = "html, css, markdown, yaml, liquid, jekyll" | split: ", " %}
    {%- capture footer-content -%}
        This resume was built with
        {%- for subitem in resume-stack -%}
            `{{- subitem -}}`
        {%- endfor -%}
    {%- endcapture -%}
    {{ footer-content | markdownify }}
</div>
</div>