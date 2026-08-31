import type { Route } from "./+types/home";
import "../css/home.css";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Jonathan Chung",
    },
    {
      name: "Jonathan Chung's website",
      content: "Jonathan Chung's website",
    },
  ];
}

export default function Home() {
  const handleScroll = (event: any) => {
    console.log(event);
  };

  useEffect(() => {
    window.addEventListener("scroll", (e) => handleScroll(e));

    return () => {
      // return a cleanup function to unregister our function since it will run multiple times
      window.removeEventListener("scroll", (e) => handleScroll(e));
    };
  }, []);

  return (
    <>
      {/* <SunsetContainer /> */}

      <header className="header">
        <h1 id="greeting">Hi, I'm Jonathan!</h1>
      </header>

      <div className="body-container">
        <div className="card">
          <p>
            I recently quit my job as a software engineer to chase my dream of
            studying botany (plant biology). I'm in school now, but I'm open to
            part-time work! I've only ever worked in software previously, but
            I'm a quick learner and looking for new experiences.
          </p>
          <div className="button-bar">
            <a className="button" href="/resume/">
              Resume
            </a>
            <a className="button" href="https://www.linkedin.com/in/chjon/">
              LinkedIn
            </a>
            <a className="button" href="https://github.com/chjon">
              GitHub
            </a>
            <a className="button" href="mailto:chjon@proton.me">
              Email
            </a>
          </div>
        </div>

        <div className="card">
          <p>
            I love spending time outdoors! When I'm not studying plants, you
            might find me
          </p>
          <div className="slider">
            <div className="slides">
              <div id="slide-1">
                <p>rock climbing</p>
                <p className="slide-emoji">🧗</p>
              </div>
              <div id="slide-2">
                <p>hiking</p>
                <p className="slide-emoji">🥾</p>
              </div>
              <div id="slide-3">
                <p>canoeing</p>
                <p className="slide-emoji">🛶</p>
              </div>
              <div id="slide-4">
                <p>camping</p>
                <p className="slide-emoji">🏕️</p>
              </div>
              <div id="slide-5">
                <p>longboarding</p>
                <p className="slide-emoji">🛹</p>
              </div>
              <div id="slide-6">
                <p>running</p>
                <p className="slide-emoji">🏃‍♂️‍➡️</p>
              </div>
              <div id="slide-7">
                <p>skating</p>
                <p className="slide-emoji">⛸️</p>
              </div>
              <div id="slide-8">
                <p>cross-country skiing</p>
                <p className="slide-emoji">⛷️</p>
              </div>
            </div>

            <a href="#slide-1">1</a>
            <a href="#slide-2">2</a>
            <a href="#slide-3">3</a>
            <a href="#slide-4">4</a>
            <a href="#slide-5">5</a>
            <a href="#slide-6">6</a>
            <a href="#slide-7">7</a>
            <a href="#slide-8">8</a>
          </div>
        </div>
      </div>
      <br />
    </>
  );
}
