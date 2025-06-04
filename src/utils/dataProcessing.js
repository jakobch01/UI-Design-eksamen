import * as XLSX from "xlsx";

/**
 * Reads an XLSX file blob and returns parsed JSON arrays
 * of sheets "Animal data" and "Visit data".
 */
export async function parseExcelFile(fileBlob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "binary" });
        const animalData = XLSX.utils.sheet_to_json(
          wb.Sheets["Animal data"] || {}
        );
        const visitData = XLSX.utils.sheet_to_json(
          wb.Sheets["Visit data"] || {}
        );
        resolve({ animalData, visitData });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(fileBlob);
  });
}

/**
 * Keep only animals with a positive weight gain
 * and non‐negative days in test.
 */
export function filterValidAnimals(animalData) {
  return animalData.filter((a) => {
    const weightGain = parseFloat(a["Weight gain (kg)"]) || 0;
    const daysInTest = parseFloat(a["Completed days in test"]) || 0;
    return weightGain > 0 && daysInTest >= 0;
  });
}

/** Returns the count of valid animals. */
export function calculateNumberOfPigs(validAnimals) {
  return validAnimals.length;
}

/**
 * Returns an array of underfed pigs (gainPerDay < threshold).
 * Each object has responder, location, totalFeed, weightGain, gainPerDay.
 */
export function getUnderfedPigs(validAnimals, visitData) {
  const underfedThreshold = 0.5;
  return validAnimals
    .map((animal) => {
      const responder = animal["Responder"];
      const location = animal["Location"] || "Unknown";
      const weightGain = parseFloat(animal["Weight gain (kg)"]) || 0;
      const daysInTest = parseFloat(animal["Completed days in test"]) || 1;

      const visits = visitData.filter(
        (v) => v["Responder"] === responder
      );
      const totalFeed = visits.reduce(
        (sum, v) => sum + (parseFloat(v["Feed amount (g)"]) || 0),
        0
      );
      const gainPerDay = weightGain / daysInTest;

      return {
        responder,
        location,
        totalFeed: totalFeed.toFixed(2),
        weightGain: weightGain.toFixed(2),
        gainPerDay,
      };
    })
    .filter((pig) => pig.gainPerDay < underfedThreshold);
}

/**
 * Returns an array of { location, efficiency } where
 * efficiency = totalFeed / totalWeightGain (or 0 if weightGain === 0).
 */
export function getFeedEfficiencyByLocation(
  validAnimals,
  visitData
) {
  const efficiencyByLocation = {};

  validAnimals.forEach((animal) => {
    const location = animal["Location"] || "Unknown";
    const weightGain = parseFloat(animal["Weight gain (kg)"]) || 0;

    const visits = visitData.filter(
      (v) => v["Responder"] === animal["Responder"]
    );
    const totalFeed = visits.reduce(
      (sum, v) => sum + (parseFloat(v["Feed amount (g)"]) || 0),
      0
    );

    if (!efficiencyByLocation[location]) {
      efficiencyByLocation[location] = {
        totalFeed: 0,
        totalWeightGain: 0,
      };
    }

    efficiencyByLocation[location].totalFeed += totalFeed;
    efficiencyByLocation[location].totalWeightGain += weightGain;
  });

  return Object.entries(efficiencyByLocation).map(
    ([location, vals]) => ({
      location,
      efficiency:
        vals.totalWeightGain > 0
          ? vals.totalFeed / vals.totalWeightGain
          : 0,
    })
  );
}

/**
 * Returns an array of { date, value } where value is
 * average feed intake per pig on that date.
 */
export function getAverageFeedIntakePerDay(
  validAnimals,
  visitData
) {
  const feedByDate = {};

  visitData.forEach((visit) => {
    const responder = visit["Responder"];
    const animal = validAnimals.find(
      (a) => a["Responder"] === responder
    );
    if (!animal) return;

    // Convert Excel date to JS date if necessary
    const excelDate = visit.Date;
    const jsDate =
      typeof excelDate === "number"
        ? new Date((excelDate - 25569) * 86400 * 1000)
        : new Date(excelDate);

    const dateKey = jsDate.toISOString().split("T")[0];
    const feedAmt = parseFloat(visit["Feed amount (g)"]) || 0;

    if (!feedByDate[dateKey]) {
      feedByDate[dateKey] = { totalFeed: 0, count: 0 };
    }
    feedByDate[dateKey].totalFeed += feedAmt;
    feedByDate[dateKey].count += 1;
  });

  return Object.entries(feedByDate).map(([date, vals]) => ({
    date,
    value: vals.count ? vals.totalFeed / vals.count : 0,
  }));
}
