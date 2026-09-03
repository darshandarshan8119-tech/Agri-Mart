const steps = [
  { num: '01', title: 'Register', desc: 'Create your Agri-MART account.' },
  { num: '02', title: 'Provide Information', desc: 'Enter soil/environment information or upload crop images.' },
  { num: '03', title: 'AI Analysis', desc: 'Our machine learning and deep learning models analyze the provided information.' },
  { num: '04', title: 'Get Insights', desc: 'Receive predictions, recommendations, and useful agricultural insights.' },
];

export default function Workflow() {
  return (
    <section className="section workflow" id="how-it-works">
      <div className="container">
        <div className="section-heading reveal">
          <p className="eyebrow">How it works</p>
          <h2>From field data to clear insights.</h2>
        </div>
        <div className="timeline">
          {steps.map((s) => (
            <article className="step reveal" key={s.num}>
              <span>{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
