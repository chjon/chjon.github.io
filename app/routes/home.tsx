import type { Route } from "./+types/home";
import "../css/home.css";
import { useRef, useState } from "react";

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

export function Carousel({
  interests,
}: {
  interests: Array<{ name: string; emoji: string }>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevIndex = (activeIndex + interests.length - 1) % interests.length;
  const nextIndex = (activeIndex + 1) % interests.length;

  const refs = interests.map((_) => useRef<HTMLDivElement | null>(null));

  const goToIndex = (i: number) => {
    setActiveIndex(i);
    refs[i].current?.scrollIntoView();
  };

  return (
    <>
      <div className="slider">
        <div className="flex justify-center items-center gap-4">
          <a
            className="slide-nav"
            onClick={() => {
              goToIndex(prevIndex);
            }}
          >
            ◄
          </a>
          <div className="slides">
            {interests.map(({ name, emoji }, i) => {
              return (
                <div key={`slide-${i}`} ref={refs[i]}>
                  <p className="slide-text">{name}</p>
                  <p className="slide-emoji">{emoji}</p>
                </div>
              );
            })}
          </div>
          <a
            className="slide-nav"
            onClick={() => {
              goToIndex(nextIndex);
            }}
          >
            ►
          </a>
        </div>

        {interests.map((_, i) => {
          return (
            <a
              key={`slide-button-${i}`}
              className={`slide-button slide-button-${activeIndex == i ? "active" : "inactive"}`}
              onClick={() => {
                goToIndex(i);
              }}
            />
          );
        })}
      </div>
    </>
  );
}

function BackgroundLeaves() {
  const leaves = [
    "/assets/leaves/acer.svg",
    "/assets/leaves/aesculus.svg",
    "/assets/leaves/betula.svg",
    "/assets/leaves/gingko.svg",
    "/assets/leaves/gymnocladus.svg",
    "/assets/leaves/juglans.svg",
    "/assets/leaves/liquidambar.svg",
    "/assets/leaves/liriodendron.svg",
    "/assets/leaves/quercus_alba.svg",
    "/assets/leaves/quercus_rubra.svg",
    "/assets/leaves/sassafras_mitten.svg",
    "/assets/leaves/sassafras_single.svg",
    "/assets/leaves/sassafras_trident.svg",
    "/assets/leaves/tilia.svg",
    "/assets/leaves/ulmus.svg",
  ];

  const tilesWidth = 10;
  const tilesHeight = 10;
  // Generate randomized tiling
  const tiles = [];
  for (let i = 0; i < tilesHeight; i++) {
    const row = [];
    for (let j = 0; j < tilesWidth; j++) {
      // Get a random index and ensure it is not the same as neighbouring tiles
      const neighbours = new Set();
      if (i > 0) {
        neighbours.add(tiles[i - 1][j]);
        if (j > 0) neighbours.add(tiles[i - 1][j - 1]);
        if (j < tilesWidth - 1) neighbours.add(tiles[i - 1][j + 1]);
      }
      if (j > 0) neighbours.add(row[j - 1]);
      let randomIndex = Math.floor(Math.random() * leaves.length);
      while (neighbours.has(randomIndex))
        randomIndex = Math.floor(Math.random() * leaves.length);
      row.push(randomIndex);
    }
    tiles.push(row);
  }

  return <div className="background-tiles">
    {
      tiles.map((row, i) => <div key={`background-tiles-${i}`} className="background-tiles-row"> {
        row.map((leafIndex, j) => <img
          key={`background-tiles-${i}-${j}`}
          className="leaf"
          src={leaves[leafIndex]}
          style={{rotate: `${Math.random()}turn`}}
        />)
      } </div>)
    }
  </div>
}

export default function Home() {
  return (
    <>
      <header className="header">
        <h1 id="greeting">Hi, I'm Jonathan!</h1>
      </header>

      <div className="body-container">
        <BackgroundLeaves />
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
          <Carousel
            interests={[
              { name: "rock climbing", emoji: "🧗" },
              { name: "hiking", emoji: "🥾" },
              { name: "canoeing", emoji: "🛶" },
              { name: "camping", emoji: "🏕️" },
              { name: "longboarding", emoji: "🛹" },
              { name: "running", emoji: "🏃‍♂️‍➡️" },
              { name: "skating", emoji: "⛸️" },
              { name: "cross-country skiing", emoji: "⛷️" },
            ]}
          />
        </div>
      </div>
    </>
  );
}
