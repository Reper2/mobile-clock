import crypto from "crypto";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function createSpinner() {
  const spinner = ['/', '-', '\\', '|'];
  let running = false;

  async function start(message) {
    running = true;

    while (running) {
      for (const char of spinner) {
        if (!running) break;
        process.stdout.write(`\r${char} ${message}`);
        await sleep(100);
      }
    }
  }

  function stop(finalMessage = "") {
    running = false;
    process.stdout.write(`\r✔ ${finalMessage}\n`);
  }

  return { start, stop };
}

const text = "VALID_REWARD: The reward is not ready yet. Follow the repo to know when it's complete!";
console.log("Initiating encryption process for reward text:", text);
const spinner = createSpinner();

spinner.start("Calibrating byte size for encryption appetite of:", text);
const iv = crypto.randomBytes(12);
spinner.stop("Byte size calibrated, proceeding with encryption...");

const eggs = [
  "dClock_aboveHeader",
  "dClock_aboveClock",
  "dClock_aboveFooter",
  "firstEgg",
  "fvsHome_aboveHeader",
  "fvsHome_underBtns",
  "fvsHome_underForm",
  "fvsKeybinds_aboveTitle",
  "fvsKeybinds_underAudCtrls",
  "fvsKeybinds_underList",
  "fvsKeys_underInstallBtn",
  "fvsKeys_underInstallKey",
  "fvsLinks",
  "fvsLinks_aboveTitle",
  "fvsLinks_underBtns",
  "fvsLinks_underForm",
  "fvsSoftware_aboveFooter",
  "fvsSoftware_row1",
  "fvsSoftware_row2",
  "fvsSoftware_underForm",
  "mClock",
  "switchFC"
];

const pageData = [
  ["/desktop-clock", "Desktop Clock"],
  ["/", "Home - Frosty Volcano Summit"],
  ["/keybinds", "Keybinds - Frosty Volcano Summit"],
  ["/links", "Other Links - Frosty Volcano Summit"],
  ["/mobile-clock", "Mobile Clock"],
  ["/software", "Software Library - Frosty Volcano Summit"]
];

const egg_fingerprints = [
  [eggs[0], pageData[0][0], pageData[0][1].length, pageData[0][0].length], // d_clock -> Desktop Clock [0]
  [eggs[1], pageData[0][0], pageData[0][1].length, pageData[0][0].length],
  [eggs[2], pageData[0][0], pageData[0][1].length, pageData[0][0].length],
  [eggs[3], pageData[1][0], pageData[1][1].length, pageData[1][0].length], // firstEgg -> Home [1]
  [eggs[4], pageData[1][0], pageData[1][1].length, pageData[1][0].length], // fvsHome_aboveHeader -> Home [1]
  [eggs[5], pageData[1][0], pageData[1][1].length, pageData[1][0].length], // fvsHome_underBtns -> Home [1]
  [eggs[6], pageData[1][0], pageData[1][1].length, pageData[1][0].length], // fvsHome_underForm -> Home [1]
  [eggs[7], pageData[2][0], pageData[2][1].length, pageData[2][0].length], // fvsKeybinds_aboveHeader -> Keybinds [2]
  [eggs[8], pageData[2][0], pageData[2][1].length, pageData[2][0].length], // fvsKeybinds_underAudCtrls -> Keybinds [2]
  [eggs[9], pageData[2][0], pageData[2][1].length, pageData[2][0].length], // fvsKeybinds_underList -> Keybinds [2]
  [eggs[10], pageData[2][0], pageData[2][1].length, pageData[2][0].length], // fvsKeys_underInstallBtn -> Keybinds [2]
  [eggs[11], pageData[2][0], pageData[2][1].length, pageData[2][0].length], // fvsKeys_underInstallKey -> Keybinds [2]
  [eggs[12], pageData[3][0], pageData[3][1].length, pageData[3][0].length], // fvsLinks -> Links [3]
  [eggs[13], pageData[3][0], pageData[3][1].length, pageData[3][0].length], // fvsLinks_aboveTitle -> Links [3]
  [eggs[14], pageData[3][0], pageData[3][1].length, pageData[3][0].length], // fvsLinks_underBtns -> Links [3]
  [eggs[15], pageData[3][0], pageData[3][1].length, pageData[3][0].length], // fvsLinks_underForm -> Links [3]
  [eggs[16], pageData[5][0], pageData[5][1].length, pageData[5][0].length], // fvsSoftware_aboveFooter -> Software [5]
  [eggs[17], pageData[5][0], pageData[5][1].length, pageData[5][0].length], // fvsSoftware_row1 -> Software [5]
  [eggs[18], pageData[5][0], pageData[5][1].length, pageData[5][0].length], // fvsSoftware_row2 -> Software [5]
  [eggs[19], pageData[5][0], pageData[5][1].length, pageData[5][0].length], // fvsSoftware_underForm -> Software [5]
  [eggs[20], pageData[4][0], pageData[4][1].length, pageData[4][0].length], // mClock -> Mobile Clock [4]
  [eggs[21], pageData[1][0], pageData[1][1].length, pageData[1][0].length]  // switchFC -> Home [1]
];

const canonical = egg_fingerprints
  .slice()
  .sort((a, b) => a[0].localeCompare(b[0])) // sort by id
  .map(([id, path, titleLen, pLen]) => {
    const fp = eggFingerprint(id, path, titleLen, pLen);
    return `${id}:1:${fp}`;
  })
  .join("|");

function eggFingerprint(id, expPath, titleLen, pLen) {
  const context = [
    id,
    expPath,
    titleLen,
    pLen
  ].join("|");

  return crypto.createHash("sha256")
    .update(context)
    .digest("hex")
    .slice(0, 8); // 4 bytes = 8 hex chars
}

spinner.start("Deriving encryption key from canonical egg state...");

for (const entry of canonical.split("|")) {
  const [id, _, fp] = entry.split(":");
  console.log(`Derived fingerprint for ${id}: ${fp}`);
}

const key = crypto.createHash("sha256")
  .update(canonical)
  .digest();
spinner.stop("Key derived from canonical egg state, proceeding with cipher generation...");

spinner.start("Generating cipher from salted key and init vector...");
const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
spinner.stop("Cipher generated, proceeding with encryption...");

spinner.start("Encrypting plaintext with cipher...");
const encrypted = Buffer.concat([
  cipher.update(text, "utf8"),
  cipher.final()
]);
spinner.stop("Plaintext encrypted, proceeding with authentication tag generation...");

spinner.start("Finalising encryption and fetching authentication tag...");
const tag = cipher.getAuthTag();
spinner.stop("Encryption complete.");

// Combine data and tag
const finalBuffer = Buffer.concat([encrypted, tag]);

console.log("\n--- COPY INTO eggs.ts ---");
console.log("export const PAYLOAD = {");

// We use JSON.stringify to force every single number to print
console.log(`  iv: new Uint8Array(${JSON.stringify(Array.from(iv))}),`);
console.log(`  data: new Uint8Array(${JSON.stringify(Array.from(finalBuffer))})`);

console.log("};");
console.log("-------------------------\n");