---
layout: home
stylesheet: /assets/css/home.css
script: /assets/js/home.js
seo: true
---

{% capture intro-content %}
# Hello!

I'm Jonathan, a fourth-year Computer Engineering student, undergraduate research assistant, and aspiring software engineer at the [University of Waterloo](https://uwaterloo.ca/).
I'm currently working with [Dr. Vijay Ganesh](https://ece.uwaterloo.ca/~vganesh/), studying the application of machine learning to SAT solvers.
I am a first co-author on a recent paper in this field: [On the Hierarchical Community Structure of Practical SAT Formulas](https://link.springer.com/chapter/10.1007/978-3-030-80223-3_25).

{% endcapture %}

{% capture work-content %}
# What I do:

I love learning and enjoy working on interesting challenges in many different fields. The projects I've worked on include games, simulations, and API development. I'm especially interested in the fields of computer graphics and automated reasoning.

In the past, I've worked at:

- [NVIDIA](https://www.nvidia.com/en-us/), developing and improving software tools for measuring and analyzing hardware performance. I identified performance bottlenecks and optimization opportunities, and parallelized computation and file I/O to reduce program execution time.

- [DarkVision Technologies Inc.](https://darkvisiontech.com/), working on features for their 3D ultrasound imaging tool and developing data visualization tools to expediate data analysis. I built custom graphing software for correlating datasets and worked on migrating existing tools to DirectX 12.

- [Behaviour Interactive](https://www.bhvr.com/), developing backend infrastructure to support new features for various games. I designed and implemented a rich presence system and worked on REST API endpoints.

- [Universe Projects](https://www.universeprojects.com/), implementing features for their video game, Voidspace. I developed an item collection system and a quest system for synchronizing and displaying game objectives. 

- [New York Theological Education Center](https://nytec.org/Eng/html/about_us.html), where I built and deployed a library system management application using MySQL and VBA.

In my free time, I also enjoy playing intramural Ultimate Frisbee, bouldering, and playing video games.
{% endcapture %}

<section id="about">
  {%- include card.html
    content=intro-content
    card-class="home-card"
    is-markdown=true
  -%}
</section>

<section id="about-work">
  {%- include card.html
    content=work-content
    card-class="home-card"
    is-markdown=true
  -%}
</section>