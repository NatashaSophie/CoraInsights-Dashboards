import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { kml as kmlToGeoJson } from '@tmcw/togeojson';
import 'leaflet/dist/leaflet.css';
import './TrailMap.css';

function toRad(value) {
  return (value * Math.PI) / 180;
}

function haversineDistance(a, b) {
  const lat1 = toRad(a[0]);
  const lon1 = toRad(a[1]);
  const lat2 = toRad(b[0]);
  const lon2 = toRad(b[1]);
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
}

function flattenLineStrings(geojson) {
  const lines = [];
  if (!geojson || !geojson.features) {
    return lines;
  }

  geojson.features.forEach(feature => {
    if (!feature.geometry) {
      return;
    }
    const { type, coordinates } = feature.geometry;
    if (type === 'LineString') {
      lines.push(coordinates.map(([lng, lat]) => [lat, lng]));
    }
    if (type === 'MultiLineString') {
      coordinates.forEach(line => {
        lines.push(line.map(([lng, lat]) => [lat, lng]));
      });
    }
  });

  return lines;
}

function computeTotals(lines) {
  let totalDistance = 0;
  const segments = [];

  lines.forEach(line => {
    for (let i = 1; i < line.length; i += 1) {
      const start = line[i - 1];
      const end = line[i];
      const distance = haversineDistance(start, end);
      segments.push({ start, end, distance });
      totalDistance += distance;
    }
  });

  return { totalDistance, segments };
}

function buildCompletedLine(segments, targetDistance) {
  const completed = [];
  let remaining = targetDistance;

  segments.forEach(segment => {
    if (remaining <= 0) {
      return;
    }

    if (completed.length === 0) {
      completed.push(segment.start);
    }

    if (segment.distance <= remaining) {
      completed.push(segment.end);
      remaining -= segment.distance;
      return;
    }

    const ratio = remaining / segment.distance;
    const lat = segment.start[0] + (segment.end[0] - segment.start[0]) * ratio;
    const lng = segment.start[1] + (segment.end[1] - segment.start[1]) * ratio;
    completed.push([lat, lng]);
    remaining = 0;
  });

  return completed;
}

const segmentColors = [
  '#2d9cdb',
  '#f2994a',
  '#27ae60',
  '#9b51e0',
  '#eb5757',
  '#56ccf2',
  '#f2c94c',
  '#6fcf97',
  '#bb6bd9',
  '#f7b2c4',
  '#219653',
  '#b96b00',
  '#2f80ed'
];

export function TrailMap({
  kmlUrl,
  completedCount = 0,
  totalCount = 13,
  segmentNames = [],
  checkpoints = [],
  markers = [],
  segmentStatus = [],
  segmentTooltips = []
}) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return undefined;
    }

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(map);

    const abortController = new AbortController();

    async function loadKml() {
      try {
        const kmlResponse = await fetch(kmlUrl, { signal: abortController.signal });
        const kmlText = await kmlResponse.text();
        const parsed = new DOMParser().parseFromString(kmlText, 'text/xml');
        const geojson = kmlToGeoJson(parsed);
        const lines = flattenLineStrings(geojson);

        if (!lines.length) {
          return;
        }

        if (layerGroupRef.current) {
          layerGroupRef.current.clearLayers();
        }

        const layerGroup = L.layerGroup().addTo(map);
        layerGroupRef.current = layerGroup;

        const { totalDistance, segments } = computeTotals(lines);
        const ratio = totalCount > 0
          ? Math.min(1, completedCount / totalCount)
          : 0;
        const completedDistance = totalDistance * ratio;
        const completedLine = buildCompletedLine(segments, completedDistance);

        const fullLine = L.polyline(lines, {
          color: '#b0b7c3',
          weight: 6,
          opacity: 0.8
        }).addTo(layerGroup);

        if (completedLine.length > 1) {
          L.polyline(completedLine, {
            color: '#2d9cdb',
            weight: 6,
            opacity: 0.95
          }).addTo(layerGroup);
        }

        const linePoints = lines.flat();
        const orderedCheckpoints = (checkpoints || []).filter(cp => Number.isFinite(cp.lat) && Number.isFinite(cp.lon));
        const indices = [];
        let lastIndex = 0;

        orderedCheckpoints.forEach(checkpoint => {
          let closest = lastIndex;
          let minDistance = Infinity;
          for (let i = lastIndex; i < linePoints.length; i += 1) {
            const distance = haversineDistance(linePoints[i], [checkpoint.lat, checkpoint.lon]);
            if (distance < minDistance) {
              minDistance = distance;
              closest = i;
            }
          }
          indices.push(closest);
          lastIndex = closest;
        });

        const segmentCount = Math.min(segmentNames.length, Math.max(0, indices.length - 1));
        for (let i = 0; i < segmentCount; i += 1) {
          const start = Math.max(0, Math.min(indices[i], linePoints.length - 1));
          const end = Math.max(start, Math.min(indices[i + 1], linePoints.length - 1));
          const segment = linePoints.slice(start, end + 1);
          if (segment.length < 2) {
            continue;
          }
          const isCompleted = segmentStatus[i]?.completed === true;
          const color = isCompleted ? segmentColors[i % segmentColors.length] : '#d0d5dd';
          const tooltipText = segmentTooltips[i]
            || (isCompleted
              ? (segmentNames[i] || `Trecho ${i + 1}`)
              : `${segmentNames[i] || `Trecho ${i + 1}`} - Nunca percorrido`);
          L.polyline(segment, {
            color,
            weight: 10,
            opacity: 0.85,
            interactive: true
          })
            .bindTooltip(tooltipText, { direction: 'top', sticky: true })
            .addTo(layerGroup);
        }

        orderedCheckpoints.forEach(checkpoint => {
          if (!Number.isFinite(checkpoint.lat) || !Number.isFinite(checkpoint.lon)) {
            return;
          }

          L.circleMarker([checkpoint.lat, checkpoint.lon], {
            radius: 6,
            color: '#1b6ca8',
            fillColor: '#2d9cdb',
            fillOpacity: 0.9,
            weight: 2
          })
            .bindTooltip(checkpoint.tooltip || checkpoint.name || 'Checkpoint', { direction: 'top', sticky: true })
            .addTo(layerGroup);
        });

        (markers || []).forEach(marker => {
          if (!Number.isFinite(marker.lat) || !Number.isFinite(marker.lon)) {
            return;
          }

          if (marker.iconUrl) {
            const icon = L.icon({
              iconUrl: marker.iconUrl,
              iconSize: marker.iconSize || [32, 32],
              iconAnchor: marker.iconAnchor || [16, 32]
            });
            L.marker([marker.lat, marker.lon], { icon })
              .bindTooltip(marker.tooltip || marker.name || 'Checkpoint', { direction: 'top', sticky: true })
              .addTo(layerGroup);
            return;
          }
        });

        map.fitBounds(fullLine.getBounds(), { padding: [20, 20] });
      } catch (error) {
        // ignore fetch aborts
        void error;
      }
    }

    loadKml();

    return () => {
      abortController.abort();
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
    };
  }, [kmlUrl, completedCount, totalCount, segmentNames]);

  return (
    <div className="trail-map" ref={containerRef} />
  );
}
