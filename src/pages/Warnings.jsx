import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import FeedAlert from "../components/FeedAlert";

const WarningsPage = () => {
  const [pigs, setPigs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const minFeed = 1; // Minimum dagligt foder (kg)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Henter data fra Excel...");
        const response = await fetch("/data/animaldata.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Beregn gennemsnitligt dagligt foderforbrug
        const processed = jsonData.map(pig => {
          const totalFeed = parseFloat(pig["Total feed intake (kg)"]) || 0;
          const days = parseFloat(pig["Completed days in test"]) || 1;
          const avgFeedPerDay = totalFeed / days;

          return {
            ...pig,
            avgFeedPerDay,
          };
        });

        setPigs(processed);

        const warnings = processed.filter(pig => pig.avgFeedPerDay < minFeed);
        setAlerts(warnings);
      } catch (error) {
        console.error("Fejl ved indlæsning af Excel:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Advarsler</h1>
      {alerts.length === 0 ? (
        <p className="text-green-500">Ingen advarsler fundet.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {alerts.map((pig, index) => (
            <FeedAlert
            key={pig.Number || `${pig.Location}-${index}`}
            pigId={pig.Number || "Ukendt"}
            stable={pig.Location || "Ukendt"}
              onClose={() =>
                setAlerts(alerts.filter(alert => alert !== pig))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WarningsPage;
