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

function get_projection(angle, a, zMin, zMax) {
    var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
    return [
       0.5/ang, 0 , 0, 0,
       0, 0.5*a/ang, 0, 0,
       0, 0, -(zMax+zMin)/(zMax-zMin), -1,
       0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 
    ];
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