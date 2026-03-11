import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import patientService from '../services/patientService';
import categoryService from '../services/categoryService';
import caseService from '../services/caseService';

// ====================================================================
// المكون الداخلي: مخطط الأسنان (Dental Chart)
// ====================================================================
const teethLayout = {
  upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
  upperLeft:  [21, 22, 23, 24, 25, 26, 27, 28],
  lowerLeft:  [31, 32, 33, 34, 35, 36, 37, 38],
  lowerRight: [48, 47, 46, 45, 44, 43, 42, 41].reverse(), // نعكسه ليرسم بالترتيب الصحيح
};

const Tooth = ({ id, x, y, onSelect, isSelected, treatmentColor }) => {
  const fillColor = isSelected ? '#ff4d4d' : (treatmentColor || '#f0f0f0');
  const strokeColor = isSelected ? '#c10000' : '#666';
  const textColor = isSelected || treatmentColor ? 'white' : 'black';

  return (
    <g transform={`translate(${x}, ${y})`} onClick={() => onSelect(id)} style={{ cursor: 'pointer' }}>
      <circle r="18" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
      <text x="0" y="6" textAnchor="middle" fill={textColor} fontSize="14" fontWeight="bold">{id}</text>
    </g>
  );
};

const DentalChart = ({ selectedTeeth, onToothSelect, treatments }) => {
  const getTreatmentColorForTooth = (toothId) => {
    const treatment = treatments.find(t => t.toothId === toothId);
    return treatment ? treatment.color : null;
  };

  const renderJaw = (toothIds, startX, y, spacing) => {
    return toothIds.map((id, i) => (
      <Tooth 
        key={id} 
        id={id} 
        x={startX + i * spacing} 
        y={y} 
        onSelect={onToothSelect} 
        isSelected={selectedTeeth.includes(id)}
        treatmentColor={getTreatmentColorForTooth(id)}
      />
    ));
  };

  return (
    <svg width="100%" height="250" viewBox="0 0 700 250">
      {/* الفك العلوي */}
      {renderJaw(teethLayout.upperRight, 350 - (teethLayout.upperRight.length * 45), 50, 45)}
      {renderJaw(teethLayout.upperLeft, 350 + 45, 50, 45)}
      
      {/* الفك السفلي */}
      {renderJaw(teethLayout.lowerLeft, 350 - (teethLayout.lowerLeft.length * 45), 150, 45)}
      {renderJaw(teethLayout.lowerRight, 350 + 45, 150, 45)}
    </svg>
  );
};

// ====================================================================
// المكون الرئيسي للصفحة: CreateCasePage
// ====================================================================
const CreateCasePage = () => {
  const navigate = useNavigate();
  
  // --- إدارة حالة البيانات القادمة من الخادم ---
  const [patients, setPatients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');

  // --- إدارة حالة النموذج التفاعلي ---
  const [patientId, setPatientId] = useState('');
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [caseFile, setCaseFile] = useState(null);
  const [generalComment, setGeneralComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // جلب البيانات الأولية
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const patientsData = await patientService.getMyPatients();
        const categoriesData = await categoryService.getAllCategories();
        setPatients(patientsData);
        setCategories(categoriesData);
      } catch (error) {
        setServerError('Failed to load necessary data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // دالة لاختيار/إلغاء اختيار سن
  const handleToothSelect = (toothId) => {
    setSelectedTeeth(prev => 
      prev.includes(toothId) 
        ? prev.filter(id => id !== toothId)
        : [...prev, toothId]
    );
  };

  // دالة لتطبيق علاج على الأسنان المحددة
  const applyTreatment = (category, subCategory) => {
    if (selectedTeeth.length === 0) {
      alert('Please select at least one tooth before applying a treatment.');
      return;
    }

    const newTreatments = selectedTeeth.map(toothId => ({
      toothId: toothId,
      category: category._id,
      subCategory: subCategory._id,
      color: subCategory.color || '#808080', // استخدم اللون من البيانات أو لون افتراضي
      notes: ''
    }));

    setTreatments(prev => [
      ...prev.filter(t => !selectedTeeth.includes(t.toothId)),
      ...newTreatments
    ]);

    setSelectedTeeth([]); // إفراغ التحديد بعد التطبيق
  };

  // دالة لإرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !caseFile || treatments.length === 0) {
      setServerError('Please select a patient, upload a case file, and add at least one treatment.');
      return;
    }
    
    setIsSubmitting(true);
    setServerError('');

    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('caseFile', caseFile);
    formData.append('generalComment', generalComment);
    
    const treatmentsToSubmit = treatments.map(({ color, ...rest }) => rest);
    formData.append('treatments', JSON.stringify(treatmentsToSubmit));

    try {
      await caseService.createCase(formData);
      alert('Case created successfully!');
      navigate('/doctor/cases');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create case.';
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      
      {/* --- العمود الأيسر: قائمة العلاجات --- */}
      <div style={{ width: '300px', borderRight: '1px solid #eee', paddingRight: '20px' }}>
        <h3>Indications & Materials</h3>
        {categories.map(cat => (
          <div key={cat._id} style={{ marginBottom: '15px' }}>
            <h4>{cat.name}</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {cat.subCategories.map(subCat => (
                <button 
                  key={subCat._id} 
                  style={{ 
                    backgroundColor: subCat.color || '#808080', 
                    color: 'white', 
                    border: 'none', 
                    padding: '8px 12px', 
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  onClick={() => applyTreatment(cat, subCat)}
                  title={`Apply ${subCat.name}`}
                >
                  {subCat.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- العمود الأوسط: المخطط والنموذج --- */}
      <div style={{ flex: 1 }}>
        <form onSubmit={handleSubmit}>
          <h2>Create New Medical Case</h2>
          
          <div style={{ background: '#2c2c2c', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <DentalChart 
              selectedTeeth={selectedTeeth}
              onToothSelect={handleToothSelect}
              treatments={treatments}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label htmlFor="patientId">Patient</label>
              <select id="patientId" required value={patientId} onChange={e => setPatientId(e.target.value)} style={{ width: '100%', padding: '10px' }}>
                <option value="">Select a patient</option>
                {patients.map(p => (
                  <option key={p._id} value={p._id}>{p.fullName} (File: {p.fileNumber})</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="caseFile">Case File (STL/PLY)</label>
              <input id="caseFile" type="file" required onChange={e => setCaseFile(e.target.files[0])} style={{ width: '100%', padding: '8px' }} />
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <label htmlFor="generalComment">General Comment</label>
            <textarea id="generalComment" value={generalComment} onChange={e => setGeneralComment(e.target.value)} style={{ width: '100%', padding: '10px', minHeight: '80px' }} />
          </div>

          <div style={{ marginTop: '30px' }}>
            <button type="submit" disabled={isSubmitting} style={{ padding: '12px 25px', fontSize: '16px', cursor: 'pointer' }}>
              {isSubmitting ? 'Creating...' : 'Create Case'}
            </button>
            {serverError && <p style={{ color: 'red', marginTop: '15px' }}>{serverError}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCasePage;
