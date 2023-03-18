const canvas = document.getElementById("canvas")
const gl = canvas.getContext("webgl")

const objects = []
let selectedIdx = 0
let isClicked = false