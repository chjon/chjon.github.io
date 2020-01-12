---
layout: home
stylesheet: /assets/css/home.css
script: /assets/js/gol.js
---

{% capture about-content %}
# Hello!

I'm Jonathan, a third-year Computer Engineering student and aspiring software engineer at the University of Waterloo.

I love learning and enjoy working in many different fields. The projects I've worked on include games, simulations, and API development. I'm especially interested in computer graphics and [emergent behaviour](https://en.wikipedia.org/wiki/Emergence). Examples of my work can be found on my [projects](/projects) page.

I'm currently working as an undergraduate research assistant with [Dr. Vijay Ganesh](https://ece.uwaterloo.ca/~vganesh/), studying the application of machine learning to SAT solvers.

In the past, I've worked at:

- [DarkVision Technologies Inc.](https://darkvisiontech.com/), working on features for their 3D ultrasound imaging tool and developing data visualization tools to expediate data analysis. I built custom graphing software for correlating datasets and worked on migrating existing tools to DirectX 12.

- [Behaviour Interactive](https://www.bhvr.com/), developing backend infrastructure to support new features for various games. I designed and implemented a rich presence system and worked on REST API endpoints.

- [Universe Projects]("https://www.universeprojects.com/"), implementing features for their video game, Voidspace. I developed an item collection system and a quest system for synchronizing and displaying game objectives. 

- New York Theological Education Center, where I built and deployed a library system management application using MySQL and VBA.

In my free time, I also enjoy playing intramural Ultimate Frisbee, learning about math and physics, and playing video games.
{% endcapture %}

<section id="about">
  {%- include card.html
    content=about-content
    card-class="home-card"
    is-markdown=true
  -%}
</section>