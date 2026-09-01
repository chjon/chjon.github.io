import type { Route } from "./+types/home";
import "../css/home.css";
import { useEffect, useRef, useState } from "react";

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
    refs[i].current?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
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

const leaves = [
  {
    "latin-name": "Acer saccharum",
    "common-name": "Sugar Maple",
    "path": "/assets/leaves/acer.svg",
    "link": "https://en.wikipedia.org/wiki/Acer_saccharum"
  },
  {
    "latin-name": "Aesculus hippocastanum",
    "common-name": "Horse Chestnut",
    "path": "/assets/leaves/aesculus.svg",
    "link": "https://en.wikipedia.org/wiki/Aesculus_hippocastanum"
  },
  {
    "latin-name": "Betula papyrifera",
    "common-name": "White Birch",
    "path": "/assets/leaves/betula.svg",
    "link": "https://en.wikipedia.org/wiki/Betula_papyrifera"
  },
  {
    "latin-name": "Gingko biloba",
    "common-name": "Gingko",
    "path": "/assets/leaves/gingko.svg",
    "link": "https://en.wikipedia.org/wiki/Ginkgo_biloba"
  },
  {
    "latin-name": "Gymnocladus dioicus",
    "common-name": "Kentucky Coffee Tree",
    "path": "/assets/leaves/gymnocladus.svg",
    "link": "https://en.wikipedia.org/wiki/Gymnocladus_dioicus"
  },
  {
    "latin-name": "Juglans nigra",
    "common-name": "Black Walnut",
    "path": "/assets/leaves/juglans.svg",
    "link": "https://en.wikipedia.org/wiki/Juglans_nigra"
  },
  {
    "latin-name": "Liquidambar styraciflua",
    "common-name": "Sweetgum",
    "path": "/assets/leaves/liquidambar.svg",
    "link": "https://en.wikipedia.org/wiki/Liquidambar_styraciflua"
  },
  {
    "latin-name": "Liriodendron tulipifera",
    "common-name": "Tulip-tree",
    "path": "/assets/leaves/liriodendron.svg",
    "link": "https://en.wikipedia.org/wiki/Liriodendron_tulipifera"
  },
  {
    "latin-name": "Quercus alba",
    "common-name": "White Oak",
    "path": "/assets/leaves/quercus_alba.svg",
    "link": "https://en.wikipedia.org/wiki/Quercus_alba"
  },
  {
    "latin-name": "Quercus rubra",
    "common-name": "Northern Red Oak",
    "path": "/assets/leaves/quercus_rubra.svg",
    "link": "https://en.wikipedia.org/wiki/Quercus_rubra"
  },
    {
    "latin-name": "Sassafras albidum",
    "common-name": "Sassafras",
    "path": "/assets/leaves/sassafras_trident.svg",
    "link": "https://en.wikipedia.org/wiki/Sassafras_albidum"
  },
  {
    "latin-name": "Sassafras albidum",
    "common-name": "Sassafras",
    "path": "/assets/leaves/sassafras_mitten.svg",
    "link": "https://en.wikipedia.org/wiki/Sassafras_albidum"
  },
  {
    "latin-name": "Sassafras albidum",
    "common-name": "Sassafras",
    "path": "/assets/leaves/sassafras_single.svg",
    "link": "https://en.wikipedia.org/wiki/Sassafras_albidum"
  },
  {
    "latin-name": "Tilia americana",
    "common-name": "American Basswood",
    "path": "/assets/leaves/tilia.svg",
    "link": "https://en.wikipedia.org/wiki/Tilia_americana"
  },
  {
    "latin-name": "Ulmus americana",
    "common-name": "American Elm",
    "path": "/assets/leaves/ulmus.svg",
    "link": "https://en.wikipedia.org/wiki/Ulmus_americana"
  },
];

