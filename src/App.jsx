import { useEffect, useRef, useState } from 'react'
import roadmapData from '/roadmap.json'

const TILE_SIZE = 64
const MAP_WIDTH = roadmapData.width
const MAP_HEIGHT = roadmapData.height

export default function App() {
  const canvasRef = useRef(null)
  const [tilesLoaded, setTilesLoaded] = useState(false)
  const tilesRef = useRef({})

  // Load tiles
  useEffect(() => {
    // Get unique tile IDs from ALL layers
    const allTiles = new Set()
    roadmapData.layers.forEach(layer => {
      layer.data.forEach(tile => {
        if (tile > 0) allTiles.add(tile)
      })
    })
    const tilesToLoad = [...allTiles]
    
    const loadPromises = tilesToLoad.map(tileNum => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          // Just store the original image - PNG alpha will be preserved
          tilesRef.current[tileNum] = img
          resolve()
        }
        img.onerror = () => resolve()
        // IMPORTANT: Set crossOrigin before src to preserve alpha
        img.crossOrigin = 'anonymous'
        img.src = `/tiles/mapTile_${String(tileNum).padStart(3, '0')}.png`
      })
    })

    Promise.all(loadPromises).then(() => {
      setTilesLoaded(true)
    })
  }, [])

  // Draw map
  useEffect(() => {
    if (!tilesLoaded || !canvasRef.current) return

    const canvas = canvasRef.current
    // Enable alpha channel and disable image smoothing for pixel-perfect rendering
    const ctx = canvas.getContext('2d', { 
      alpha: true,
      willReadFrequently: false 
    })
    
    // Disable smoothing for crisp pixel art
    ctx.imageSmoothingEnabled = false
    
    // Set composite operation to properly handle transparency
    ctx.globalCompositeOperation = 'source-over'
    
    // Clear canvas to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw ALL layers from roadmap.json in order (bottom to top)
    roadmapData.layers.forEach((layer, layerIndex) => {
      const mapData = layer.data
      
      for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
          const index = y * MAP_WIDTH + x
          const tileNum = mapData[index]
          
          if (tileNum && tileNum > 0) {
            const img = tilesRef.current[tileNum]
            if (img) {
              // Draw tile - alpha channel will be respected
              ctx.save()
              ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
              ctx.restore()
            }
          }
        }
      }
    })
  }, [tilesLoaded])

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
      {!tilesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-800 text-2xl">Loading...</p>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        width={MAP_WIDTH * TILE_SIZE}
        height={MAP_HEIGHT * TILE_SIZE}
        style={{ background: 'transparent', display: 'block' }}
      />
    </div>
  )
}
