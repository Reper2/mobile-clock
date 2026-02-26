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
    db: await fetchDB("photos")
};
const clock = document.getElementById("clock");
function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
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
export {};
//# sourceMappingURL=app.js.map