const canvas = document.querySelector("canvas")

if (!navigator.gpu) throw new Error("This Browser doesnt support WebGPU yet!")

const adapter = await navigator.gpu.requestAdapter()
if (!adapter) throw new Error("No appropriate GPUAdapter found.")

const device = await adapter.requestDevice()

const context = canvas.getContext("webgpu")
const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
context.configure({
    device: device,
    format: canvasFormat,
})

const mapVertices = new Float32Array([
    // x, y
    -0.5,  0.5,
     0.5,  0.5,
    -0.5, -0.5,

     0.5,  0.5,
    -0.5,  0.5,
    -0.5, -0.5,
])

const encoder = device.createCommandEncoder()

const pass = encoder.beginRenderPass({
    colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        loadOp: "clear",
        clearValue: { r: 0, g: 0, b: 0.4, a: 1 },
        storeOp: "store",
    }]
})
pass.end()

const vertexBuffer = device.createBuffer({
    label: "Cell vertices",
    size: mapVertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
})

device.queue.writeBuffer(vertexBuffer, 0, mapVertices)

device.queue.submit([encoder.finish()])
