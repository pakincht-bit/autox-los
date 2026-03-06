"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const iconRetinaUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png"
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"
const shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"

const markerIcon = typeof window !== "undefined" ? L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
}) : null

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng)
        },
    })
    return null
}

interface MapContentsProps {
    center: [number, number]
    zoom: number
    position: [number, number] | null
    onLocationSelect: (lat: number, lng: number) => void
}

export default function MapContents({
    center,
    zoom,
    position,
    onLocationSelect
}: MapContentsProps) {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents onLocationSelect={onLocationSelect} />
            {position && markerIcon && (
                <Marker position={position} icon={markerIcon} />
            )}
        </MapContainer>
    )
}
