
export function range(...e) {
    let start = 0, stop, step = 1
    if (e.length == 1) stop = e[0]
    if (e.length >= 2) {
        start = e[0]
        stop = e[1]
    }
    if (e.length == 3) {
        step = e[3]
    }
    var a = [start], b = start;
    while (b < stop) {
        a.push(b += step || 1);
    }
    return a;
}

export const wait = ms => () => new Promise(resolve => setTimeout(resolve, ms));
