import React from 'react';
import './InfoCard.css'; 

interface InfoCardProps {
  label: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value }) => {
  return (
    <div className="info-card">
      <span className="card-label">{label}</span>
      <span className="card-value">{value}</span>
    </div>
  );
};

export default InfoCard;