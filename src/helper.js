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

function convertPoint(rect, point) {
    if(!point.hasOwnProperty("x")) {
        throw new Error("Point passed lacks the key for x")
    }
    if(!point.hasOwnProperty("y")) {
        throw new Error("Point passed lacks the key for y")
    }
    const result = {
        x: 0,
        y: 0
    }

    result.x = point.x - (rect.width / 2)
    result.y = point.y - (rect.height / 2)

    result.x = result.x / (rect.width / 2)
    result.y = result.y / (rect.height / 2)
    result.y = (-1) * result.y

    return result
}

function substractPoint(point, pos) {
    const newPoint = {
        x: point.x - pos.x,
        y: point.y - pos.y
    }

    console.log(newPoint)
    return newPoint
}

function movePoint(point, pos) {
    const temp = point

    const newPoint = {
        x: temp.x + pos.x,
        y: temp.y + pos.y,
        z: temp.z
    }

    return newPoint
}