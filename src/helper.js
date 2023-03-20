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