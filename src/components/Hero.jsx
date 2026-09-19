import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <img
        src="/bgrand-hero.jpg"
        alt="BGRAND Homestay"
        className="hero-image"
      />

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <p className="hero-label">WELCOME TO BGRAND</p>

        <h1>
          BGRAND
          <span>Homestay</span>
        </h1>

        <p className="hero-description">
          A peaceful stay designed for comfort, relaxation and memorable moments.
        </p>

        <button className="hero-button">Explore Stay</button>
      </div>
    </section>
  );
}
