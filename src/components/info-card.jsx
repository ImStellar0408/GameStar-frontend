import './info-card.css';

export default function InfoCard({ title, description, videoSrc }) {
  return (
    <div className="card">
      <h1>{title}</h1>
      <p>{description}</p>
      <video src={videoSrc} autoPlay muted loop playsInline></video>
      <button>EXPLORE</button>
    </div>
  )
}

