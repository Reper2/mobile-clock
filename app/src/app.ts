import { Background, Database } from "../lib/db-typings";

/**
 * Asynchronously fetch the contents of a json file.
 * @param filename Name of json file without extension.
 * @returns Promise with type \<T\> of the parsed json or empty object if error.
 * @throws an error if the json cannot be found or other issue.
 */
async function fetchDB<T>(filename: string): Promise<T> {
  try {
    const res = await fetch(`/app/databases/${filename}.json`);
    const data = await res.text();
    return <T>JSON.parse(data);
  } catch (e) {
    console.error(`Error fetching ${filename}.json: ${e}`);
    return {} as T;
  }
}

const bg: Background.Config = {
  elem: <HTMLBodyElement>document.getElementById("_bg"),
  db: {
    photos: await fetchDB("photos"),
  },
  game: ["photos"]
};

type Name = string | number;

class RandomPicker {
  constructor(private names: Name[]) { }

  private randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private randomName(): Name {
    return this.randomItem(this.names);
  }

  pick<T>(
    getContents: (name: Name) => T[],
    useFile: (name: Name, file: T) => void,
  ): void {
    const k = this.randomName();
    const contents = getContents(k);
    const file = this.randomItem(contents);
    useFile(k, file);
  }
}

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
  const bgPicker = new RandomPicker(bg.game);
  bgPicker.pick(
    k => bg.db[k][0].contents,
    (k, file: Database.File) => {
      bg.elem.style.backgroundImage =
        `url('https://raw.githubusercontent.com/reper2/holiday-album/${k}/${file.name}')`;
      console.log(`🎮Randomly selected background from ${k}:`, file.name);
    },
  );
});