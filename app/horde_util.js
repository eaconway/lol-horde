export const dir = (vec) => {
    const norm = norm(vec);
    return scale(vec, 1 / norm);
}

export const dist = (pos1, pos2) => {
    return Math.sqrt(
        Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
}

export const norm = (vec) => {
    return dist([0, 0], vec);
}

export const randomVec = (length) => {
    const deg = 2 * Math.PI * Math.random();
    return scale([Math.sin(deg), Math.cos(deg)], length);
}

export const scale = (vec, m) => {
    return [vec[0] * m, vec[1] * m];
}

export const wrap = (coord, max) => {
    if (coord < 0) {
        return max - (coord % max);
    } else if (coord > max) {
        return coord % max;
    } else {
        return coord;
    }
}
