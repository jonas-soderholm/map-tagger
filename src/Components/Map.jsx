import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSharedState } from "../SharedContext.jsx";
import Modal from "./Modal.jsx";

export const maxAmmountOfTags = 11;

export function DeleteMarker(markers, setMarker, index) {
  if (index >= 0 && index < markers.length) {
    markers[index].remove();
    const updatedMarkers = markers.filter((_, markerIndex) => markerIndex !== index);
    setMarker(updatedMarkers);
  }
}

const Map = React.memo(({ center, zoom, onAddMark }) => {
  // eslint-disable-next-line no-unused-vars
  const { markers, setMarkers } = useSharedState();
  const mapRef = useRef(null);
  const containerId = useRef(`map-${Date.now()}`);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [markerPosition, setMarkerPosition] = useState(null);
  const { markerIndex, setMarkerIndex } = useSharedState();

  const inputRef = useRef(null);

  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!mapRef.current && document.getElementById(containerId.current)) {
      mapRef.current = L.map(containerId.current).setView(center, zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
      mapRef.current.on("click", function (e) {
        setMarkerIndex((prevIndex) => {
          if (prevIndex < maxAmmountOfTags) {
            setIsModalOpen(true);
          }
          setMarkerPosition(e.latlng);
          return prevIndex;
        });
      });
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.off("click");
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom, setMarkerIndex]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (markerPosition) {
      const newIndex = markerIndex + 1;
      setMarkerIndex(newIndex);

      if (onAddMark) {
        onAddMark(markerIndex, modalContent);
      }

      const newMarker = L.marker([markerPosition.lat, markerPosition.lng], {
        icon: L.divIcon({
          className: "my-custom-marker body-font",
          html: `<div id="marker-${markerIndex}" style="display: flex; justify-content: center; align-items: 
          center; color: #e5e7eb; background-color: rgb(51 65 85); padding: 30px;
           font-size: 23px; border-radius: 100%; height: 100%; width: 100%; transform: 
           translateX(${-20}px) translateY(${-20}px);">${markerIndex}</div>`,
        }),
      }).addTo(mapRef.current);

      setMarkers((prevMarkers) => {
        const updatedMarkers = [...prevMarkers, newMarker];
        return updatedMarkers;
      });
      handleCloseModal();
      setModalContent("");
    }
  };

  return (
    <>
      <div id={containerId.current} style={{ height: "100%", width: "100%" }}></div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        content={modalContent}
        setContent={setModalContent}
      />
    </>
  );
});

export default Map;
