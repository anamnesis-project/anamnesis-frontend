import InfoCard from './infoCard';
import './patientinfo.css';
import BackButton from '../components/buttonback'

export default function PatientInfo () {
  return (
    <div className="screen-container">
      
      <header className="screen-header">
        <BackButton />
        <h1 className="screen-title text-[#0077B1]">Patient 1 - 03/10/2025</h1>
        <button className="avatar-button">A</button>
      </header>

      <main className="content-grid">
        
        <div className="grid-column">
          <InfoCard label="Name" value="Patient 1" />
          <InfoCard label="Age" value="48" />
          <InfoCard label="Gender" value="Female" />
          <InfoCard label="Weight" value="72" />
        </div>

        {/* Coluna 2 */}
        <div className="grid-column">
          <InfoCard label="Occupation" value="Engineer" />
          <InfoCard label="Continuous medicines" value="None" />
          <InfoCard label="Allergies" value="None" />
          <InfoCard label="Chronic diseases" value="Diabetes" />
        </div>

        {/* Coluna 3 */}
        <div className="grid-column">
          <InfoCard label="Temperature" value="37,5" />
          <InfoCard label="Oxygenation" value="90%" />
          <InfoCard label="Blood pressure" value="12,8" />
          {/* O último cartão está em falta na coluna 3 da imagem, 
              mas podemos adicionar um espaço ou outro cartão se necessário. */}
        </div>

      </main>
    </div>
  );
};