import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelDataViewer = () => {
  const [visitdata, setVisitdata] = useState([]);
  const [animaldata, setAnimaldata] = useState([]);

  useEffect(() => {
    const fetchVisitData = async () => {
      try {
        const res = await fetch("/data/visitdata.xlsx");
        const buf = await res.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        setVisitdata(XLSX.utils.sheet_to_json(ws));
      } catch (err) {
        console.error("Fejl ved hentning af visitdata:", err);
      }
    };

    const fetchAnimalData = async () => {
      try {
        const res = await fetch("/data/animaldata.xlsx");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const buf = await res.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        setAnimaldata(XLSX.utils.sheet_to_json(ws));
      } catch (err) {
        console.error("Fejl ved hentning af animaldata:", err);
      }
    };

    fetchVisitData();
    fetchAnimalData();
  }, []);

  return (
    <div>
      <h1>Excel Data Viewer</h1>

      <h2>Visit Data</h2>
      {visitdata.length === 0 ? (
        <p>Ingen besøgsdata fundet.</p>
      ) : (
        <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {Object.keys(visitdata[0]).map((key) => (
                <th key={key} style={{ background: '#f0f0f0', padding: '5px' }}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visitdata.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Animal Data</h2>
      {animaldata.length === 0 ? (
        <p>Ingen dyredata fundet.</p>
      ) : (
        <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {Object.keys(animaldata[0]).map((key) => (
                <th key={key} style={{ background: '#f0f0f0', padding: '5px' }}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {animaldata.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExcelDataViewer;
