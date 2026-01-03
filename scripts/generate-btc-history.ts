/**
 * Script to generate static historical Bitcoin price data
 * Uses CryptoCompare API (free, no rate limit for daily data)
 * 
 * Run with: npx tsx scripts/generate-btc-history.ts
 */

import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(__dirname, "../src/app/side-projects/btc-sentiment/_data");

interface DailyPrice {
  timestamp: number; // milliseconds
  price: number;
}

interface FearGreedPoint {
  timestamp: number; // milliseconds
  value: number;
  classification: string;
}

// Fetch BTC daily prices from CryptoCompare (free, full history)
async function fetchBtcHistory(): Promise<DailyPrice[]> {
  console.log("Fetching BTC price history from CryptoCompare...");
  
  // CryptoCompare histoday endpoint - free, returns up to 2000 days per call
  // We need to make multiple calls to get full history
  const allPrices: DailyPrice[] = [];
  let toTs = Math.floor(Date.now() / 1000);
  
  // Bitcoin started trading ~2010, but meaningful price data from ~2013
  // Fear & Greed index started Feb 2018, so let's get data from Jan 2018
  const startDate = new Date("2018-01-01").getTime() / 1000;
  
  while (toTs > startDate) {
    const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=2000&toTs=${toTs}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`CryptoCompare API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.Response !== "Success" || !data.Data?.Data) {
      console.error("API response:", data);
      throw new Error("Invalid response from CryptoCompare");
    }
    
    const prices = data.Data.Data
      .map((d: { time: number; close: number }) => ({
        timestamp: d.time * 1000, // Convert to milliseconds
        price: d.close,
      }))
      .filter((p: DailyPrice) => p.timestamp >= startDate * 1000);
    
    allPrices.unshift(...prices);
    
    // Move to earlier data
    const earliestTime = data.Data.Data[0]?.time;
    if (!earliestTime || earliestTime <= startDate) break;
    toTs = earliestTime - 86400; // One day before earliest
    
    console.log(`  Fetched ${prices.length} days, earliest: ${new Date(earliestTime * 1000).toISOString().split('T')[0]}`);
    
    // Small delay to be nice to the API
    await new Promise((r) => setTimeout(r, 300));
  }
  
  // Remove duplicates and sort
  const seen = new Set<number>();
  const unique = allPrices
    .filter((p) => {
      const day = new Date(p.timestamp).toISOString().split('T')[0];
      if (seen.has(p.timestamp)) return false;
      seen.add(p.timestamp);
      return true;
    })
    .sort((a, b) => a.timestamp - b.timestamp);
  
  console.log(`Total BTC prices: ${unique.length} days`);
  return unique;
}

// Fetch Fear & Greed history from Alternative.me (free, full history since Feb 2018)
async function fetchFearGreedHistory(): Promise<FearGreedPoint[]> {
  console.log("Fetching Fear & Greed history from Alternative.me...");
  
  // Alternative.me has ~2500 days of history (since Feb 2018)
  const response = await fetch("https://api.alternative.me/fng/?limit=3000&format=json");
  
  if (!response.ok) {
    throw new Error(`Alternative.me API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  const points: FearGreedPoint[] = data.data.map((d: { timestamp: string; value: string; value_classification: string }) => ({
    timestamp: parseInt(d.timestamp) * 1000,
    value: parseInt(d.value),
    classification: d.value_classification,
  }));
  
  // Sort oldest first
  points.sort((a, b) => a.timestamp - b.timestamp);
  
  console.log(`Total Fear & Greed points: ${points.length} days`);
  return points;
}

async function main() {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Fetch both datasets
    const [btcPrices, fearGreed] = await Promise.all([
      fetchBtcHistory(),
      fetchFearGreedHistory(),
    ]);
    
    // Save BTC prices
    const btcPath = path.join(OUTPUT_DIR, "btc-prices.json");
    fs.writeFileSync(btcPath, JSON.stringify(btcPrices, null, 2));
    console.log(`\nSaved BTC prices to: ${btcPath}`);
    
    // Save Fear & Greed
    const fgPath = path.join(OUTPUT_DIR, "fear-greed.json");
    fs.writeFileSync(fgPath, JSON.stringify(fearGreed, null, 2));
    console.log(`Saved Fear & Greed to: ${fgPath}`);
    
    // Print date ranges
    const btcStart = new Date(btcPrices[0].timestamp).toISOString().split('T')[0];
    const btcEnd = new Date(btcPrices[btcPrices.length - 1].timestamp).toISOString().split('T')[0];
    const fgStart = new Date(fearGreed[0].timestamp).toISOString().split('T')[0];
    const fgEnd = new Date(fearGreed[fearGreed.length - 1].timestamp).toISOString().split('T')[0];
    
    console.log(`\nBTC price range: ${btcStart} to ${btcEnd}`);
    console.log(`Fear & Greed range: ${fgStart} to ${fgEnd}`);
    console.log("\nDone! Static data files generated.");
    
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();

