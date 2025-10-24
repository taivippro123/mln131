import { useEffect, useRef, useState } from 'react'
import roadmapData from '/roadmap.json'
import Flag from './components/Flag'
import Checkpoints from './components/Checkpoints'
import IntroModal from './components/IntroModal'
import QuizModal from './components/QuizModal'
import PuzzleModal from './components/PuzzleModal'
import FinalCompletionModal from './components/FinalCompletionModal'
import CollectionModal from './components/CollectionModal'
import { useLocalStorage } from './hooks/useLocalStorage'

const TILE_SIZE = 64
const MAP_WIDTH = roadmapData.width
const MAP_HEIGHT = roadmapData.height

export default function App() {
  const canvasRef = useRef(null)
  const [tilesLoaded, setTilesLoaded] = useState(false)
  const [isFlagAnimating, setIsFlagAnimating] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [showCheckpoints, setShowCheckpoints] = useState(true)
  const [currentFlagPosition, setCurrentFlagPosition] = useState(0)
  const [currentCheckpoint, setCurrentCheckpoint] = useLocalStorage('currentCheckpoint', 0)
  const [animationKey, setAnimationKey] = useState(0)
  const [showIntroModal, setShowIntroModal] = useState(true)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [showPuzzleModal, setShowPuzzleModal] = useState(false)
  const [showFinalModal, setShowFinalModal] = useState(false)
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [currentStage, setCurrentStage] = useState('')
  const [completedCheckpoints, setCompletedCheckpoints] = useLocalStorage('completedCheckpoints', [])
  const tilesRef = useRef({})

  // Function to get correct asset path for tile ID
  const getTileAssetPath = (tileNum) => {
    // Handle flipped/rotated tiles by extracting base tile ID
    const getBaseTileId = (tileId) => {
      // Remove flip flags (bit 31, 30, 29)
      return tileId & 0x0FFFFFFF
    }
    
    const baseTileId = getBaseTileId(tileNum)
    
    // tile5.tsx tileset (firstgid: 494) - Individual tile images (all 64x64)
    if (baseTileId >= 494 && baseTileId <= 530) {
      // Create mapping based on actual tile5.tsx structure (37 tiles, all 64x64)
      const tile5Assets = [
        '1-removebg-preview (1).png',      // 494 -> 0
        '2-removebg-preview.png',         // 495 -> 1
        'covietnam.png',                  // 496 -> 2
        'thuyen2.png',                    // 497 -> 3
        'thuyen2.png',                    // 498 -> 4
        'maybay.png',                     // 499 -> 5
        'xetai.png',                      // 500 -> 6
        'thuyen2.png',                    // 501 -> 7
        'covietnam.png',                  // 502 -> 8
        'thuyen2.png',                    // 503 -> 9
        'thuyen2.png',                    // 504 -> 10
        'maybay.png',                     // 505 -> 11
        'xetai.png',                      // 506 -> 12
        'thuyen2.png',                    // 507 -> 13
        '',                               // 508 -> 14 (empty)
        '',                               // 509 -> 15 (empty)
        'thuyen3.png',                    // 510 -> 16 (now 64x64)
        'phuongtien.png',                 // 511 -> 17
        'phuongtien2.png',                // 512 -> 18
        'phuongtien1.png',                // 513 -> 19
        'number1 (1).jpg',               // 514 -> 20
        'number6 (1).jpg',                // 515 -> 21
        'number3 (1).jpg',                // 516 -> 22
        'number2 (1).jpg',                // 517 -> 23
        'number5 (1).jpg',                // 518 -> 24
        'nhamay.png',                     // 519 -> 25
        'xe2-removebg-preview.png',       // 520 -> 26
        'xe-removebg-preview.png',        // 521 -> 27
        'baogao-removebg-preview.png',    // 522 -> 28
        'trau-removebg-preview.png',      // 523 -> 29
        'xetang2.png',                    // 524 -> 30
        'xetai2.png',                     // 525 -> 31
        'nguoi2-removebg-preview.png',    // 526 -> 32
        'nguoi-removebg-preview.png',     // 527 -> 33
        'coVietNam2 (1).png',            // 528 -> 34
        'thuyen3_2.png',                 // 529 -> 35 (NEW)
        'thuyen3_1.png'                  // 530 -> 36 (NEW)
      ]
      
      const localId = baseTileId - 494
      if (localId >= 0 && localId < tile5Assets.length && tile5Assets[localId]) {
        return `/asset/${tile5Assets[localId]}`
      }
    }
    
    // giaidoan3.tsx tileset (firstgid: 430) - Single image tileset
    if (baseTileId >= 430 && baseTileId <= 493) {
      return `/asset/giaidoan3.png`
    }
    
    // giaidoan2.tsx tileset (firstgid: 366) - Single image tileset
    if (baseTileId >= 366 && baseTileId <= 429) {
      return `/asset/giaidoan2.png`
    }
    
    // giaidoan1.tsx tileset (firstgid: 302) - Single image tileset
    if (baseTileId >= 302 && baseTileId <= 365) {
      return `/asset/giaidoan1.png`
    }
    
    // unnamed-removebg-preview.tsx tileset (firstgid: 253) - Single image tileset
    if (baseTileId >= 253 && baseTileId <= 301) {
      return `/asset/unnamed-removebg-preview.png`
    }
    
    // tile3.tsx tileset (firstgid: 189) - Single image tileset
    if (baseTileId >= 189 && baseTileId <= 252) {
      return `/asset/0605d382-107b-4089-8536-bc9dd76f614d.png`
    }
    
    // tile.tsx tileset (firstgid: 1) - Individual tile images
    if (baseTileId >= 1 && baseTileId <= 188) {
      return `/tiles/mapTile_${String(baseTileId).padStart(3, '0')}.png`
    }
    
    // Handle special tiles that might be from other sources
    // These could be special tiles or from additional tilesets
    
    if (baseTileId >= 500 && baseTileId <= 600) {
      // Try to load from tiles directory with extended range
      return `/tiles/mapTile_${String(baseTileId).padStart(3, '0')}.png`
    }
    
    // For very large tile IDs, they might be special markers
    if (baseTileId > 1000) {
      return null // Skip these
    }
    
    // Default fallback - try to load anyway
    return `/tiles/mapTile_${String(baseTileId).padStart(3, '0')}.png`
  }

  // Khôi phục trạng thái khi trang được tải lại
  useEffect(() => {
    // Nếu đã có tiến trình được lưu, không hiển thị intro modal
    if (currentCheckpoint > 0 || completedCheckpoints.length > 0) {
      setShowIntroModal(false)
      console.log('Khôi phục tiến trình:', { currentCheckpoint, completedCheckpoints })
    }
  }, [currentCheckpoint, completedCheckpoints])

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
        const assetPath = getTileAssetPath(tileNum)
        
        // Skip tiles that return null (special markers, etc.)
        if (assetPath === null) {
          resolve()
          return
        }
        
        const img = new Image()
        img.onload = () => {
          // Just store the original image - PNG alpha will be preserved
          tilesRef.current[tileNum] = img
          console.log(`Successfully loaded tile ${tileNum}: ${assetPath}`)
          resolve()
        }
        img.onerror = () => {
          // Only log error for tiles that are actually expected to exist
          const baseTileId = tileNum & 0x0FFFFFFF
          if (baseTileId >= 1 && baseTileId <= 600) {
            console.log(`Failed to load tile ${tileNum}: ${assetPath}`)
          }
          resolve()
        }
        // IMPORTANT: Set crossOrigin before src to preserve alpha
        img.crossOrigin = 'anonymous'
        img.src = assetPath
      })
    })

    Promise.all(loadPromises).then(() => {
      setTilesLoaded(true)
    })
  }, [])

  // Function to get tile source rectangle for single image tilesets
  const getTileSourceRect = (tileNum, img) => {
    // Handle flipped/rotated tiles by extracting base tile ID
    const getBaseTileId = (tileId) => {
      // Remove flip flags (bit 31, 30, 29)
      return tileId & 0x0FFFFFFF
    }
    
    const baseTileId = getBaseTileId(tileNum)
    
    // tile3.tsx tileset (firstgid: 189) - 8x8 grid
    if (baseTileId >= 189 && baseTileId <= 252) {
      const localId = baseTileId - 189
      const tileX = localId % 8
      const tileY = Math.floor(localId / 8)
      return {
        sx: tileX * 64,
        sy: tileY * 64,
        sw: 64,
        sh: 64
      }
    }
    
    // giaidoan1.tsx tileset (firstgid: 302) - 8x8 grid
    if (baseTileId >= 302 && baseTileId <= 365) {
      const localId = baseTileId - 302
      const tileX = localId % 8
      const tileY = Math.floor(localId / 8)
      return {
        sx: tileX * 64,
        sy: tileY * 64,
        sw: 64,
        sh: 64
      }
    }
    
    // giaidoan2.tsx tileset (firstgid: 366) - 8x8 grid
    if (baseTileId >= 366 && baseTileId <= 429) {
      const localId = baseTileId - 366
      const tileX = localId % 8
      const tileY = Math.floor(localId / 8)
      return {
        sx: tileX * 64,
        sy: tileY * 64,
        sw: 64,
        sh: 64
      }
    }
    
    // giaidoan3.tsx tileset (firstgid: 430) - 8x8 grid
    if (baseTileId >= 430 && baseTileId <= 493) {
      const localId = baseTileId - 430
      const tileX = localId % 8
      const tileY = Math.floor(localId / 8)
      return {
        sx: tileX * 64,
        sy: tileY * 64,
        sw: 64,
        sh: 64
      }
    }
    
    // unnamed-removebg-preview.tsx tileset (firstgid: 253) - 7x7 grid
    if (baseTileId >= 253 && baseTileId <= 301) {
      const localId = baseTileId - 253
      const tileX = localId % 7
      const tileY = Math.floor(localId / 7)
      return {
        sx: tileX * 64,
        sy: tileY * 64,
        sw: 64,
        sh: 64
      }
    }
    
    // tile5.tsx tileset (firstgid: 494) - Individual tile images (all 64x64)
    if (baseTileId >= 494 && baseTileId <= 530) {
      // For individual tile images, use full image
      return {
        sx: 0,
        sy: 0,
        sw: img.width,
        sh: img.height
      }
    }
    
    // For other individual tile images, use full image
    return {
      sx: 0,
      sy: 0,
      sw: img.width,
      sh: img.height
    }
  }

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
              // Get source rectangle for tile
              const sourceRect = getTileSourceRect(tileNum, img)
              
              // Check for flip flags
              const isFlippedHorizontally = (tileNum & 0x80000000) !== 0
              const isFlippedVertically = (tileNum & 0x40000000) !== 0
              const isFlippedDiagonally = (tileNum & 0x20000000) !== 0
              
              const baseTileId = tileNum & 0x0FFFFFFF
              
              // Special handling for 1-removebg-preview and 2-removebg-preview tiles based on position
              let shouldFlipHorizontally = isFlippedHorizontally
              if (baseTileId === 494 || baseTileId === 495) { // 1-removebg-preview (1).png or 2-removebg-preview.png
                // Specific positions that need to be flipped to opposite direction
                const specificPositions = [
                  [11, 2], [12, 3],  // Top area
                  [18, 2], [19, 2],  // Top area
                  [26, 3], [26, 1], [26, 2], [26, 13],  // Right area
                  [11, 13],           // Bottom area
                  [18, 13]            // Bottom area
                ]
                
                const isSpecificPosition = specificPositions.some(([posX, posY]) => x === posX && y === posY)
                
                if (isSpecificPosition) {
                  // These specific positions need to be flipped to opposite direction
                  shouldFlipHorizontally = !isFlippedHorizontally
                } else {
                  // For other positions, use original logic
                  if (x < MAP_WIDTH / 2) {
                    shouldFlipHorizontally = !isFlippedHorizontally
                  }
                  if (x >= MAP_WIDTH / 2) {
                    shouldFlipHorizontally = !isFlippedHorizontally
                  }
                }
              }
              

              // Draw tile - alpha channel will be respected
              ctx.save()
              
              // Apply transformations
              if (shouldFlipHorizontally || isFlippedVertically || isFlippedDiagonally) {
                const centerX = x * TILE_SIZE + TILE_SIZE / 2
                const centerY = y * TILE_SIZE + TILE_SIZE / 2
                ctx.translate(centerX, centerY)
                
                if (shouldFlipHorizontally) {
                  ctx.scale(-1, 1)
                }
                if (isFlippedVertically) {
                  ctx.scale(1, -1)
                }
                if (isFlippedDiagonally) {
                  ctx.rotate(Math.PI / 2)
                }
                
                ctx.drawImage(
                  img,
                  sourceRect.sx, sourceRect.sy, sourceRect.sw, sourceRect.sh,
                  -TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE
                )
                
              } else {
                ctx.drawImage(
                  img,
                  sourceRect.sx, sourceRect.sy, sourceRect.sw, sourceRect.sh,
                  x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE
                )
                
              }
              
              ctx.restore()
            }
          }
        }
      }
    })
  }, [tilesLoaded])


  const handleAnimationComplete = () => {
    setIsFlagAnimating(false)
    setCurrentCheckpoint(prev => {
      const newCheckpoint = prev + 1
      console.log('Animation completed! Moving to checkpoint', newCheckpoint)
      return newCheckpoint
    })
    
    if (currentCheckpoint >= 4) {
      setAnimationComplete(true)
    }
  }

  const handleFlagPositionUpdate = (position) => {
    setCurrentFlagPosition(position)
  }

  const getCheckpointPosition = (checkpointIndex) => {
    const checkpointPositions = [
      { x: 416, y: 544 }, // Checkpoint 1
      { x: 864, y: 544 }, // Checkpoint 2  
      { x: 1120, y: 288 }, // Checkpoint 3
      { x: 1120, y: 672 }, // Checkpoint 4
      { x: 1504, y: 672 }  // Checkpoint 5
    ]
    return checkpointPositions[checkpointIndex] || checkpointPositions[0]
  }

  const getStaticFlagImage = (checkpointIndex) => {
    if (checkpointIndex === 1) {
      // At checkpoint 2: Show mtdtgpmnvn.png
      return "/mtdtgpmnvn.png"
    } else if (checkpointIndex >= 2) {
      // At checkpoint 3 and beyond: Show quockyvietnam.jpg
      return "/quockyvietnam.jpg"
    } else {
      // At checkpoint 1: Show quockyvietnam.jpg
      return "/quockyvietnam.jpg"
    }
  }

  const handleNextCheckpoint = () => {
    if (currentCheckpoint >= 4) return // Already at last checkpoint
    
    // Show quiz for current checkpoint (not next one)
    const stageMap = {
      0: 'Stage 1',
      1: 'Stage 2', 
      2: 'Stage 3',
      3: 'Stage 4',
      4: 'Stage 5'
    }
    
    setCurrentStage(stageMap[currentCheckpoint])
    setShowQuizModal(true)
  }

  const handleStartQuiz = (checkpointId, checkpointIndex) => {
    console.log('Starting quiz for checkpoint:', checkpointIndex) // Debug log
    const stageMap = {
      0: 'Stage 1',
      1: 'Stage 2', 
      2: 'Stage 3',
      3: 'Stage 4',
      4: 'Stage 5'
    }
    
    setCurrentStage(stageMap[checkpointIndex])
    setShowQuizModal(true)
  }

  const handleStopAnimation = () => {
    setIsFlagAnimating(false)
  }

  const handleResetJourney = () => {
    setCurrentCheckpoint(0)
    setCompletedCheckpoints([])
    setCurrentFlagPosition(0)
    setIsFlagAnimating(false)
    setAnimationComplete(false)
    setAnimationKey(prev => prev + 1)
    // Hiển thị lại intro modal khi reset
    setShowIntroModal(true)
  }

  const handleQuizComplete = () => {
    setShowQuizModal(false)
    setShowPuzzleModal(true)
  }

  const handlePuzzleComplete = (success) => {
    setShowPuzzleModal(false)
    
    if (success) {
      console.log('Puzzle completed! Moving from checkpoint', currentCheckpoint, 'to', currentCheckpoint + 1)
      // Mark current checkpoint as completed
      setCompletedCheckpoints(prev => {
        const newCompleted = [...prev, currentCheckpoint]
        console.log('Lưu tiến trình checkpoint:', newCompleted)
        return newCompleted
      })
      
      // Check if this is the last checkpoint (Stage 5 completed)
      if (currentCheckpoint === 4) {
        // Show final completion modal
        setShowFinalModal(true)
      } else {
        // Start flag animation to next checkpoint
        setIsFlagAnimating(true)
        setAnimationComplete(false)
        setCurrentFlagPosition(0)
        setAnimationKey(prev => prev + 1)
      }
    }
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center relative">
      {/* Intro Modal */}
      <IntroModal 
        isOpen={showIntroModal} 
        onClose={() => setShowIntroModal(false)} 
      />

      {/* Quiz Modal */}
      <QuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        currentStage={currentStage}
        onQuizComplete={handleQuizComplete}
      />

      {/* Puzzle Modal */}
      <PuzzleModal
        isOpen={showPuzzleModal}
        onClose={() => setShowPuzzleModal(false)}
        currentStage={currentStage}
        onPuzzleComplete={handlePuzzleComplete}
      />

      {/* Final Completion Modal */}
      <FinalCompletionModal
        isOpen={showFinalModal}
        onClose={() => setShowFinalModal(false)}
      />

      {/* Collection Modal */}
      <CollectionModal
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        completedCheckpoints={completedCheckpoints}
      />

      {!tilesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <p className="text-gray-800 text-2xl">Loading...</p>
        </div>
      )}
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={MAP_WIDTH * TILE_SIZE}
          height={MAP_HEIGHT * TILE_SIZE}
          style={{ background: 'transparent', display: 'block' }}
        />
        
        {/* Checkpoints */}
        <Checkpoints 
          currentPosition={currentFlagPosition}
          completedCheckpoints={completedCheckpoints}
          onStartQuiz={handleStartQuiz}
        />
        
        {/* Flag Animation */}
        <Flag 
          key={animationKey}
          isAnimating={isFlagAnimating}
          onAnimationComplete={handleAnimationComplete}
          onPositionUpdate={handleFlagPositionUpdate}
          currentCheckpoint={currentCheckpoint}
        />

        {/* Vietnam Flag - Moves with current checkpoint */}
        {!isFlagAnimating && (
          <div 
            className="absolute pointer-events-none z-30 transition-all duration-500"
            style={{
              left: `${getCheckpointPosition(currentCheckpoint).x - 24}px`,
              top: `${getCheckpointPosition(currentCheckpoint).y + 30}px`,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
          >
            <img
              src={getStaticFlagImage(currentCheckpoint)}
              alt="Vietnam Flag"
              width="48"
              height="48"
              className="rounded-lg border-2 border-white/50"
              style={{
                objectFit: 'cover',
                imageRendering: 'pixelated'
              }}
            />
          </div>
        )}

        {/* Collection Button - góc dưới bên trái */}
        {completedCheckpoints.length > 0 && (
          <button
            onClick={() => setShowCollectionModal(true)}
            className="fixed bottom-6 left-6 z-50 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
            title="Xem bộ sưu tập giai đoạn đã hoàn thành"
          >
            📚 Bộ sưu tập ({completedCheckpoints.length})
          </button>
        )}
      </div>
    </div>
  )
}
