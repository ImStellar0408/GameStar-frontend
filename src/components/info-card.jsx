import '../styles/info-card.css';

export default function InfoCard({ title, description, videoSrc }) {
  return (
    <div className="card autoDisplay">
      <h1>{title}</h1>
      <p>{description}</p>
      <video src={videoSrc} autoPlay muted loop playsInline></video>
    </div>
  )
}

