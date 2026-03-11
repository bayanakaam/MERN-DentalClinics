import React from 'react';

// تعريف مواقع وأرقام الأسنان
const teethLayout = {
  upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
  upperLeft:  [21, 22, 23, 24, 25, 26, 27, 28],
  lowerLeft:  [31, 32, 33, 34, 35, 36, 37, 38],
  lowerRight: [48, 47, 46, 45, 44, 43, 42, 41],
};

const Tooth = ({ id, x, y, onSelect, isSelected, treatmentColor }) => {
  const fillColor = isSelected ? 'red' : (treatmentColor || '#e0e0e0');
  return (
    <g transform={`translate(${x}, ${y})`} onClick={() => onSelect(id)} style={{ cursor: 'pointer' }}>
      <circle r="15" fill={fillColor} stroke="#333" strokeWidth="1" />
      <text x="0" y="5" textAnchor="middle" fill={isSelected || treatmentColor ? 'white' : 'black'} fontSize="12">{id}</text>
    </g>
  );
};

const DentalChart = ({ selectedTeeth, onToothSelect, treatments }) => {
  // دالة للحصول على لون العلاج المطبق على سن معين
  const getTreatmentColorForTooth = (toothId) => {
    const treatment = treatments.find(t => t.toothId === toothId);
    return treatment ? treatment.color : null;
  };

  return (
    <svg width="400" height="500" viewBox="0 0 400 500">
      {/* رسم الأسنان بناءً على مواقعها */}
      {teethLayout.upperRight.map((id, i) => <Tooth key={id} id={id} x={180 - i * 35} y={50} onSelect={onToothSelect} isSelected={selectedTeeth.includes(id)} treatmentColor={getTreatmentColorForTooth(id)} />)}
      {teethLayout.upperLeft.map((id, i) => <Tooth key={id} id={id} x={220 + i * 35} y={50} onSelect={onToothSelect} isSelected={selectedTeeth.includes(id)} treatmentColor={getTreatmentColorForTooth(id)} />)}
      {/* ... أضف هنا منطق رسم الفكين السفليين بشكل مقوس ... */}
    </svg>
  );
};

export default DentalChart;
