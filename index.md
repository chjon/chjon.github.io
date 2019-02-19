---
layout: home
stylesheet: /assets/css/home.css
script: /assets/js/gol.js
---

{% capture about-content %}
# Hello!

I'm Jonathan, a second-year Computer Engineering student at the University of Waterloo.

I'm currently working as a game programmer at [Behaviour Interactive](https://www.bhvr.com/), developing their backend infrastructure. In the past, I worked as a software developer at [Universe Projects]("https://www.universeprojects.com/"), where I designed and implemented features for their video game, Voidspace. Before that, I was a software development intern at [NYTEC](http://nytec.org), where I built and deployed a library system management application.

Although most of the work that I've done has been in game development, I'm always looking to learn and apply knowledge from a variety of fields. The projects I've worked on include games, graphics, simulations, and API development. I'm especially interested in [data-driven programming](https://en.wikipedia.org/wiki/Data-driven_programming) and [emergent behaviour](https://en.wikipedia.org/wiki/Emergence). Examples of my work can be found on my [projects](/projects) page.

In my free time, I also enjoy playing intramural Ultimate Frisbee, learning about math and physics, and playing video games.
{% endcapture %}

<section id="about">
  {%- include card.html
    content=about-content
    card-class="home-card"
    is-markdown=true
  -%}
</section>