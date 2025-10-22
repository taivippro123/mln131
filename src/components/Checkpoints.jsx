import { useEffect, useState } from 'react'
import CheckpointButton from './CheckpointButton'

const TILE_SIZE = 64

// Checkpoint data từ Layer 5 của roadmap.json
const CHECKPOINTS = [
  {"id":131, "layer":"Tile Layer 5", "row":8, "col":6, "pixel_center":[416,544], "label":"Start"},
  {"id":132, "layer":"Tile Layer 5", "row":8, "col":12, "pixel_center":[864,544], "label":"Checkpoint 1"}, 
  {"id":133, "layer":"Tile Layer 5", "row":4, "col":17, "pixel_center":[1120,288], "label":"Checkpoint 2"},
  {"id":134, "layer":"Tile Layer 5", "row":10, "col":17, "pixel_center":[1120,672], "label":"Checkpoint 3"},
  {"id":135, "layer":"Tile Layer 5", "row":10, "col":23, "pixel_center":[1504,672], "label":"Finish"}
]

export default function Checkpoints({ 
  currentPosition, 
  completedCheckpoints = [],
  onStartQuiz 
}) {
  const [visibleCheckpoints, setVisibleCheckpoints] = useState(new Set())

  useEffect(() => {
    // Show checkpoints with a delay for visual effect
    CHECKPOINTS.forEach((checkpoint, index) => {
      setTimeout(() => {
        setVisibleCheckpoints(prev => new Set([...prev, checkpoint.id]))
      }, index * 200)
    })
  }, [])

  return (
    <>
      {CHECKPOINTS.map((checkpoint, index) => {
        if (!visibleCheckpoints.has(checkpoint.id)) return null

        const [x, y] = checkpoint.pixel_center
        const isUnlocked = index === 0 || completedCheckpoints.includes(index - 1)
        const isCompleted = completedCheckpoints.includes(index)

        return (
          <div
            key={checkpoint.id}
            className="absolute transition-all duration-500 ease-out"
            style={{
              left: `${x - 20}px`,
              top: `${y - 20}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CheckpointButton
              checkpoint={checkpoint}
              index={index}
              isUnlocked={isUnlocked}
              isCompleted={isCompleted}
              onStartQuiz={onStartQuiz}
            />
          </div>
        )
      })}
    </>
  )
}