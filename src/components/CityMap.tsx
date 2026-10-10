"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Complaint, Incident } from "@/types";
import { Layers, MapPin, Eye, ExternalLink, X, Compass } from "lucide-react";

interface CityMapProps {
  complaints: Complaint[];
  incidents: Incident[];
  onSelectIncident?: (incident: Incident) => void;
  selectedIncidentId?: string;
  height?: string;
}

export function CityMap({
  complaints,
  incidents,
  onSelectIncident,
  selectedIncidentId,
  height = "520px",
}: CityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const streetLayerRef = useRef<any>(null);
  const satelliteLayerRef = useRef<any>(null);

  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");
  const [selectedItem, setSelectedItem] = useState<{
    type: "incident" | "complaint";
    data: any;
  } | null>(null);

  // Initialize Realistic Leaflet Map
  useEffect(() => {
    let isMounted = true;
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Remove existing instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default center: Bengaluru Central
      const defaultCenter: [number, number] = [12.9716, 77.5946];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: true,
      });

      // Realistic OpenStreetMap standard street tiles
      const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });

      // Realistic Esri World Imagery satellite tiles
      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          maxZoom: 18,
        }
      );

      streetLayer.addTo(map);
      streetLayerRef.current = streetLayer;
      satelliteLayerRef.current = satelliteLayer;
      mapInstanceRef.current = map;

      // Create LayerGroup for markers
      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;

      renderMarkers(L, map, markersGroup);

      // Invalidate map size after rendering in container
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
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

  // Update Markers whenever complaints or incidents change
  useEffect(() => {
    if (typeof window === "undefined" || !mapInstanceRef.current || !markersGroupRef.current) return;

    import("leaflet").then((L) => {
      if (!mapInstanceRef.current || !markersGroupRef.current) return;
      markersGroupRef.current.clearLayers();
      renderMarkers(L, mapInstanceRef.current, markersGroupRef.current);
    });
  }, [complaints, incidents]);

  // Handle selectedIncidentId change from outside
  useEffect(() => {
    if (selectedIncidentId) {
      const inc = incidents.find((i) => i.incident_id === selectedIncidentId);
      if (inc) {
        setSelectedItem({ type: "incident", data: inc });
        if (mapInstanceRef.current && inc.latitude && inc.longitude) {
          mapInstanceRef.current.setView([inc.latitude, inc.longitude], 14, {
            animate: true,
          });
        }
      }
    }
  }, [selectedIncidentId, incidents]);

  // Switch between Standard Streets and Satellite Imagery
  const handleToggleMapType = (type: "standard" | "satellite") => {
    setMapType(type);
    if (!mapInstanceRef.current || !streetLayerRef.current || !satelliteLayerRef.current) return;

    if (type === "standard") {
      mapInstanceRef.current.removeLayer(satelliteLayerRef.current);
      mapInstanceRef.current.addLayer(streetLayerRef.current);
    } else {
      mapInstanceRef.current.removeLayer(streetLayerRef.current);
      mapInstanceRef.current.addLayer(satelliteLayerRef.current);
    }
  };

  // Helper to Render Realistic Markers with Custom DivIcons
  const renderMarkers = (L: any, map: any, group: any) => {
    const latLngBounds: [number, number][] = [];

    // 1. Render Consolidated Incident Markers
    incidents.forEach((inc) => {
      const lat = inc.latitude || 12.9352;
      const lng = inc.longitude || 77.6245;

      const incidentIcon = L.divIcon({
        className: "custom-incident-marker",
        html: `
          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; inset: -4px; border-radius: 14px; background: rgba(99, 102, 241, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="
              width: 36px;
              height: 36px;
              background: linear-gradient(135deg, #4f46e5, #4338ca);
              border: 2.5px solid #ffffff;
              border-radius: 12px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              color: white;
              font-family: inherit;
              font-weight: 800;
              position: relative;
            ">
              <span style="font-size: 11px; line-height: 1;">★${inc.report_count || 1}</span>
              <div style="
                position: absolute;
                top: -6px;
                right: -6px;
                background: #ef4444;
                color: white;
                font-size: 8px;
                padding: 1px 4px;
                border-radius: 6px;
                font-weight: 800;
                border: 1px solid white;
              ">INC</div>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
      });

      const marker = L.marker([lat, lng], { icon: incidentIcon }).addTo(group);

      marker.on("click", () => {
        setSelectedItem({ type: "incident", data: inc });
        if (onSelectIncident) onSelectIncident(inc);
      });

      latLngBounds.push([lat, lng]);
    });

    // 2. Render Complaint Markers
    complaints.forEach((cmp) => {
      const lat = cmp.latitude || 12.9352;
      const lng = cmp.longitude || 77.6245;

      const isHigh = cmp.severity === "high" || cmp.severity === "critical";
      const isMed = cmp.severity === "medium";
      const color = isHigh ? "#ef4444" : isMed ? "#f59e0b" : "#3b82f6";

      const complaintIcon = L.divIcon({
        className: "custom-complaint-marker",
        html: `
          <div style="position: relative; width: 28px; height: 34px; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              width: 24px;
              height: 24px;
              background: ${color};
              border: 2.5px solid #ffffff;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 3px 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="width: 6px; height: 6px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
            </div>
            <div style="
              width: 8px;
              height: 3px;
              background: rgba(0,0,0,0.25);
              border-radius: 50%;
              margin-top: 1px;
            "></div>
          </div>
        `,
        iconSize: [28, 34],
        iconAnchor: [14, 30],
        popupAnchor: [0, -30],
      });

      const marker = L.marker([lat, lng], { icon: complaintIcon }).addTo(group);

      marker.on("click", () => {
        setSelectedItem({ type: "complaint", data: cmp });
      });

      latLngBounds.push([lat, lng]);
    });

    // Auto-fit bounds if we have coordinates
    if (latLngBounds.length > 0 && map) {
      try {
        const bounds = L.latLngBounds(latLngBounds);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      } catch (err) {
        console.warn("FitBounds error:", err);
      }
    }
  };

  return (
    <div
      style={{ height }}
      className="relative w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
    >
      {/* Real Leaflet Map Viewport */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Layer Switcher (Streets vs Satellite) */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 p-1 flex items-center gap-1">
        <button
          type="button"
          onClick={() => handleToggleMapType("standard")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapType === "standard"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Street Map</span>
        </button>
        <button
          type="button"
          onClick={() => handleToggleMapType("satellite")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapType === "satellite"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200 text-xs shadow-lg flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span className="text-slate-600 font-semibold text-[11px]">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-slate-600 font-semibold text-[11px]">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="text-slate-600 font-semibold text-[11px]">High / Critical</span>
        </div>
        <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
          <div className="w-4 h-4 rounded-md bg-indigo-600 text-[10px] text-white flex items-center justify-center font-bold">
            ★
          </div>
          <span className="text-indigo-900 font-bold text-[11px]">
            Consolidated Incident
          </span>
        </div>
      </div>

      {/* Selected Incident / Complaint Detail Floating Card */}
      {selectedItem && (
        <div className="absolute top-4 right-4 w-84 max-w-[90vw] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-4 z-20 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {selectedItem.type === "incident" ? "Consolidated Incident" : "Citizen Complaint"}
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                {selectedItem.type === "incident"
                  ? selectedItem.data.incident_id
                  : selectedItem.data.application_id}
              </h4>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedItem.type === "incident" ? (
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <p className="font-bold text-blue-700">{selectedItem.data.department}</p>
                <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-full font-bold text-[11px]">
                  ★ {selectedItem.data.report_count} Linked Reports
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Issue:</span>
                  <span className="font-semibold text-slate-800">{selectedItem.data.issue_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Severity:</span>
                  <span className="font-bold text-rose-600 uppercase">
                    {selectedItem.data.severity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-semibold text-blue-600 capitalize">
                    {selectedItem.data.status?.replace("_", " ")}
                  </span>
                </div>
                {selectedItem.data.address && (
                  <div className="flex justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-medium text-slate-700 text-right truncate max-w-[160px]">
                      {selectedItem.data.address}
                    </span>
                  </div>
                )}
              </div>

              {selectedItem.data.grouping_reason && (
                <p className="text-[11px] text-slate-500 italic bg-amber-50/70 p-2 rounded-xl border border-amber-200/60">
                  "{selectedItem.data.grouping_reason}"
                </p>
              )}

              <div className="pt-1">
                <Link
                  href={`/admin/incidents/${selectedItem.data.incident_id}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <span>View Consolidated Incident</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-800">{selectedItem.data.issue_type}</p>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                    selectedItem.data.severity === "high" || selectedItem.data.severity === "critical"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : selectedItem.data.severity === "medium"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {selectedItem.data.severity}
                </span>
              </div>

              <p className="text-slate-600 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                {selectedItem.data.address || "Bengaluru Municipal Area"}
              </p>

              {/* Show English Problem Statement if translated */}
              {selectedItem.data.description_normalized && (
                <div className="p-2 bg-blue-50/70 rounded-xl border border-blue-200 text-slate-700">
                  <span className="text-[10px] font-bold text-blue-800 uppercase block mb-0.5">
                    Problem Statement (English):
                  </span>
                  <p className="text-xs line-clamp-2">{selectedItem.data.description_normalized}</p>
                </div>
              )}

              <div className="pt-1">
                <Link
                  href={`/admin/complaints/${selectedItem.data.application_id}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors"
                >
                  <span>Open Official Complaint</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
