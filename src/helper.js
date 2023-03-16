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

function resetRotatePoint(point, angle, anchor, type) {
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
            y: newPoint.y * c + newPoint.z * s,
            z: newPoint.z * c - newPoint.y * s
        }
    } else if (type === 'y') {
        rotatedPoint = {
            x: newPoint.x * c + newPoint.z * s,
            y: newPoint.y,
            z: newPoint.z * c - newPoint.x * s,
        }
    } else if (type === 'z') {
        rotatedPoint = {
            x: newPoint.x * c + newPoint.y * s,
            y: newPoint.y * c - newPoint.x * s,
            z: newPoint.z
        }
    }

    rotatedPoint.x += anchor.x
    rotatedPoint.y += anchor.y
    rotatedPoint.z += anchor.z

    return rotatedPoint
}

function rotatePoint(point, angle, anchor, type) {
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
            z: newPoint.y * s + newPoint.z * c
        }
    } else if (type === 'y') {
        rotatedPoint = {
            x: newPoint.x * c - newPoint.z * s,
            y: newPoint.y,
            z: newPoint.x * s + newPoint.z * c,
        }
    } else if (type === 'z') {
        rotatedPoint = {
            x: newPoint.x * c - newPoint.y * s,
            y: newPoint.x * s + newPoint.y * c,
            z: newPoint.z
        }
    }

    rotatedPoint.x += anchor.x
    rotatedPoint.y += anchor.y
    rotatedPoint.z += anchor.z

    return rotatedPoint
}