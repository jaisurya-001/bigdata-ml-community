import React, { useState } from 'react';
import { Menu, X, Database, Network, Cpu, Activity, Layers, ArrowRight } from 'lucide-react';
import { communityInfo, hackathonInfo } from './data/content';
import './index.css';

// --- COMPONENTS ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = ['Home', 'About', 'Aim', 'Goals', 'Hackathon', 'SRS', 'Evaluation', 'Timeline'];

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={24} color="var(--primary)" />
          <span>Big Data & ML</span>
        </div>
        
        <div className="nav-links">
          {links.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="nav-link">
              {link}
            </a>
          ))}
          <a href="#hackathon" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>View Hackathon</a>
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="mobile-nav">
          {links.map(link => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`} 
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="hero-section bg-network">
      <div className="container grid-2" style={{ alignItems: 'center' }}>
        <div className="animate-fade-in">
          <h1 style={{ marginBottom: '1rem', fontSize: '3rem' }}>
            BIG DATA ANALYTICS <br/>
            <span style={{ color: 'var(--primary)' }}>& MACHINE LEARNING</span>
          </h1>
          <h3 style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{communityInfo.subtitle}</h3>
          <p style={{ fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '2.5rem', maxWidth: '600px' }}>
            {communityInfo.description}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#about" className="btn btn-primary">Explore Community</a>
            <a href="#hackathon" className="btn btn-outline">View Hackathon</a>
          </div>
        </div>
        
        <div className="hero-visual" style={{ position: 'relative', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Abstract Data to Intelligence Visual */}
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Network size={120} color="var(--secondary)" style={{ position: 'absolute', opacity: 0.5, animation: 'float 6s ease-in-out infinite' }} />
            <Database size={80} color="var(--primary-light)" style={{ position: 'absolute', transform: 'translate(-80px, -60px)', animation: 'float 5s ease-in-out infinite 1s' }} />
            <Cpu size={100} color="var(--primary-dark)" style={{ position: 'absolute', transform: 'translate(80px, 40px)', animation: 'float 7s ease-in-out infinite 0.5s' }} />
            
            {/* Connecting lines conceptually represented */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1 }}>
              <line x1="30%" y1="35%" x2="50%" y2="50%" stroke="var(--secondary)" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="50%" y1="50%" x2="70%" y2="65%" stroke="var(--primary-light)" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = () => (
  <section id="about" className="section section-alt">
    <div className="container grid-2" style={{ alignItems: 'center' }}>
      <div>
        <h2>About the Community</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>{communityInfo.about}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
         <Activity size={150} color="var(--secondary)" style={{ opacity: 0.8 }} />
      </div>
    </div>
  </section>
);

const Aim = () => (
  <section id="aim" className="section">
    <div className="container text-center" style={{ textAlign: 'center' }}>
      <h2>Our Aim</h2>
      <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 3rem auto', color: 'var(--primary-dark)' }}>
        "{communityInfo.aim}"
      </p>
      
      {/* Process Diagram */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '3rem' }}>
        {['Data', 'Insight', 'Intelligence', 'Innovation'].map((step, idx, arr) => (
          <React.Fragment key={step}>
            <div className="card" style={{ padding: '1rem 2rem', border: '2px solid var(--primary-light)', backgroundColor: 'var(--primary)', color: 'white' }}>
              <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{step}</span>
            </div>
            {idx < arr.length - 1 && (
              <ArrowRight color="var(--text-muted)" size={24} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);

const Goals = () => (
  <section id="goals" className="section section-alt">
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Our Goals</h2>
      <div className="grid-3">
        {communityInfo.goals.map((goal, idx) => (
          <div key={idx} className="card">
            <h3 style={{ color: 'var(--primary-light)' }}>{goal.title}</h3>
            <p>{goal.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HackathonOverview = () => (
  <section id="hackathon" className="section bg-network">
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{hackathonInfo.title}</h2>
        <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>{hackathonInfo.about}</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Event Details</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <li><strong>Theme:</strong> {hackathonInfo.theme}</li>
            <li><strong>Venue:</strong> {hackathonInfo.venue}</li>
            <li><strong>Date:</strong> {hackathonInfo.date}</li>
            <li><strong>Time:</strong> {hackathonInfo.time}</li>
            <li><strong>Duration:</strong> {hackathonInfo.duration}</li>
            <li><strong>Team Size:</strong> {hackathonInfo.teamSize}</li>
          </ul>
          <div style={{ marginTop: '2rem' }}>
            <a href="#" className="btn btn-primary" style={{ width: '100%' }}>{hackathonInfo.registration}</a>
          </div>
        </div>

        <div className="card" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
          <h3 style={{ color: 'white' }}>The Process</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {['Problem', 'Data', 'Analysis', 'Model/Solution', 'Prototype', 'Demo'].map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {idx + 1}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const SRS = () => (
  <section id="srs" className="section section-alt">
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>SRS — Solution Requirements & Specification</h2>
      <div className="grid-2">
        {hackathonInfo.srs.map((item, idx) => (
          <div key={idx} style={{ padding: '1.5rem', borderLeft: '3px solid var(--primary-light)', backgroundColor: 'var(--background)', marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{item.title}</h4>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Evaluation = () => (
  <section id="evaluation" className="section">
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Prototype Evaluation Criteria</h2>
      <p style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        Clearly understand how your prototypes will be evaluated during the final demonstration.
      </p>

      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Evaluation Criteria</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {hackathonInfo.evaluationCriteria.map((crit, idx) => (
                <tr key={idx}>
                  <td>{crit.name}</td>
                  <td><strong>{crit.weight}%</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3>Judging Process</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {hackathonInfo.judgingProcess.map((step, idx) => (
              <div key={idx} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--primary-light)', fontWeight: 700, fontSize: '1.2rem' }}>{step.step}</div>
                <div>
                  <h4 style={{ marginBottom: '0.25rem', fontSize: '1.05rem' }}>{step.title}</h4>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Timeline = () => (
  <section id="timeline" className="section section-alt">
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Hackathon Journey</h2>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {hackathonInfo.timeline.map((item, idx) => (
          <div key={idx} className="timeline-item">
            <h4 style={{ margin: 0 }}>{item}</h4>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Requirements = () => (
  <section className="section">
    <div className="container grid-2">
      <div className="card">
        <h3>What Participants Need To Prepare</h3>
        <ul style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {hackathonInfo.participantRequirements.map((req, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Final Submission Deliverables</h3>
        <ul style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {hackathonInfo.finalDeliverables.map((del, idx) => (
            <li key={idx}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                <Layers size={16} color="var(--primary-light)" />
                {del.title}
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>{del.description}</p>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <h4 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>What should the Project Documentation contain?</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {hackathonInfo.documentationDetails.map((doc, idx) => (
              <li key={idx}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>{doc.title}</span>
                <span style={{ fontSize: '0.9rem' }}>{doc.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);


const CTA = () => (
  <section className="section" style={{ backgroundColor: 'var(--primary)', color: 'white', textAlign: 'center' }}>
    <div className="container">
      <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>Turn Data Into Ideas. Turn Ideas Into Solutions.</h2>
      <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
        Join the Big Data Analytics & Machine Learning community and build solutions that go beyond the classroom.
      </p>
      <a href="#hackathon" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '1rem 2rem', fontSize: '1.1rem' }}>
        Explore the Hackathon
      </a>
    </div>
  </section>
);

const Footer = () => (
  <footer style={{ backgroundColor: 'var(--primary-dark)', color: 'rgba(255,255,255,0.7)', padding: '3rem 0 1.5rem 0' }}>
    <div className="container grid-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem', marginBottom: '1.5rem' }}>
      <div>
        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{communityInfo.name}</h3>
        <p style={{ fontSize: '0.9rem' }}>College Technical Community</p>
      </div>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
          <li><a href="#about">About</a></li>
          <li><a href="#aim">Aim</a></li>
          <li><a href="#goals">Goals</a></li>
        </ul>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
          <li><a href="#hackathon">Hackathon</a></li>
          <li><a href="#srs">SRS</a></li>
          <li><a href="#evaluation">Evaluation</a></li>
        </ul>
      </div>
    </div>
    <div className="container" style={{ textAlign: 'center', fontSize: '0.85rem' }}>
      Built by the {communityInfo.name} Community
    </div>
  </footer>
);

// --- MAIN APP COMPONENT ---

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Aim />
      <Goals />
      <HackathonOverview />
      <SRS />
      <Evaluation />
      <Timeline />
      <Requirements />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;
