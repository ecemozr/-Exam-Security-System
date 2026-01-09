const Jimp = require("jimp");

function hamming(a, b) {
    let x = BigInt(a) ^ BigInt(b);
    let c = 0n;
    while (x) { c += x & 1n; x >>= 1n; }
    return Number(c);
}

// 64-bit average hash
async function ahash64(filePath) {
    const img = await Jimp.read(filePath);
    img.resize(8, 8).grayscale();
    const pixels = [];
    let sum = 0;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const v = Jimp.intToRGBA(img.getPixelColor(x, y)).r;
            pixels.push(v);
            sum += v;
        }
    }
    const avg = sum / 64;
    let bits = 0n;
    for (let i = 0; i < 64; i++) {
        if (pixels[i] >= avg) bits |= 1n << BigInt(63 - i);
    }
    return bits;
}

async function verifyMatch(idPhotoPath, livePhotoPath) {
    if (!idPhotoPath) return { result: "NO_MATCH", distance: null };
    const h1 = await ahash64(idPhotoPath);
    const h2 = await ahash64(livePhotoPath);
    const d = hamming(h1, h2);
    const result = d <= 10 ? "MATCH" : "NO_MATCH";
    return { result, distance: d };
}

module.exports = { verifyMatch };
