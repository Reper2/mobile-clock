async function fetchDB(filename) {
    try {
        const res = await fetch(`/app/databases/${filename}.json`);
        const data = await res.text();
        return JSON.parse(data);
    }
    catch (e) {
        console.error(`Error fetching ${filename}.json: ${e}`);
        return {};
    }
}
const bg = {
    elem: document.getElementById("_bg"),
    db: {
        photos: await fetchDB("photos"),
    },
    game: ["photos"]
};
class RandomPicker {
    names;
    constructor(names) {
        this.names = names;
    }
    randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    randomName() {
        return this.randomItem(this.names);
    }
    pick(getContents, useFile) {
        const k = this.randomName();
        const contents = getContents(k);
        const file = this.randomItem(contents);
        useFile(k, file);
    }
}
const clock = document.getElementById("clock");
function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
    const delay = 1000 - now.getMilliseconds();
    setTimeout(updateClock, delay);
}
updateClock();
$(function () {
    const bgPicker = new RandomPicker(bg.game);
    bgPicker.pick(k => bg.db[k][0].contents, (k, file) => {
        bg.elem.style.backgroundImage =
            `url('https://raw.githubusercontent.com/reper2/holiday-album/${k}/${file.name}')`;
        console.log(`🎮Randomly selected background from ${k}:`, file.name);
    });
});
export {};
//# sourceMappingURL=app.js.map