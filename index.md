---
---
{%- capture header_content -%}
<div class="header-wrapper">
  <a class="home-title">{{ site.title }}</a>
  {% include button-bar.html
    data=site.data.home-nav-bar
    button_bar_class="home-nav-bar"
    button_class="home-nav-button"
  %}
</div>
{%- endcapture -%}

{% capture about_content %}
# Hello!

I'm Jonathan, a second-year Computer Engineering student at the University of Waterloo.

I'm currently working as a game programmer at [Behaviour Interactive](https://www.bhvr.com/), developing their backend infrastructure. In the past, I worked as a software developer at [Universe Projects]("https://www.universeprojects.com/"), where I designed and implemented features for their video game, Voidspace. Before that, I was a software development intern at [NYTEC](http://nytec.org), where I built and deployed a library system management application.

Although most of the work that I've done has been in game development, I'm always looking to learn and apply knowledge from a variety of fields. The projects I've worked on include games, graphics, simulations, and API development. I'm especially interested in [data-driven programming](https://en.wikipedia.org/wiki/Data-driven_programming) and [emergent behaviour](https://en.wikipedia.org/wiki/Emergence). Examples of my work can be found on my [projects](/projects) page.

In my free time, I also enjoy playing intramural Ultimate Frisbee, learning about math and physics, and playing video games.
{% endcapture %}

{%- capture footer_content -%}
  {% include button-bar.html
    data=site.data.toolbar
    button_bar_class="footer-button-bar"
    button_class="footer-button"
    button_image_class="footer-button-image"
  %}
  <p class="footer-copyright">{{-
    '© ' | append: site.author |  append: ' ' | append: site.copyright-year |
    append: '. All rights reserved.'
  -}}</p>
{%- endcapture -%}

<header>{{ header_content }}</header>
<section id="about">{% include card.html content=about_content isMarkdown=true %}</section>
<footer>{% include card.html id="footer-card" content=footer_content %}</footer>