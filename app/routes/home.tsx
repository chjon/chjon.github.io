import type { Route } from "./+types/home";
import "../css/home.css";
import { useEffect } from "react";

export function meta({ }: Route.MetaArgs) {
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

export function Carousel({ interests }: { interests: Array<{ name: string, emoji: string }> }) {
  return <>
    <div className="slider">
      <div className="slides">
        {
          interests.map(({ name, emoji }) => {
            const key = `${name.replaceAll(' ', '-')}`;
            return <>
              <div key={key} id={`slide-${key}`}>
                <p>{name}</p>
                <p className="slide-emoji">{emoji}</p>
              </div>
            </>
          })
        }
      </div>

      {
        interests.map(({ name }, i) => {
          const key = `${name.replaceAll(' ', '-')}`;
          return <a key={`slide-button-${key}`} href={`#slide-${key}`} />
        })
      }
    </div>
  </>
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
      <header className="header">
        <h1 id="greeting">Hi, I'm Jonathan!</h1>
      </header>

      <div className="body-container">
        <div className="card">
          <p>
            I recently quit my job in software engineering to follow my dream of
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
          <Carousel interests={[
            { name: "rock climbing", emoji: "🧗" },
            { name: "hiking", emoji: "🥾" },
            { name: "canoeing", emoji: "🛶" },
            { name: "camping", emoji: "🏕️" },
            { name: "longboarding", emoji: "🛹" },
            { name: "running", emoji: "🏃‍♂️‍➡️" },
            { name: "skating", emoji: "⛸️" },
            { name: "cross-country skiing", emoji: "⛷️" },
          ]}/>
        </div>
      </div>
      <br />
    </>
  );
}
