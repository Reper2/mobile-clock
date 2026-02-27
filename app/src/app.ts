import { Background } from "../lib/db-typings";

/**
 * Asynchronously fetch the contents of a json file.
 * @param filename Name of json file without extension.
 * @returns Promise with type \<T\> of the parsed json or empty object if error.
 * @throws an error if the json cannot be found or other issue.
 */
async function fetchDB<T>(filename: string): Promise<T> {
  try {
    const res = await fetch(`./app/databases/${filename}.json`);
    const data = await res.text();
    return <T>JSON.parse(data);
  } catch (e) {
    console.error(`Error fetching ${filename}.json: ${e}`);
    return {} as T;
  }
}

const bg: Background.Config = {
  elem: <HTMLBodyElement>document.getElementById("_bg"),
  db: await fetchDB("photos")
};

const clock = document.getElementById("clock") as HTMLSpanElement;

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString();

  /* ms remaining until next second */
  const delay = 1000 - now.getMilliseconds();

  setTimeout(updateClock, delay);
}

updateClock();
$(function () {
  const photo = Math.floor(Math.random() * bg.db[0].contents.length);
  const file = bg.db[0].contents[photo];
  bg.elem.style.backgroundImage =
    `url('https://raw.githubusercontent.com/reper2/holiday-album/master/photos/${file.name}')`;
  console.log(`🎮Randomly selected background from photos`, file.name);
});