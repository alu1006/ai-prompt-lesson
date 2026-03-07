import MovementCard from './MovementCard.jsx'

export default function EraSection({ era, movements, onSelect }) {
  return (
    <section className="era-section">
      <div className="era-header">
        <h2 className="era-name">{era.name_zh}</h2>
        <span className="era-years">{era.yearRange}</span>
      </div>
      <div className="era-movements">
        {movements.map(movement => (
          <MovementCard key={movement.id} movement={movement} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
