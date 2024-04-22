import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

function random(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export function randomItemWithSeed(array, seed) {
    if (array.length === 0) {
        return null;
    }

    let newSeed = seed;
    const newArray = [...array];

    let m = newArray.length;
    let t;
    let i;

    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(random(newSeed) * m);
        m -= 1;

        // And swap it with the current element.
        t = newArray[m];
        newArray[m] = newArray[i];
        newArray[i] = t;
        newSeed += 1;
    }

    return newArray[0];
}
