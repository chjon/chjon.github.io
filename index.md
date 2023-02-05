---
layout: home
stylesheet: /assets/css/home.css
script: /assets/js/home.js
seo: true
---

{% capture intro-content %}
# Hello!

I'm Jonathan, a MASc student at the [University of Waterloo](https://uwaterloo.ca/), studying Electrical and Computer Engineering with a specialization in Computer Software. I am also a recent BASc graduate from UW's Computer Engineering program.
I am currently working with [Dr. Vijay Ganesh](https://ece.uwaterloo.ca/~vganesh/), studying the application of machine learning to SAT solvers.

{% endcapture %}

{% capture work-content %}
# What I do:

I love learning and enjoy working on interesting challenges in many different fields.
The projects I've worked on include games, simulations, and API development. 
I'm currently interested in applications of technology in environment and climate change, and in the fields of computer graphics and automated reasoning.

In the past, I've worked at:

- [University of Waterloo](https://uwaterloo.ca/), researching the integration of the extended resolution proof system into CDCL SAT solvers and studying the structure of SAT instances. I co-authored a paper in this field: [On the Hierarchical Community Structure of Practical SAT Formulas](https://link.springer.com/chapter/10.1007/978-3-030-80223-3_25).

- [NVIDIA](https://www.nvidia.com/en-us/), developing and improving software tools for measuring and analyzing hardware performance. I identified performance bottlenecks and optimization opportunities, and parallelized computation and file I/O to reduce program execution time.

- [DarkVision Technologies Inc.](https://darkvisiontech.com/), working on features for their 3D ultrasound imaging tool and developing data visualization tools to expediate data analysis. I built custom graphing software for correlating datasets and worked on migrating existing tools to DirectX 12.

- [Behaviour Interactive](https://www.bhvr.com/), developing backend infrastructure to support new features for various games. I designed and implemented a rich presence system and worked on REST API endpoints.

- [Universe Projects](https://www.universeprojects.com/), implementing features for their video game, Voidspace. I developed an item collection system and a quest system for synchronizing and displaying game objectives. 

- [New York Theological Education Center](https://nytec.org/Eng/html/about_us.html), where I built and deployed a library system management application using MySQL and VBA.

In my free time, I also enjoy longboarding, bouldering, and playing video games.
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