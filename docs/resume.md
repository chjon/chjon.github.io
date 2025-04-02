---
layout: resume
title: Resume
permalink: /resume/
---

<div id="header">
    <h1>Jonathan Chung</h1>
    <div class="infobox">
        {% include resume-infobox-entry.html data=site.data.resume.infobox.github %}
        {% include resume-infobox-entry.html data=site.data.resume.infobox.website %}
    </div>
    <div class="infobox">
        {% include resume-infobox-entry.html data=site.data.resume.infobox.email %}
        <!-- {% include resume-infobox-entry.html data=site.data.resume.infobox.phone %} -->
    </div>
</div>

<section id="experience">
    <div class="vertical-separator-circle"></div>
    <div class="vertical-separator"></div>
    <h2>Experience</h2>
    {% for item in site.data.resume.experience %}
        {%- capture experience-header-left -%}
            **{{ item.name }}**, *{{ item.details }}*
        {%- endcapture -%}
        {%- capture experience-header-right -%}
            {{ item.location }}
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
</section>

<section id="education">
    <div class="vertical-separator-circle"></div>
    <div class="vertical-separator"></div>
    <h2>Education</h2>
    {% for item in site.data.resume.education %}
        {%- capture experience-header-left -%}
            **{{ item.name }}**, *{{ item.details }}*
        {%- endcapture -%}
        {%- capture experience-header-right -%}
            {{ item.location | markdownify }}
        {%- endcapture -%}
        {%- capture experience-content -%}
            {%- for subitem in item.content-list %}
                {{ subitem | markdownify }}
            {% endfor -%}
        {%- endcapture -%}
        {%- include resume-entry.html
            entry-header-left=experience-header-left
            entry-header-right=experience-header-right
            entry-content=experience-content
            entry-float=item.date
        -%}
    {% endfor %}
</section>

<section id="publications">
    <div class="vertical-separator-circle"></div>
    <div class="vertical-separator"></div>
    <h2>Publications</h2>
    {% for item in site.data.resume.publications %}
        {%- capture experience-header-left -%}
            [{{ item.name }}]({{ item.details }})
        {%- endcapture -%}
        {%- capture experience-header-right -%}
            {{ item.location }} {{ item.date }}
        {%- endcapture -%}
        {%- include resume-entry.html
            entry-header-left=experience-header-left
            entry-header-right=experience-header-right
        -%}
    {% endfor %}
</section>