function getRandomizedTiling(width: number, height: number) {
  // Generate randomized tiling
  const tiles = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      // Get a random index and ensure it is not the same as neighbouring tiles
      const neighbours = new Set();
      if (i > 0) {
        neighbours.add(tiles[i - 1][j]);
        if (j > 0) neighbours.add(tiles[i - 1][j - 1]);
        if (j < width - 1) neighbours.add(tiles[i - 1][j + 1]);
      }
      if (i > 1) neighbours.add(tiles[i - 2][j]); // Tiles two rows away are visually close by
      if (j > 0) neighbours.add(row[j - 1]);
      let randomIndex = Math.floor(Math.random() * leaves.length);
      while (neighbours.has(randomIndex))
        randomIndex = Math.floor(Math.random() * leaves.length);
      row.push(randomIndex);
    }
    tiles.push(row);
  }

  return tiles;
}

function getRandomizedOrientations(width: number, height: number) {
  const orientations = [];
  for (let i = 0; i < width; i++) {
    const row = [];
    for (let j = 0; j < height; j++) {
      row.push(Math.random());
      orientations.push(row);
    }
  }

  return orientations;
}

function BackgroundLeaves(
  {
    tiles,
    tileOrientations,
    selectedLeafIndex
  }: {
    tiles: Array<Array<number>>
    tileOrientations: Array<Array<number>>
    selectedLeafIndex: number
  }
) {
  return <div className="background-tiles"> {
    tiles.map((row, i) => (
      row.map((leafIndex, j) => (
        <img
          key={`background-tiles-${i}-${j}`}
          className={leafIndex == selectedLeafIndex ? "leaf leaf-selected" : "leaf"}
          src={leaves[leafIndex].path}
          style={{
            rotate: `${2 * tileOrientations[i][j]}turn`,
            transform: tileOrientations[i][j] > 0.5 ? "scaleX(-1)" : "1",
          }}
        />
      ))
    ))
  } </div>
}

export default function Home() {
  const [selectedLeafIndex, setSelectedLeafIndex] = useState(-1);
  const [tilesWidth, tilesHeight] = [10, 10];
  const [tiles, setTiles] = useState<Array<Array<number>>>([]);
  const [orientations, setOrientations] = useState<Array<Array<number>>>([]);
  const regenerateBackground = () => {
    setTiles(getRandomizedTiling(tilesWidth, tilesHeight));
    setOrientations(getRandomizedOrientations(tilesWidth, tilesHeight));
  }

  useEffect(regenerateBackground, []);

  return (
    <>
      <header className="header">
        <h1 id="greeting">Hi, I'm Jonathan!</h1>
      </header>

      <div className="body-container">
        <BackgroundLeaves
          selectedLeafIndex={selectedLeafIndex}
          tiles={tiles}
          tileOrientations={orientations}
        />
        <div className="card">
          <p>
            I recently quit my job in software engineering to pursue my dream of
            studying botany (plant biology). I'm in school now, but I'm open to
            part-time work! I've only worked in software previously, but
            I'm a quick learner and I'm looking for new experiences.
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
          <p>I love spending time outdoors!</p>
          <p>When I'm not studying plants, you might find me</p>
          <Carousel
            interests={[
              { name: "camping", emoji: "🏕️" },
              { name: "hiking", emoji: "🥾" },
              { name: "canoeing", emoji: "🛶" },
              { name: "rock climbing", emoji: "🧗" },
              { name: "longboarding", emoji: "🛹" },
              { name: "running", emoji: "🏃‍♂️‍➡️" },
              { name: "skating", emoji: "⛸️" },
              { name: "cross-country skiing", emoji: "⛷️" },
            ]}
          />
        </div>

        <div className="card">
          <p>Curious about the leaf silhouettes in the background?</p>
          <p>Here's what they are:</p>
          <div className="leaf-gallery">
            {
              leaves.map(({
                "latin-name": latin,
                "common-name": common,
                path,
                link,
              }, i) => {
                return <div className="leaf-gallery-item">
                  <img
                    key={latin}
                    className={`leaf ${i == selectedLeafIndex ? "leaf-active": "leaf-inactive"}`}
                    src={path}
                    onClick={() => { setSelectedLeafIndex(i == selectedLeafIndex ? -1 : i) }}
                  />
                  <a className="leaf-gallery-item-label" href={link}>
                    <p className="leaf-gallery-item-latin"><i>{latin}</i></p>
                    <p className="leaf-gallery-item-common">
                      {common}
                      <img className="link-indicator" src="/assets/link.svg" />
                    </p>
                  </a>
                </div>
              })
            }
          </div>
        </div>
      </div>
    </>
  );
}
