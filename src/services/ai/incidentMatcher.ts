import { db } from "@/lib/db";
import { CivicDomain, Incident } from "@/types";

interface IncidentMatchCandidate {
  category: CivicDomain;
  issue_type: string;
  description: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface MatchResult {
  incident_id: string;
  incident_title: string;
  similarityScore: number;
  distanceMeters?: number;
  reason: string;
}

// Calculate distance between two lat/lng in meters using Haversine formula
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Text similarity helper (Jaccard / word overlap)
function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(
    text1.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter((w) => w.length > 3)
  );
  const words2 = new Set(
    text2.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter((w) => w.length > 3)
  );

  if (words1.size === 0 || words2.size === 0) return 0;

  let intersection = 0;
  words1.forEach((w) => {
    if (words2.has(w)) intersection++;
  });

  const union = new Set([...Array.from(words1), ...Array.from(words2)]).size;
  return union === 0 ? 0 : Math.round((intersection / union) * 100);
}

export function findPossibleDuplicateIncident(
  candidate: IncidentMatchCandidate
): MatchResult | null {
  const incidents = db.getIncidents();
  let bestMatch: MatchResult | null = null;
  let highestScore = 0;

  for (const inc of incidents) {
    let score = 0;
    const reasons: string[] = [];

    // Category match
    if (inc.category === candidate.category) {
      score += 25;
      reasons.push(`Same domain (${inc.category})`);
    } else {
      continue; // Skip different domains
    }

    // Issue match
    if (
      inc.issue_type.toLowerCase() === (candidate.issue_type || "").toLowerCase() ||
      candidate.description.toLowerCase().includes(inc.issue_type.toLowerCase())
    ) {
      score += 25;
      reasons.push(`Matching issue type (${inc.issue_type})`);
    }

    // Distance calculation if GPS coords exist
    let distanceMeters: number | undefined;
    if (
      candidate.latitude &&
      candidate.longitude &&
      inc.latitude &&
      inc.longitude
    ) {
      distanceMeters = calculateDistanceMeters(
        candidate.latitude,
        candidate.longitude,
        inc.latitude,
        inc.longitude
      );

      if (distanceMeters <= 200) {
        score += 35;
        reasons.push(`Extremely close proximity (${distanceMeters}m away)`);
      } else if (distanceMeters <= 600) {
        score += 25;
        reasons.push(`In immediate vicinity (${distanceMeters}m away)`);
      } else if (distanceMeters <= 1500) {
        score += 15;
        reasons.push(`Same neighborhood sector (${distanceMeters}m away)`);
      }
    } else if (candidate.address && inc.address) {
      // Address token match
      const addressSimilarity = calculateTextSimilarity(
        candidate.address,
        inc.address
      );
      if (addressSimilarity > 40) {
        score += 25;
        reasons.push(`Matching address zone (${addressSimilarity}% match)`);
      }
    }

    // Text description similarity
    const textSim = calculateTextSimilarity(
      candidate.description,
      inc.title + " " + inc.grouping_reason
    );
    if (textSim > 20) {
      score += Math.min(20, Math.round(textSim * 0.4));
      reasons.push(`Semantic description overlap (${textSim}%)`);
    }

    // Only consider as match if score >= 65%
    if (score >= 65 && score > highestScore) {
      highestScore = score;
      bestMatch = {
        incident_id: inc.incident_id,
        incident_title: inc.title,
        similarityScore: Math.min(99, score),
        distanceMeters,
        reason: reasons.join(", "),
      };
    }
  }

  return bestMatch;
}
