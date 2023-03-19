const calculateMidpoint = (points) => {
    const midpoint = {
        x: 0,
        y: 0,
        z: 0
    }

    for(let i = 0; i < points.length; ++i) {
        midpoint.x += points[i].x
        midpoint.y += points[i].y
        midpoint.z += points[i].z
    }

    midpoint.x /= points.length
    midpoint.y /= points.length
    midpoint.z /= points.length

    return midpoint
}

/**
 * Didapat dari Chapter 5: Viewing buku Interactive Computer Graphics
 */
function getPerspectiveProjection(fovy, aspect, near, far) {
    const top = near * Math.tan(fovy * Math.PI / 180);
    const right = top * aspect;

    return [
       near / right, 0 , 0, 0,
       0, near / top, 0, 0,
       0, 0, -(far+near) / (far-near), -2*far*near / (far-near),
       0, 0, -1, 0 
    ];
}

/**
 * Didapat dari Chapter 5: Viewing buku Interactive Computer Graphics
 */
function getOrthogonalProjection(left, right, bottom, top, near, far) {
    return [
        2 / (right-left), 0, 0, - (left+right) / (right-left),
        0, 2 / (top - bottom), 0, - (top+bottom) / (top-bottom),
        0, 0, - 2 / (far-near), - (far+near) / (far-near),
        0, 0, 0, 1
    ]
}

/**
 * Didapat dari Chapter 5: Viewing buku Interactive Computer Graphics
 */
function getObliqueProjection(theta, psi, xmin, xmax, ymin, ymax, near, far) {
    const cotTheta = 1 / Math.tan(theta * Math.PI / 180);
    const cotPsi = 1 / Math.tan(psi * Math.PI / 180);

    const left = xmin - near*cotTheta;
    const right = xmax - near*cotTheta;
    const top = ymax - near*cotPsi;
    const bottom = ymin - near*cotPsi;

    let H = [
        1, 0, cotTheta, 0,
        0, 1, cotPsi, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    let orth = getOrthogonalProjection(left, right, bottom, top, near, far);

    return matrixMultiplication(orth, H);
}


function rotatePoint(point, angle, anchor, type) {
    angle = angle * Math.PI / 180
    const temp = point
    const s = Math.sin(angle)
    const c = Math.cos(angle)

    const newPoint = {
        x: temp.x - anchor.x,
        y: temp.y - anchor.y,
        z: temp.z - anchor.z
    }

    let rotatedPoint = {}
    if (type === 'x') {
        rotatedPoint = {
            x: newPoint.x,
            y: newPoint.y * c - newPoint.z * s,
            z: newPoint.z * c + newPoint.y * s
        }
    } else if (type === 'y') {
        rotatedPoint = {
            x: newPoint.x * c + newPoint.z * s,
            y: newPoint.y,
            z: newPoint.z * c - newPoint.x * s,
        }
    } else if (type === 'z') {
        rotatedPoint = {
            x: newPoint.x * c - newPoint.y * s,
            y: newPoint.y * c + newPoint.x * s,
            z: newPoint.z
        }
    }

    rotatedPoint.x += anchor.x
    rotatedPoint.y += anchor.y
    rotatedPoint.z += anchor.z

    return rotatedPoint
}

function movePoint(point, distance, type) {
    const temp = point

    const newPoint = {
        x: temp.x,
        y: temp.y,
        z: temp.z
    }

    let movedPoint = {}
    if (type === 'x') {
        movedPoint = {
            x: newPoint.x + distance,
            y: newPoint.y,
            z: newPoint.z
        }
    } else if (type === 'y') {
        movedPoint = {
            x: newPoint.x,
            y: newPoint.y + distance,
            z: newPoint.z
        }
    } else if (type === 'z') {
        movedPoint = {
            x: newPoint.x,
            y: newPoint.y,
            z: newPoint.z + distance
        }
    }

    return movedPoint
}

function scalePoint(point, k) {
    const temp = point

    const newPoint = {
        x: temp.x * k,
        y: temp.y * k,
        z: temp.z * k
    }

    return newPoint
}

function matrixMultiplication(A, B) {
    let result = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                sum += A[i*4+k] * B[k*4+j];
            }
            result.push(sum);
        }
    }
    return result;
}