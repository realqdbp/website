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

const GRID_SIZE = 8

const mapVertices = new Float32Array([
    // x, y
    -0.8, -0.8, // Triangle 1
    0.8, -0.8,
    0.8,  0.8,

    -0.8, -0.8, // Triangle 2
    0.8,  0.8,
    -0.8,  0.8,
])

const vertexBuffer = device.createBuffer({
    label: "Cell vertices",
    size: mapVertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
})
device.queue.writeBuffer(vertexBuffer, 0, mapVertices)

const cellShader = device.createShaderModule({
    label: "Cell Shader",
    code: `
        
        @vertex
        fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
            return vec4f(pos, 0, 1);
        }
        
        @fragment
        fn fragmentMain() -> @location(0) vec4f {
            return vec4f(1, 0, 0, 1);
        }
    `,
})

const vertexBufferLayout = {
    arrayStride: 8,
    attributes: [{
        format: "float32x2",
        offset: 0,
        shaderLocation: 0,
    }],
}

const renderPipeline = device.createRenderPipeline({
    label: "Render Pipeline",
    layout: "auto",
    vertex: {
        module: cellShader,
        entryPoint: "vertexMain",
        buffers: [vertexBufferLayout]
    },
    fragment: {
        module: cellShader,
        entryPoint: "fragmentMain",
        targets: [{
            format: canvasFormat
        }]
    },
})




const encoder = device.createCommandEncoder()

const pass = encoder.beginRenderPass({
    colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        loadOp: "clear",
        clearValue: { r: 0, g: 0, b: 0.4, a: 1 },
        storeOp: "store",
    }]
})

pass.setPipeline(renderPipeline)
pass.setVertexBuffer(0, vertexBuffer)
pass.draw(mapVertices.length / 2)
pass.end()

device.queue.submit([encoder.finish()])
