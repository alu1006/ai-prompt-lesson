import MovementCard from './MovementCard.jsx'

export default function MovementList({ movements, onSelect }) {
  return (
    <div className="movement-list">
      {movements.map(movement => (
        <MovementCard key={movement.id} movement={movement} onSelect={onSelect} />
      ))}
    </div>
  )
}
