;(function () {
  const doc = document
  const header = doc.querySelector('.site-header')
  if (!header || doc.querySelector('.rpg-runner')) return

  const wrapper = doc.createElement('section')
  wrapper.className = 'rpg-runner'
  const inner = doc.createElement('div')
  inner.className = 'rpg-runner-inner'
  const canvas = doc.createElement('canvas')
  canvas.className = 'rpg-runner-canvas'
  inner.appendChild(canvas)
  wrapper.appendChild(inner)
  header.insertAdjacentElement('afterend', wrapper)

  const style = doc.createElement('style')
  style.textContent = `
.rpg-runner {
  background: #0b1220;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}
.rpg-runner-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 12px 16px;
}
.rpg-runner-canvas {
  width: 100%;
  height: 200px;
  display: block;
  border-radius: 18px;
  background: radial-gradient(circle at 20% 20%, #1f2a44 0%, #0b1220 60%);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.7);
}
@media (max-width: 720px) {
  .rpg-runner-canvas {
    height: 170px;
  }
}
`
  doc.head.appendChild(style)

  const ctx = canvas.getContext('2d')
  let width = 0
  let height = 0
  let dpr = Math.min(2, window.devicePixelRatio || 1)
  let lastTime = 0

  function resize() {
    const rect = canvas.getBoundingClientRect()
    width = rect.width
    height = rect.height
    dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.max(1, Math.round(width * dpr))
    canvas.height = Math.max(1, Math.round(height * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = false
  }

  window.addEventListener('resize', resize)
  resize()

  const palette = {
    skin: '#ffe0bd', // Lighter, warmer skin tone
    hair: '#8d5524', // Medium brown
    hairHighlight: '#c68642', // Lighter brown for highlights
    coat: '#a93b3b', // Red/Maroon jacket
    coatDark: '#7a2222', // Darker red for shadows
    shirt: '#4d6948', // Green shirt
    pants: '#3e3546', // Dark grey/brown pants
    boot: '#5d4037', // Dark brown boots
    gloves: '#6d4c41', // Brown gloves
    belt: '#3e2723', // Dark leather belt
    metal: '#b0c3d9', // Silver/Blueish metal
    dark: '#0f172a',
    gold: '#fbbf24',
    wood: '#a16207',
    screen: '#60a5fa',
    desk: '#475569',
    stone: '#94a3b8',
    glow: '#fde68a',
    coal: '#0b1220',
    ruby: '#fb7185',
    emerald: '#4ade80',
    crystal: '#93c5fd',
    iron: '#a1a1aa', // Light grey for iron
    ironDark: '#52525b', // Dark grey for iron shadow
    obsidian: '#4c1d95', // Deep purple/black for obsidian
    obsidianDark: '#2e1065',
    kobalt: '#2563eb', // Vivid blue for cobalt
    kobaltDark: '#1e3a8a',
    outline: '#1a1016', // Darker, warmer outline
    highlight: '#ffffff',
  }

  const basePixels = [
    [3, 0, 'outline'],
    [4, 0, 'hair'],
    [5, 0, 'hair'],
    [6, 0, 'hair'],
    [7, 0, 'outline'],
    [2, 1, 'outline'],
    [3, 1, 'hair'],
    [4, 1, 'skin'],
    [5, 1, 'skin'],
    [6, 1, 'skin'],
    [7, 1, 'hair'],
    [8, 1, 'outline'],
    [2, 2, 'outline'],
    [3, 2, 'skin'],
    [4, 2, 'dark'],
    [5, 2, 'dark'],
    [6, 2, 'skin'],
    [7, 2, 'outline'],
    [3, 3, 'outline'],
    [4, 3, 'skin'],
    [5, 3, 'skin'],
    [6, 3, 'outline'],
    [2, 4, 'outline'],
    [3, 4, 'cloak'],
    [4, 4, 'armor'],
    [5, 4, 'armor'],
    [6, 4, 'armor'],
    [7, 4, 'cloak'],
    [8, 4, 'outline'],
    [2, 5, 'outline'],
    [3, 5, 'cloak'],
    [4, 5, 'armor'],
    [5, 5, 'armor'],
    [6, 5, 'armor'],
    [7, 5, 'cloak'],
    [8, 5, 'outline'],
    [1, 6, 'outline'],
    [2, 6, 'cloak'],
    [3, 6, 'armor'],
    [4, 6, 'belt'],
    [5, 6, 'armor'],
    [6, 6, 'armor'],
    [7, 6, 'cloak'],
    [8, 6, 'outline'],
    [2, 7, 'outline'],
    [3, 7, 'cloak'],
    [4, 7, 'belt'],
    [5, 7, 'belt'],
    [6, 7, 'cloak'],
    [7, 7, 'outline'],
    [9, 4, 'metal'],
    [10, 4, 'outline'],
    [9, 5, 'metal'],
    [9, 6, 'metal'],
  ]

  const legsFrames = [
    [
      [2, 8, 'outline'],
      [3, 8, 'pants'],
      [4, 8, 'pants'],
      [5, 8, 'pants'],
      [6, 8, 'pants'],
      [7, 8, 'outline'],
      [3, 9, 'pants'],
      [6, 9, 'pants'],
      [2, 10, 'outline'],
      [3, 10, 'boot'],
      [6, 10, 'boot'],
      [7, 10, 'outline'],
      [3, 11, 'boot'],
      [6, 11, 'boot'],
    ],
    [
      [2, 8, 'outline'],
      [3, 8, 'pants'],
      [4, 8, 'pants'],
      [5, 8, 'pants'],
      [6, 8, 'pants'],
      [7, 8, 'outline'],
      [4, 9, 'pants'],
      [5, 9, 'pants'],
      [3, 10, 'outline'],
      [4, 10, 'boot'],
      [5, 10, 'boot'],
      [6, 10, 'outline'],
      [4, 11, 'boot'],
      [5, 11, 'boot'],
    ],
  ]

  const seatedLegs = [
    [2, 8, 'outline'],
    [3, 8, 'pants'],
    [4, 8, 'pants'],
    [5, 8, 'pants'],
    [6, 8, 'pants'],
    [7, 8, 'outline'],
    [3, 9, 'pants'],
    [4, 9, 'pants'],
    [5, 9, 'pants'],
    [6, 9, 'pants'],
    [2, 10, 'outline'],
    [3, 10, 'boot'],
    [4, 10, 'boot'],
    [5, 10, 'boot'],
    [1, 11, 'outline'],
    [2, 11, 'boot'],
  ]

  const codingArms = [
    [
      [1, 5, 'outline'],
      [2, 5, 'armor'],
      [2, 6, 'armor'],
      [2, 7, 'armor'],
      [7, 5, 'armor'],
      [7, 6, 'armor'],
      [7, 7, 'armor'],
      [8, 5, 'outline'],
    ],
    [
      [1, 5, 'outline'],
      [2, 5, 'armor'],
      [3, 6, 'armor'],
      [4, 7, 'armor'],
      [7, 5, 'armor'],
      [6, 6, 'armor'],
      [5, 7, 'armor'],
      [8, 5, 'outline'],
    ],
  ]

  const pickaxeFrames = [
    [
      [8, 2, 'wood'],
      [9, 1, 'wood'],
      [9, 2, 'metal'],
      [10, 1, 'metal'],
      [10, 2, 'metal'],
    ],
    [
      [7, 2, 'wood'],
      [8, 1, 'wood'],
      [9, 0, 'metal'],
      [9, 1, 'metal'],
      [10, 0, 'metal'],
    ],
  ]

  const oreTypes = [
    { id: 'iron' },
    { id: 'obsidian' },
    { id: 'kobalt' },
    { id: 'gold' },
    { id: 'emerald' },
  ]

  const sparks = []
  const ores = []
  let minedCount = 0
  let spawnedCount = 0
  let state = 'mining'
  let stateTime = 0
  let spawnTimer = 0

  let runnerPos = { x: 0, y: 0 }
  let mousePos = { x: 0, y: 0 }
  let facingRight = true

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    mousePos.x = e.clientX - rect.left
    mousePos.y = e.clientY - rect.top
  })

  const clouds = new Array(6).fill(0).map(() => ({
    x: Math.random() * width,
    y: 10 + Math.random() * 50,
    r: 10 + Math.random() * 18,
    s: 0.08 + Math.random() * 0.16,
  }))

  function drawCloud(cloud) {
    ctx.save()
    ctx.globalAlpha = 0.25
    
    // Main cloud body with soft edges
    const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.r * 2)
    gradient.addColorStop(0, 'rgba(148, 163, 184, 0.4)')
    gradient.addColorStop(0.7, 'rgba(148, 163, 184, 0.2)')
    gradient.addColorStop(1, 'rgba(148, 163, 184, 0)')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    
    // Multiple overlapping circles for fluffy cloud effect
    const circles = [
      { x: 0, y: 0, r: cloud.r },
      { x: cloud.r * 0.8, y: -cloud.r * 0.1, r: cloud.r * 0.9 },
      { x: -cloud.r * 0.6, y: -cloud.r * 0.2, r: cloud.r * 0.7 },
      { x: cloud.r * 0.3, y: cloud.r * 0.4, r: cloud.r * 0.6 },
      { x: -cloud.r * 0.4, y: cloud.r * 0.3, r: cloud.r * 0.5 },
      { x: cloud.r * 1.2, y: cloud.r * 0.1, r: cloud.r * 0.4 },
    ]
    
    circles.forEach((circle, index) => {
      if (index === 0) {
        ctx.arc(cloud.x + circle.x, cloud.y + circle.y, circle.r, 0, Math.PI * 2)
      } else {
        ctx.arc(cloud.x + circle.x, cloud.y + circle.y, circle.r, 0, Math.PI * 2)
      }
    })
    
    ctx.fill()
    
    // Add some inner detail
    ctx.globalAlpha = 0.15
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.beginPath()
    ctx.arc(cloud.x - cloud.r * 0.2, cloud.y - cloud.r * 0.1, cloud.r * 0.3, 0, Math.PI * 2)
    ctx.arc(cloud.x + cloud.r * 0.4, cloud.y - cloud.r * 0.2, cloud.r * 0.2, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }

  function getMetrics() {
    const groundY = height * 0.76
    const scale = Math.max(4, Math.round(height / 20))
    return { groundY, scale }
  }

  function drawPixels(px, py, scale, pixels) {
    pixels.forEach(([x, y, colorKey]) => {
      ctx.fillStyle = palette[colorKey]
      ctx.fillRect(px + x * scale, py + y * scale, scale, scale)
    })
  }

  function drawRoundedRect(x, y, w, h, r, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
    ctx.fill()
  }

  function drawCharacterHead(px, py, scale) {
    const centerX = px + scale * 5.5
    const centerY = py + scale * 1.5
    const radius = scale * 2.4 // Increased from 1.8 for Chibi look
    
    // Head outline
    ctx.fillStyle = palette.outline
    drawRoundedRect(centerX - radius - scale * 0.2, centerY - radius - scale * 0.2, (radius * 2) + scale * 0.4, (radius * 2) + scale * 0.4, scale * 1.0, palette.outline)
    
    // Face shape
    ctx.fillStyle = palette.skin
    drawRoundedRect(centerX - radius, centerY - radius, radius * 2, radius * 2, scale * 0.8, palette.skin)
    
    // Hair (Thick, messy brown hair with bangs) - Adjusted for larger head
    ctx.fillStyle = palette.hair
    ctx.beginPath()
    // Top hair volume
    ctx.moveTo(centerX - radius - scale * 0.2, centerY - radius * 0.5)
    ctx.lineTo(centerX - radius - scale * 0.2, centerY - radius - scale * 0.8)
    ctx.lineTo(centerX + radius + scale * 0.2, centerY - radius - scale * 0.8)
    ctx.lineTo(centerX + radius + scale * 0.2, centerY - radius * 0.5)
    // Right side bangs
    ctx.lineTo(centerX + radius + scale * 0.3, centerY + scale * 0.8)
    ctx.lineTo(centerX + radius, centerY + scale * 0.8)
    ctx.lineTo(centerX + radius, centerY - radius * 0.2)
    // Forehead bangs (Jagged)
    ctx.lineTo(centerX + radius * 0.6, centerY + scale * 0.2)
    ctx.lineTo(centerX + radius * 0.2, centerY - scale * 0.2)
    ctx.lineTo(centerX - radius * 0.2, centerY + scale * 0.4)
    ctx.lineTo(centerX - radius * 0.7, centerY - scale * 0.1)
    // Left side
    ctx.lineTo(centerX - radius, centerY + scale * 0.8)
    ctx.lineTo(centerX - radius - scale * 0.3, centerY + scale * 0.8)
    ctx.closePath()
    ctx.fill()
    
    // Hair highlights
    ctx.fillStyle = palette.hairHighlight
    ctx.fillRect(centerX - radius * 0.5, centerY - radius - scale * 0.5, radius, scale * 0.5)
    
    // Eyes (Large, black, chibi style)
    ctx.fillStyle = 'black'
    // Left Eye
    ctx.fillRect(centerX - scale * 1.0, centerY, scale * 0.6, scale * 0.8)
    // Right Eye
    ctx.fillRect(centerX + scale * 0.4, centerY, scale * 0.6, scale * 0.8)
    
    // Blush (Cute RPG element)
    ctx.fillStyle = 'rgba(255, 100, 100, 0.3)'
    ctx.beginPath()
    ctx.arc(centerX - scale * 1.5, centerY + scale * 1.0, scale * 0.4, 0, Math.PI * 2)
    ctx.arc(centerX + scale * 1.5, centerY + scale * 1.0, scale * 0.4, 0, Math.PI * 2)
    ctx.fill()
    
    // Mouth (Small line)
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(centerX - scale * 0.2, centerY + scale * 1.2, scale * 0.4, scale * 0.15)
  }

  function drawCharacterBody(px, py, scale) {
    const bodyWidth = scale * 3.5
    const bodyHeight = scale * 3.5 // Slightly shorter for chibi
    const bodyX = px + scale * 4
    const bodyY = py + scale * 4 // Lower body start
    
    // Backpack (Visible on the left/back)
    ctx.fillStyle = '#854d0e' // Brown leather
    drawRoundedRect(bodyX - scale * 1.5, bodyY + scale * 0.5, scale * 2, bodyHeight * 0.8, scale * 0.4, '#854d0e')
    // Backpack straps
    ctx.fillStyle = '#713f12'
    ctx.fillRect(bodyX, bodyY + scale * 0.5, scale * 0.3, bodyHeight * 0.8)
    
    // Body outline
    drawRoundedRect(bodyX - scale * 0.3, bodyY - scale * 0.3, bodyWidth + scale * 0.6, bodyHeight + scale * 0.6, scale * 0.8, palette.outline)
    
    // Green Shirt (Underlayer)
    drawRoundedRect(bodyX, bodyY, bodyWidth, bodyHeight, scale * 0.5, palette.shirt)
    
    // Red Coat (Open jacket style)
    ctx.fillStyle = palette.coat
    ctx.beginPath()
    // Left side of coat
    ctx.moveTo(bodyX, bodyY)
    ctx.lineTo(bodyX + bodyWidth * 0.35, bodyY)
    ctx.lineTo(bodyX + bodyWidth * 0.35, bodyY + bodyHeight)
    ctx.lineTo(bodyX, bodyY + bodyHeight)
    ctx.lineTo(bodyX, bodyY + scale * 0.5)
    // Right side of coat
    ctx.moveTo(bodyX + bodyWidth, bodyY)
    ctx.lineTo(bodyX + bodyWidth - bodyWidth * 0.35, bodyY)
    ctx.lineTo(bodyX + bodyWidth - bodyWidth * 0.35, bodyY + bodyHeight)
    ctx.lineTo(bodyX + bodyWidth, bodyY + bodyHeight)
    ctx.lineTo(bodyX + bodyWidth, bodyY + scale * 0.5)
    ctx.fill()
    
    // Coat collar/lapels
    ctx.fillStyle = palette.coatDark
    ctx.beginPath()
    ctx.moveTo(bodyX + bodyWidth * 0.35, bodyY)
    ctx.lineTo(bodyX + bodyWidth * 0.2, bodyY + scale * 1.5)
    ctx.lineTo(bodyX + bodyWidth * 0.35, bodyY + scale * 1.5)
    ctx.moveTo(bodyX + bodyWidth - bodyWidth * 0.35, bodyY)
    ctx.lineTo(bodyX + bodyWidth - bodyWidth * 0.2, bodyY + scale * 1.5)
    ctx.lineTo(bodyX + bodyWidth - bodyWidth * 0.35, bodyY + scale * 1.5)
    ctx.fill()
    
    // Belt
    ctx.fillStyle = palette.belt
    ctx.fillRect(bodyX - scale * 0.1, bodyY + bodyHeight - scale * 0.8, bodyWidth + scale * 0.2, scale * 0.8)
    
    // Belt Buckle
    ctx.fillStyle = palette.metal
    ctx.fillRect(bodyX + bodyWidth * 0.5 - scale * 0.4, bodyY + bodyHeight - scale * 0.9, scale * 0.8, scale * 1)
    
    // Belt Pouch
    ctx.fillStyle = '#92400e'
    drawRoundedRect(bodyX + bodyWidth - scale * 0.5, bodyY + bodyHeight - scale * 1.2, scale * 1.2, scale * 1.2, scale * 0.2, '#92400e')
    ctx.fillStyle = palette.metal
    ctx.beginPath()
    ctx.arc(bodyX + bodyWidth + scale * 0.1, bodyY + bodyHeight - scale * 0.6, scale * 0.15, 0, Math.PI * 2)
    ctx.fill()
  }

  function drawCharacterLegs(px, py, scale, frameIndex, isSeated = false) {
    const legWidth = scale * 1.3
    const legHeight = scale * 3
    
    if (isSeated) {
      // Seated legs
      const leftLegX = px + scale * 3
      const rightLegX = px + scale * 5.5
      const legY = py + scale * 7.2 // Adjusted to connect with shorter body
      
      // Left leg
      drawRoundedRect(leftLegX, legY, legWidth, legHeight, scale * 0.3, palette.outline)
      drawRoundedRect(leftLegX + scale * 0.3, legY + scale * 0.3, legWidth - scale * 0.6, legHeight - scale * 0.6, scale * 0.2, palette.pants)
      
      // Right leg
      drawRoundedRect(rightLegX, legY, legWidth, legHeight * 0.8, scale * 0.3, palette.outline)
      drawRoundedRect(rightLegX + scale * 0.3, legY + scale * 0.3, legWidth - scale * 0.6, legHeight * 0.8 - scale * 0.6, scale * 0.2, palette.pants)
    } else {
      // Walking legs
      const leftLegX = px + scale * 3.5 + Math.sin(frameIndex * 0.5) * scale * 0.3
      const rightLegX = px + scale * 5.5 - Math.sin(frameIndex * 0.5) * scale * 0.3
      const leftLegY = py + scale * 7 + Math.cos(frameIndex * 0.5) * scale * 0.2
      const rightLegY = py + scale * 7 - Math.cos(frameIndex * 0.5) * scale * 0.2
      
      // Left leg
      drawRoundedRect(leftLegX, leftLegY, legWidth, legHeight, scale * 0.3, palette.outline)
      drawRoundedRect(leftLegX + scale * 0.3, leftLegY + scale * 0.3, legWidth - scale * 0.6, legHeight - scale * 0.6, scale * 0.2, palette.pants)
      
      // Right leg
      drawRoundedRect(rightLegX, rightLegY, legWidth, legHeight, scale * 0.3, palette.outline)
      drawRoundedRect(rightLegX + scale * 0.3, rightLegY + scale * 0.3, legWidth - scale * 0.6, legHeight - scale * 0.6, scale * 0.2, palette.pants)
    }
  }

  function drawCharacterBoots(px, py, scale, frameIndex, isSeated = false) {
    const bootWidth = scale * 1.6
    const bootHeight = scale * 1.4
    
    if (isSeated) {
      // Seated boots
      const leftBootX = px + scale * 2.5
      const rightBootX = px + scale * 5
      const bootY = py + scale * 10.5
      
      drawRoundedRect(leftBootX, bootY, bootWidth, bootHeight, scale * 0.4, palette.outline)
      drawRoundedRect(leftBootX + scale * 0.3, bootY + scale * 0.3, bootWidth - scale * 0.6, bootHeight - scale * 0.6, scale * 0.2, palette.boot)
      
      drawRoundedRect(rightBootX, bootY, bootWidth * 0.8, bootHeight, scale * 0.4, palette.outline)
      drawRoundedRect(rightBootX + scale * 0.3, bootY + scale * 0.3, bootWidth * 0.8 - scale * 0.6, bootHeight - scale * 0.6, scale * 0.2, palette.boot)
    } else {
      // Walking boots
      const leftBootX = px + scale * 3.4 + Math.sin(frameIndex * 0.5) * scale * 0.3
      const rightBootX = px + scale * 5.4 - Math.sin(frameIndex * 0.5) * scale * 0.3
      const leftBootY = py + scale * 9.8 + Math.cos(frameIndex * 0.5) * scale * 0.2
      const rightBootY = py + scale * 9.8 - Math.cos(frameIndex * 0.5) * scale * 0.2
      
      drawRoundedRect(leftBootX, leftBootY, bootWidth, bootHeight, scale * 0.4, palette.outline)
      drawRoundedRect(leftBootX + scale * 0.3, leftBootY + scale * 0.3, bootWidth - scale * 0.6, bootHeight - scale * 0.6, scale * 0.2, palette.boot)
      
      drawRoundedRect(rightBootX, rightBootY, bootWidth, bootHeight, scale * 0.4, palette.outline)
      drawRoundedRect(rightBootX + scale * 0.3, rightBootY + scale * 0.3, bootWidth - scale * 0.6, bootHeight - scale * 0.6, scale * 0.2, palette.boot)
    }
  }

  function drawOre(x, y, scale, ore) {
    const oreScale = Math.round(scale * 1.2)
    const type = ore.type
    // Fallback points if not present (shouldn't happen with new spawn logic)
    const points = ore.points || [
      {x: -1, y: -1}, {x: 1, y: -1}, {x: 1, y: 1}, {x: -1, y: 1}
    ]
    
    ctx.save()
    ctx.translate(x + oreScale * 1.5, y + oreScale * 1.5)
    
    // Main Brute Shape
    const mainColor = palette[type.id] || palette.stone
    const darkColor = palette[type.id + 'Dark'] || palette.stone
    
    // Draw outline
    ctx.fillStyle = palette.outline
    ctx.beginPath()
    points.forEach((p, i) => {
        const px = p.x * oreScale * 1.2
        const py = p.y * oreScale * 1.2
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
    })
    ctx.closePath()
    ctx.fill()
    
    // Draw main body
    ctx.fillStyle = mainColor
    ctx.beginPath()
    points.forEach((p, i) => {
        const px = p.x * oreScale
        const py = p.y * oreScale
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
    })
    ctx.closePath()
    ctx.fill()
    
    // Add "facets" or rough texture (Jagged shadows)
    ctx.fillStyle = darkColor
    ctx.beginPath()
    points.forEach((p, i) => {
        if (i % 2 === 0) { 
             ctx.moveTo(0, 0)
             ctx.lineTo(points[i].x * oreScale, points[i].y * oreScale)
             const next = points[(i+1)%points.length]
             ctx.lineTo(next.x * oreScale, next.y * oreScale)
        }
    })
    ctx.fill()
    
    // Highlights (Brute/Raw look - scattered jagged spots)
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.beginPath()
    ctx.moveTo(-oreScale * 0.3, -oreScale * 0.3)
    ctx.lineTo(-oreScale * 0.1, -oreScale * 0.5)
    ctx.lineTo(oreScale * 0.1, -oreScale * 0.3)
    ctx.fill()
    
    ctx.restore()
  }

  function drawPickaxe(px, py, scale, frameIndex) {
    const handleLength = scale * 4
    const handleWidth = scale * 0.4
    const bladeWidth = scale * 2.5
    const bladeHeight = scale * 2
    
    ctx.save()
    ctx.translate(px, py)
    
    // Handle rotation based on frame
    const angle = frameIndex === 0 ? -0.3 : 0.5
    ctx.rotate(angle)
    
    // Handle outline
    ctx.fillStyle = palette.outline
    ctx.fillRect(-handleWidth * 0.5, 0, handleWidth, handleLength)
    
    // Handle wood grain
    ctx.fillStyle = palette.wood
    ctx.fillRect(-handleWidth * 0.3, scale * 0.2, handleWidth * 0.6, handleLength - scale * 0.4)
    
    // Wood texture lines
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'
    ctx.lineWidth = scale * 0.05
    ctx.beginPath()
    for (let i = 0; i < 3; i++) {
      ctx.moveTo(-handleWidth * 0.2, scale * 0.5 + i * scale * 1.2)
      ctx.lineTo(handleWidth * 0.2, scale * 0.5 + i * scale * 1.2)
    }
    ctx.stroke()
    
    // Pickaxe blade
    ctx.fillStyle = palette.outline
    ctx.beginPath()
    ctx.moveTo(-bladeWidth * 0.5, -scale * 0.2)
    ctx.lineTo(bladeWidth * 0.5, -scale * 0.2)
    ctx.lineTo(bladeWidth * 0.3, -bladeHeight)
    ctx.lineTo(-bladeWidth * 0.3, -bladeHeight)
    ctx.closePath()
    ctx.fill()
    
    // Blade metal
    ctx.fillStyle = palette.metal
    ctx.beginPath()
    ctx.moveTo(-bladeWidth * 0.3, 0)
    ctx.lineTo(bladeWidth * 0.3, 0)
    ctx.lineTo(bladeWidth * 0.2, -bladeHeight + scale * 0.2)
    ctx.lineTo(-bladeWidth * 0.2, -bladeHeight + scale * 0.2)
    ctx.closePath()
    ctx.fill()
    
    // Blade highlight
    ctx.fillStyle = palette.highlight
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    ctx.moveTo(-bladeWidth * 0.1, -scale * 0.1)
    ctx.lineTo(bladeWidth * 0.1, -scale * 0.1)
    ctx.lineTo(bladeWidth * 0.05, -bladeHeight + scale * 0.4)
    ctx.lineTo(-bladeWidth * 0.05, -bladeHeight + scale * 0.4)
    ctx.closePath()
    ctx.fill()
    
    ctx.restore()
  }

  function drawRunner(t, currentState) {
    const { groundY, scale } = getMetrics()
    const frameIndex = Math.floor(t * 10) % legsFrames.length
    
    const spriteHeight = 10.5 * scale 
    const spriteWidth = 11 * scale
    
    // Determine position and bob based on state
    let x, y, bob
    if (currentState === 'following') {
        bob = Math.sin(t * 12) * scale * 0.15
        x = runnerPos.x
        y = runnerPos.y + bob
    } else {
        bob = currentState === 'mining' ? Math.sin(t * 6) * scale * 0.25 : Math.sin(t * 10) * scale * 0.1
        x = width * 0.18
        const baseY = groundY - spriteHeight - scale * 0.2
        y = currentState === 'coding' ? baseY + scale * 1.2 + bob : baseY + bob
        
        // Keep runnerPos synced for smooth transition
        runnerPos.x = x
        runnerPos.y = baseY
    }

    ctx.save()
    
    // Flip character if facing left
    if (currentState === 'following' && !facingRight) {
       const centerX = x + spriteWidth * 0.5
       const centerY = y + spriteHeight * 0.5
       ctx.translate(centerX, centerY)
       ctx.scale(-1, 1)
       ctx.translate(-centerX, -centerY)
    }

    // Draw detailed character instead of pixel blocks
    drawCharacterHead(x, y, scale)
    drawCharacterBody(x, y, scale)
    
    if (currentState === 'coding') {
      drawCharacterLegs(x, y, scale, frameIndex, true)
      drawCharacterBoots(x, y, scale, frameIndex, true)
      
      // Coding arms animation
      const armFrame = Math.floor(t * 8) % 2
      const armBob = Math.sin(t * 4) * scale * 0.1
      
      // Left arm typing
      ctx.fillStyle = palette.outline
      ctx.beginPath()
      ctx.ellipse(x + scale * 2.5, y + scale * 5.5 + armBob, scale * 0.7, scale * 1.3, -0.3, 0, Math.PI * 2)
      ctx.fill()
      
      // Sleeve
      ctx.fillStyle = palette.coat
      ctx.beginPath()
      ctx.ellipse(x + scale * 2.5, y + scale * 5 + armBob, scale * 0.5, scale * 0.8, -0.3, 0, Math.PI * 2)
      ctx.fill()
      
      // Glove
      ctx.fillStyle = palette.gloves
      ctx.beginPath()
      ctx.ellipse(x + scale * 2.5, y + scale * 6 + armBob, scale * 0.5, scale * 0.6, -0.3, 0, Math.PI * 2)
      ctx.fill()
      
      // Right arm typing
      ctx.fillStyle = palette.outline
      ctx.beginPath()
      ctx.ellipse(x + scale * 7.5, y + scale * 5.8 - armBob, scale * 0.7, scale * 1.3, 0.3, 0, Math.PI * 2)
      ctx.fill()
      
      // Sleeve
      ctx.fillStyle = palette.coat
      ctx.beginPath()
      ctx.ellipse(x + scale * 7.5, y + scale * 5.3 - armBob, scale * 0.5, scale * 0.8, 0.3, 0, Math.PI * 2)
      ctx.fill()
      
      // Glove
      ctx.fillStyle = palette.gloves
      ctx.beginPath()
      ctx.ellipse(x + scale * 7.5, y + scale * 6.3 - armBob, scale * 0.5, scale * 0.6, 0.3, 0, Math.PI * 2)
      ctx.fill()
    } else {
      drawCharacterLegs(x, y, scale, frameIndex, false)
      drawCharacterBoots(x, y, scale, frameIndex, false)
      
      if (currentState === 'mining') {
        // Draw detailed pickaxe
        const pickFrame = Math.floor(t * 6) % 2
        const pickX = x + scale * 8 + Math.sin(t * 6) * scale * 0.5
        const pickY = y + scale * 3 + Math.cos(t * 6) * scale * 0.3
        drawPickaxe(pickX, pickY, scale, pickFrame)
        
        // Mining arm
        ctx.fillStyle = palette.outline
        ctx.beginPath()
        ctx.ellipse(x + scale * 8, y + scale * 4, scale * 0.9, scale * 1.6, 0.5, 0, Math.PI * 2)
        ctx.fill()
        
        // Sleeve
        ctx.fillStyle = palette.coat
        ctx.beginPath()
        ctx.ellipse(x + scale * 8, y + scale * 3.6, scale * 0.6, scale * 0.9, 0.5, 0, Math.PI * 2)
        ctx.fill()
        
        // Glove
        ctx.fillStyle = palette.gloves
        ctx.beginPath()
        ctx.ellipse(x + scale * 8, y + scale * 4.4, scale * 0.6, scale * 0.7, 0.5, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Walking arms (idle at sides)
        const armSwing = Math.sin(t * 10) * scale * 0.5
        
        // Left arm
        ctx.fillStyle = palette.outline
        ctx.beginPath()
        ctx.ellipse(x + scale * 3.5, y + scale * 4.5 + armSwing, scale * 0.7, scale * 1.5, 0.1, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = palette.coat
        ctx.beginPath()
        ctx.ellipse(x + scale * 3.5, y + scale * 4.2 + armSwing, scale * 0.5, scale * 0.8, 0.1, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = palette.gloves
        ctx.beginPath()
        ctx.ellipse(x + scale * 3.5, y + scale * 5.2 + armSwing, scale * 0.5, scale * 0.6, 0.1, 0, Math.PI * 2)
        ctx.fill()
        
        // Right arm
        ctx.fillStyle = palette.outline
        ctx.beginPath()
        ctx.ellipse(x + scale * 7.5, y + scale * 4.5 - armSwing, scale * 0.7, scale * 1.5, -0.1, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = palette.coat
        ctx.beginPath()
        ctx.ellipse(x + scale * 7.5, y + scale * 4.2 - armSwing, scale * 0.5, scale * 0.8, -0.1, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = palette.gloves
        ctx.beginPath()
        ctx.ellipse(x + scale * 7.5, y + scale * 5.2 - armSwing, scale * 0.5, scale * 0.6, -0.1, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    ctx.restore()

    // Enhanced shadow
    const shadowY = currentState === 'following' ? runnerPos.y + spriteHeight + scale * 0.4 : groundY + scale * 0.4
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)'
    ctx.beginPath()
    ctx.ellipse(
      x + spriteWidth * 0.5,
      shadowY,
      spriteWidth * 0.45,
      scale * 0.6,
      0,
      0,
      Math.PI * 2
    )
    ctx.fill()
  }

  function drawComputer(x, y, scale, phase, t) {
    const deskHeight = scale * 2.4
    
    if (phase > 0.2) {
      // Desk with rounded edges
      drawRoundedRect(x - scale * 0.3, y + scale * 4 - scale * 0.3, scale * 9, deskHeight + scale * 0.6, scale * 0.5, palette.outline)
      drawRoundedRect(x, y + scale * 4, scale * 8, deskHeight, scale * 0.3, palette.desk)
      
      // Desk legs
      ctx.fillStyle = palette.outline
      ctx.fillRect(x + scale * 0.5, y + scale * 6, scale * 0.8, scale * 2)
      ctx.fillRect(x + scale * 6.7, y + scale * 6, scale * 0.8, scale * 2)
      
      // Wood grain on desk
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'
      ctx.lineWidth = scale * 0.1
      ctx.beginPath()
      ctx.moveTo(x + scale * 1, y + scale * 4.5)
      ctx.lineTo(x + scale * 7, y + scale * 4.5)
      ctx.moveTo(x + scale * 1.5, y + scale * 5.5)
      ctx.lineTo(x + scale * 6.5, y + scale * 5.5)
      ctx.stroke()
    }
    
    if (phase > 0.45) {
      // Monitor base
      drawRoundedRect(x + scale * 1.2, y + scale * 0.7, scale * 5.8, scale * 3.7, scale * 0.4, palette.outline)
      drawRoundedRect(x + scale * 1.5, y + scale * 1, scale * 5, scale * 3, scale * 0.3, palette.metal)
      
      // Screen
      drawRoundedRect(x + scale * 2, y + scale * 1.5, scale * 4, scale * 2, scale * 0.2, palette.screen)
      
      // Screen bezel
      ctx.fillStyle = palette.outline
      ctx.fillRect(x + scale * 2, y + scale * 1.5, scale * 4, scale * 0.2)
      ctx.fillRect(x + scale * 2, y + scale * 3.3, scale * 4, scale * 0.2)
      ctx.fillRect(x + scale * 2, y + scale * 1.5, scale * 0.2, scale * 2)
      ctx.fillRect(x + scale * 5.8, y + scale * 1.5, scale * 0.2, scale * 2)
      
      // Monitor stand
      drawRoundedRect(x + scale * 3, y + scale * 4, scale * 2, scale, scale * 0.2, palette.metal)
      
      // Stand neck
      ctx.fillStyle = palette.outline
      ctx.fillRect(x + scale * 3.8, y + scale * 3.2, scale * 0.4, scale * 0.8)
      ctx.fillStyle = palette.metal
      ctx.fillRect(x + scale * 3.9, y + scale * 3.3, scale * 0.2, scale * 0.6)
    }
    
    if (phase > 0.7) {
      // Keyboard
      drawRoundedRect(x + scale * 0.7, y + scale * 5, scale * 6.8, scale * 1.6, scale * 0.3, palette.outline)
      drawRoundedRect(x + scale * 1, y + scale * 5.2, scale * 6, scale * 1.1, scale * 0.2, palette.dark)
      
      // Keyboard keys
      ctx.fillStyle = palette.metal
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
          const keyX = x + scale * 1.3 + col * scale * 0.7
          const keyY = y + scale * 5.4 + row * scale * 0.3
          drawRoundedRect(keyX, keyY, scale * 0.6, scale * 0.2, scale * 0.05, palette.metal)
        }
      }
      
      // Mouse
      drawRoundedRect(x + scale * 6.2, y + scale * 4.6, scale * 1.3, scale * 1.7, scale * 0.4, palette.outline)
      drawRoundedRect(x + scale * 6.3, y + scale * 4.7, scale * 1.1, scale * 1.5, scale * 0.3, palette.metal)
      
      // Mouse buttons
      ctx.fillStyle = palette.dark
      ctx.beginPath()
      ctx.arc(x + scale * 6.85, y + scale * 5.2, scale * 0.2, 0, Math.PI * 2)
      ctx.fill()
    }
    
    if (phase >= 1) {
      // Screen content
      const screenX = x + scale * 2
      const screenY = y + scale * 1.5
      const screenW = scale * 4
      const screenH = scale * 2
      
      ctx.save()
      ctx.beginPath()
      drawRoundedRect(screenX, screenY, screenW, screenH, scale * 0.2, '#000') // Clip path
      ctx.clip()
      
      // Black background
      ctx.fillStyle = '#000000'
      ctx.fillRect(screenX, screenY, screenW, screenH)
      
      // Scrolling binary
      ctx.fillStyle = '#3b82f6' // Bright blue (Tailwind blue-500)
      ctx.font = `bold ${scale * 0.5}px monospace`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      
      const scrollOffset = (t * scale * 1.5) % (scale * 3)
      const binaryLines = [
        '1 0 1 0',
        '0 1 0 1',
        '1 1 0 0',
        '0 0 1 1',
        '1 0 1 0',
        '0 1 1 0',
        '1 0 0 1'
      ]
      
      binaryLines.forEach((line, i) => {
        let lineY = screenY - scale + i * scale * 0.5 + scrollOffset
        // Wrap logic
        if (lineY > screenY + screenH) lineY -= scale * 3.5
        
        ctx.fillText(line, screenX + scale * 0.2, lineY)
      })
      
      // Scanline effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      for(let i=0; i<screenH; i+=2) {
          ctx.fillRect(screenX, screenY + i, screenW, 1)
      }
      
      // Screen glow
      const glow = Math.sin(t * 5) * 0.1 + 0.2
      ctx.fillStyle = `rgba(59, 130, 246, ${glow * 0.3})`
      ctx.fillRect(screenX, screenY, screenW, screenH)

      ctx.restore()
    }
  }


  function drawGround(t) {
    const { groundY, scale } = getMetrics()
    
    // Base ground with gradient
    const groundGradient = ctx.createLinearGradient(0, groundY, 0, height)
    groundGradient.addColorStop(0, '#0f172a')
    groundGradient.addColorStop(0.5, '#1e293b')
    groundGradient.addColorStop(1, '#0f172a')
    ctx.fillStyle = groundGradient
    ctx.fillRect(0, groundY, width, height - groundY)
    
    // Ground edge with texture
    ctx.fillStyle = '#334155'
    ctx.fillRect(0, groundY - scale * 0.2, width, scale * 0.3)
    
    // Stone tiles with beveled edges
    const tile = Math.max(6, Math.round(height / 18))
    const offset = (t * 80) % tile
    for (let i = -2; i < width / tile + 2; i += 1) {
      const x = i * tile - offset
      const tileColor = i % 2 === 0 ? '#1f2937' : '#111827'
      const highlightColor = i % 2 === 0 ? '#374151' : '#1f2937'
      
      // Tile base
      ctx.fillStyle = tileColor
      ctx.fillRect(x, groundY + tile * 0.2, tile * 0.9, tile * 0.6)
      
      // Tile highlight (bevel effect)
      ctx.fillStyle = highlightColor
      ctx.fillRect(x, groundY + tile * 0.2, tile * 0.9, tile * 0.1)
      ctx.fillRect(x, groundY + tile * 0.2, tile * 0.1, tile * 0.6)
      
      // Tile shadow
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(x + tile * 0.8, groundY + tile * 0.2, tile * 0.1, tile * 0.6)
      ctx.fillRect(x, groundY + tile * 0.7, tile * 0.9, tile * 0.1)
    }
    
    // Add some rocks/debris for detail
    for (let i = 0; i < 8; i++) {
      const rockX = (width / 8) * i + Math.sin(t + i) * 20
      const rockY = groundY + scale * 0.1
      const rockSize = scale * 0.3 + Math.sin(t * 2 + i) * 0.1
      
      ctx.fillStyle = '#374151'
      ctx.beginPath()
      ctx.arc(rockX, rockY, rockSize, 0, Math.PI * 2)
      ctx.fill()
      
      // Rock highlight
      ctx.fillStyle = '#4b5563'
      ctx.beginPath()
      ctx.arc(rockX - rockSize * 0.3, rockY - rockSize * 0.3, rockSize * 0.4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  function render(t) {
    ctx.clearRect(0, 0, width, height)
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#111827')
    gradient.addColorStop(0.5, '#0b1220')
    gradient.addColorStop(1, '#0b1220')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    clouds.forEach((cloud) => drawCloud(cloud))
    const { groundY, scale } = getMetrics()
    drawGround(t)
    if (state === 'mining') {
      ores.forEach((ore) => drawOre(ore.x, ore.y, scale, ore))
    }
    if (state === 'crafting' || state === 'coding') {
      const computerX = width * 0.42
      const computerY = groundY - scale * 7
      const phase = state === 'crafting' ? Math.min(1, stateTime / 2) : 1
      drawComputer(computerX, computerY, scale, phase, t)
    }
    sparks.forEach((spark) => {
      const alpha = Math.max(0, spark.life / spark.max)
      ctx.fillStyle = `rgba(250, 204, 21, ${alpha})`
      ctx.fillRect(spark.x, spark.y, scale * 0.6, scale * 0.6)
    })
    drawRunner(t, state)
  }

  function update(dt) {
    const { groundY, scale } = getMetrics()
    clouds.forEach((cloud) => {
      cloud.x -= dt * 40 * cloud.s
      if (cloud.x < -cloud.r * 3) {
        cloud.x = width + cloud.r * 3
        cloud.y = 10 + Math.random() * 50
        cloud.r = 10 + Math.random() * 18
        cloud.s = 0.08 + Math.random() * 0.16
      }
    })
    if (state === 'mining') {
      spawnTimer -= dt
      if (spawnTimer <= 0 && spawnedCount < 5) {
        spawnTimer = 0.8 + Math.random() * 1.2
        const typeIndex = spawnedCount % oreTypes.length
        spawnedCount += 1
        
        // Generate brute shape points
        const numPoints = 6 + Math.floor(Math.random() * 4) // 6-9 points
        const points = []
        for (let j = 0; j < numPoints; j++) {
            const angle = (j / numPoints) * Math.PI * 2
            const r = 1.0 + Math.random() * 0.6 // Radius variation for jaggedness
            points.push({
                x: Math.cos(angle) * r,
                y: Math.sin(angle) * r
            })
        }
        
        ores.push({
          x: width + Math.random() * width * 0.2,
          y: groundY - scale * 3,
          collected: false,
          type: oreTypes[typeIndex],
          points: points,
        })
      }
      const runnerX = width * 0.18 + scale * 6
      for (let i = ores.length - 1; i >= 0; i -= 1) {
        const ore = ores[i]
        ore.x -= dt * 80
        if (!ore.collected && ore.x <= runnerX) {
          ore.collected = true
          minedCount += 1
          sparks.push({
            x: ore.x,
            y: ore.y,
            life: 0.4,
            max: 0.4,
          })
        }
        if (ore.x < -scale * 10 || ore.collected) {
          ores.splice(i, 1)
        }
      }
      if (minedCount >= 5) {
        state = 'crafting'
        stateTime = 0
      }
    } else {
      stateTime += dt
      if (state === 'crafting' && stateTime >= 2.4) {
        state = 'coding'
        stateTime = 0
      } else if (state === 'coding' && stateTime >= 5.0) {
        state = 'following'
        stateTime = 0
        if (mousePos.x === 0 && mousePos.y === 0) {
            mousePos.x = runnerPos.x
            mousePos.y = runnerPos.y
        }
      }
      
      if (state === 'following') {
          const dx = mousePos.x - runnerPos.x
          const dy = mousePos.y - runnerPos.y
          const dist = Math.sqrt(dx*dx + dy*dy)
          
          if (dist > scale) {
              const moveSpeed = scale * 15
              
              runnerPos.x += (dx / dist) * moveSpeed * dt
              runnerPos.y += (dy / dist) * moveSpeed * dt
              
              if (Math.abs(dx) > 1) facingRight = dx > 0
          }
          
          // Clamp
          const spriteHeight = 10.5 * scale
          const spriteWidth = 11 * scale
          
          runnerPos.x = Math.max(-spriteWidth * 0.2, Math.min(width - spriteWidth * 0.8, runnerPos.x))
          runnerPos.y = Math.max(groundY - spriteHeight - scale * 0.5, Math.min(height - spriteHeight + scale * 0.5, runnerPos.y))
      }
    }
    for (let i = sparks.length - 1; i >= 0; i -= 1) {
      const spark = sparks[i]
      spark.life -= dt
      spark.y -= dt * 10
      if (spark.life <= 0) {
        sparks.splice(i, 1)
      }
    }
  }

  function tick(time) {
    const t = time / 1000
    const dt = lastTime ? t - lastTime : 0
    lastTime = t
    update(dt)
    render(t)
    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
})()
