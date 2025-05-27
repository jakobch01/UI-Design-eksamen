import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import FeedAlert from "../components/FeedAlert";

const WarningsPage = () => {
  const [pigs, setPigs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const minFeed = 1.5; // Minimum dagligt foder (kg)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loader
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
      } finally {
        setLoading(false); // Stop loader
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4B4B4B] px-4">
      {loading ? (
        <div className="flex flex-col items-center space-y-4 text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-lg">Indlæser advarsler...</p>
        </div>
      ) : alerts.length === 0 ? (
        <p className="text-green-500 text-xl">✅ Ingen advarsler fundet.</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center text-white">
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
