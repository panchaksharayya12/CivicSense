"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  CheckCircle2,
  AlertCircle,
  Search,
  Building,
  Loader2,
  Crosshair,
} from "lucide-react";

interface LocationPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  onLocationChange: (loc: {
    lat: number;
    lng: number;
    address: string;
    source: "gps" | "manual";
  }) => void;
}

const POPULAR_ZONES = [
  { name: "Koramangala 5th Block", lat: 12.9352, lng: 77.6245 },
  { name: "Indiranagar 12th Cross", lat: 12.9784, lng: 77.6408 },
  { name: "Jayanagar 4th Block", lat: 12.9298, lng: 77.5834 },
  { name: "MG Road Metro Junction", lat: 12.9756, lng: 77.6066 },
  { name: "HSR Layout Sector 1", lat: 12.9116, lng: 77.6389 },
  { name: "Whitefield Main Road", lat: 12.9698, lng: 77.7500 },
];

export function LocationPickerMap({
  initialLat = 12.9352,
  initialLng = 77.6245,
  initialAddress = "Near Main College Gate, 5th Block, Koramangala, Bengaluru",
  onLocationChange,
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const streetLayerRef = useRef<any>(null);
  const satelliteLayerRef = useRef<any>(null);

  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [address, setAddress] = useState<string>(initialAddress);
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");
  const [isDetecting, setIsDetecting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [manualInput, setManualInput] = useState(initialAddress);
  const [statusMessage, setStatusMessage] = useState<string | null>(
    "Auto-detecting exact location of reporter..."
  );
  const [gpsLocked, setGpsLocked] = useState(false);

  // Reverse Geocoding with real OpenStreetMap Nominatim
  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.address) {
          const a = data.address;
          const parts = [
            a.road || a.pedestrian || a.suburb,
            a.neighbourhood || a.residential || a.commercial,
            a.city_district || a.suburb,
            a.city || a.town || "Bengaluru",
            a.state,
            a.postcode,
          ].filter(Boolean);

          const formatted = Array.from(new Set(parts)).join(", ");
          if (formatted.length > 5) {
            setIsGeocoding(false);
            return formatted;
          }
        }
        if (data.display_name) {
          const shortName = data.display_name.split(",").slice(0, 4).join(",").trim();
          setIsGeocoding(false);
          return shortName;
        }
      }
    } catch (err) {
      console.warn("Reverse geocode fetch notice:", err);
    }
    setIsGeocoding(false);

    // Fallback to nearest landmark
    let closest = POPULAR_ZONES[0].name;
    let minDist = 999999;
    for (const z of POPULAR_ZONES) {
      const d = Math.hypot(z.lat - latitude, z.lng - longitude);
      if (d < minDist) {
        minDist = d;
        closest = `${z.name}, Bengaluru`;
      }
    }
    return closest;
  };

  // Initialize Real Leaflet Map
  useEffect(() => {
    let isMounted = true;

    if (typeof window === "undefined" || !mapContainerRef.current) return;

    // Dynamically import Leaflet in browser only
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Avoid re-initialization
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Create Custom Crisp Pin
      const pinIcon = L.divIcon({
        className: "leaflet-custom-marker",
        html: `
          <div style="position: relative; width: 36px; height: 44px; display: flex; flex-direction: column; align-items: center; cursor: grab;">
            <div style="
              width: 34px;
              height: 34px;
              background: linear-gradient(135deg, #ef4444, #dc2626);
              border: 3px solid #ffffff;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 14px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="width: 10px; height: 10px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
            </div>
            <div style="
              width: 14px;
              height: 4px;
              background: rgba(0,0,0,0.3);
              border-radius: 50%;
              margin-top: 2px;
              filter: blur(1px);
            "></div>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 40],
        popupAnchor: [0, -40],
      });

      // Create map
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
      });
      mapInstanceRef.current = map;

      // Add Zoom Control at top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Tile Layers
      const streetLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      );
      streetLayerRef.current = streetLayer;

      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "&copy; Esri World Imagery",
          maxZoom: 19,
        }
      );
      satelliteLayerRef.current = satelliteLayer;

      streetLayer.addTo(map);

      // Draggable Marker
      const marker = L.marker([lat, lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);
      markerRef.current = marker;

      // Handle Marker Drag
      marker.on("dragend", async () => {
        const position = marker.getLatLng();
        const newLat = position.lat;
        const newLng = position.lng;
        setLat(newLat);
        setLng(newLng);
        setGpsLocked(false);

        const newAddr = await reverseGeocode(newLat, newLng);
        setAddress(newAddr);
        setManualInput(newAddr);
        setStatusMessage(`Pin placed at: ${newAddr}`);
        onLocationChange({
          lat: newLat,
          lng: newLng,
          address: newAddr,
          source: "manual",
        });
      });

      // Handle Map Click to Reposition
      map.on("click", async (e: any) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        marker.setLatLng([clickLat, clickLng]);
        setLat(clickLat);
        setLng(clickLng);
        setGpsLocked(false);

        const newAddr = await reverseGeocode(clickLat, clickLng);
        setAddress(newAddr);
        setManualInput(newAddr);
        setStatusMessage(`Pin placed at: ${newAddr}`);
        onLocationChange({
          lat: clickLat,
          lng: clickLng,
          address: newAddr,
          source: "manual",
        });
      });

      // First priority: Auto-detect reporter's exact location immediately on mount!
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        setIsDetecting(true);
        setStatusMessage("Acquiring exact reporter GPS location...");
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            if (!isMounted) return;
            const curLat = pos.coords.latitude;
            const curLng = pos.coords.longitude;
            setLat(curLat);
            setLng(curLng);
            setGpsLocked(true);
            map.setView([curLat, curLng], 17, { animate: true });
            marker.setLatLng([curLat, curLng]);

            const exactAddr = await reverseGeocode(curLat, curLng);
            if (isMounted) {
              setAddress(exactAddr);
              setManualInput(exactAddr);
              setIsDetecting(false);
              setStatusMessage(`📍 Exact Reporter Location Detected: ${exactAddr}`);
              onLocationChange({
                lat: curLat,
                lng: curLng,
                address: exactAddr,
                source: "gps",
              });
            }
          },
          (err) => {
            console.warn("Auto GPS detection notice:", err.message);
            if (isMounted) {
              setIsDetecting(false);
              setStatusMessage(
                "Click anywhere on the street map or search below to pinpoint location."
              );
            }
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
      }

      // Force layout invalidation so tiles render fully
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Toggle Standard vs Satellite
  const toggleMapLayer = (type: "standard" | "satellite") => {
    setMapType(type);
    if (!mapInstanceRef.current) return;
    if (type === "satellite") {
      if (streetLayerRef.current) mapInstanceRef.current.removeLayer(streetLayerRef.current);
      if (satelliteLayerRef.current) satelliteLayerRef.current.addTo(mapInstanceRef.current);
    } else {
      if (satelliteLayerRef.current) mapInstanceRef.current.removeLayer(satelliteLayerRef.current);
      if (streetLayerRef.current) streetLayerRef.current.addTo(mapInstanceRef.current);
    }
  };

  // Jump to coordinate
  const panToLocation = (targetLat: number, targetLng: number, targetAddress?: string) => {
    setLat(targetLat);
    setLng(targetLng);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([targetLat, targetLng], 17, { animate: true });
    }
    if (markerRef.current) {
      markerRef.current.setLatLng([targetLat, targetLng]);
    }
    if (targetAddress) {
      setAddress(targetAddress);
      setManualInput(targetAddress);
      onLocationChange({
        lat: targetLat,
        lng: targetLng,
        address: targetAddress,
        source: "manual",
      });
    }
  };

  // Detect Current Browser GPS Location On-Demand
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage("Geolocation not supported by browser. Click anywhere on the map to pin.");
      return;
    }

    setIsDetecting(true);
    setStatusMessage("Locking onto your exact GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const curLat = pos.coords.latitude;
        const curLng = pos.coords.longitude;
        setIsDetecting(false);
        setGpsLocked(true);

        panToLocation(curLat, curLng);

        const readableAddr = await reverseGeocode(curLat, curLng);
        setAddress(readableAddr);
        setManualInput(readableAddr);
        setStatusMessage(`📍 Exact Reporter Location: ${readableAddr}`);
        onLocationChange({
          lat: curLat,
          lng: curLng,
          address: readableAddr,
          source: "gps",
        });
      },
      (err) => {
        setIsDetecting(false);
        setStatusMessage("GPS unavailable. You can search an address or click on the map to place the pin.");
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Search Address via OpenStreetMap Geocoding
  const handleSearchAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setStatusMessage(`Searching for "${searchQuery}"...`);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=1&addressdetails=1`,
        {
          headers: { "Accept-Language": "en" },
        }
      );

      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const item = results[0];
          const newLat = parseFloat(item.lat);
          const newLng = parseFloat(item.lon);
          panToLocation(newLat, newLng, item.display_name);
          setStatusMessage(`📍 Located: ${item.display_name.split(",").slice(0, 3).join(",")}`);
          setGpsLocked(false);
        } else {
          setStatusMessage(`No exact match for "${searchQuery}". Click on map or choose a sector shortcut.`);
        }
      }
    } catch (err) {
      console.warn("Search address error:", err);
      setStatusMessage("Could not complete address search. Please click on map.");
    } finally {
      setIsSearching(false);
    }
  };

  // Manual address edit
  const handleManualAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      setAddress(manualInput.trim());
      onLocationChange({
        lat,
        lng,
        address: manualInput.trim(),
        source: "manual",
      });
      setStatusMessage(`Address updated: ${manualInput.trim()}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Option 1: Exact Reporter Location GPS Card */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-cyan-50/60 border border-blue-200 rounded-3xl space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              gpsLocked
                ? "bg-emerald-600 text-white shadow-emerald-500/30"
                : "bg-blue-600 text-white shadow-blue-500/30"
            }`}>
              {gpsLocked ? <Crosshair className="w-5 h-5 animate-pulse" /> : <Navigation className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Exact Reporter Location
                </h4>
                {gpsLocked && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full border border-emerald-300">
                    GPS Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {gpsLocked
                  ? "Map is centered on your exact live device coordinates"
                  : "Auto-detecting your location or click to refresh"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${
              gpsLocked
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isDetecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Locating You...</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4" />
                <span>{gpsLocked ? "Re-Check My Location" : "Detect My Location"}</span>
              </>
            )}
          </button>
        </div>

        {/* Human-Readable Identified Location Card (Never shows raw numbers!) */}
        {address && (
          <div className="p-3.5 bg-white rounded-2xl border border-emerald-200/90 text-xs text-emerald-950 font-semibold flex items-center gap-3 shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="flex-1">
              <span className="text-[10px] text-emerald-700 font-bold block uppercase tracking-wider">
                Exact Problem Location Identified:
              </span>
              <span className="text-slate-900 font-bold text-xs sm:text-sm leading-snug">
                {isGeocoding ? "Resolving street details..." : address}
              </span>
            </div>
          </div>
        )}

        {statusMessage && (
          <div className="text-[11px] text-slate-600 font-medium px-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Address / Landmark Search Bar */}
      <form onSubmit={handleSearchAddress} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any street, area, or landmark (e.g. Indiranagar 100ft Road, MG Road, Whitefield)..."
            className="w-full text-xs sm:text-sm bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50"
        >
          {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          <span>Search Map</span>
        </button>
      </form>

      {/* Realistic Interactive Map Canvas (Leaflet with Real OpenStreetMap / Satellite Tiles) */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-600" />
            <span>Realistic City Map (Drag or click anywhere to position pin on exact road)</span>
          </span>

          {/* Standard / Satellite View Toggle */}
          <div className="flex items-center gap-1 self-end sm:self-auto bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => toggleMapLayer("standard")}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                mapType === "standard"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🗺️ Street Map
            </button>
            <button
              type="button"
              onClick={() => toggleMapLayer("satellite")}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                mapType === "satellite"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🛰️ Satellite View
            </button>
          </div>
        </div>

        {/* Real Leaflet Map Container */}
        <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-2 border-slate-300 shadow-md">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Map Tip Floating Badge */}
          <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-slate-200 text-[11px] font-bold text-slate-800 pointer-events-none flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span>Click any street or building to place pin</span>
          </div>
        </div>

        {/* Popular Municipal Sector Shortcuts */}
        <div className="pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Quick Sector Shortcuts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_ZONES.map((zone) => (
              <button
                key={zone.name}
                type="button"
                onClick={() => panToLocation(zone.lat, zone.lng, `${zone.name}, Bengaluru`)}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-medium transition-colors shadow-2xs"
              >
                📍 {zone.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Address Confirmation */}
      <form onSubmit={handleManualAddressSubmit} className="space-y-1.5 pt-2">
        <label className="block text-xs font-semibold text-slate-700">
          Or Edit / Confirm Problem Landmark Manually:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="e.g. Near Main College Gate, 5th Block, Koramangala, Bengaluru"
            className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shrink-0 shadow-xs"
          >
            Update Address
          </button>
        </div>
      </form>
    </div>
  );
}
