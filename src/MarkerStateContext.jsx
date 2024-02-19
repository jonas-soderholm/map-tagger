import React, { createContext, useContext, useState } from "react";

const MarkerStateContext = createContext();

export const useSharedState = () => {
  return useContext(MarkerStateContext);
};

export const SharedStateProvider = ({ children }) => {
  const [markers, setMarkers] = useState([]);
  const [markerIndex, setMarkerIndex] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editButtonActive, setEditButtonActive] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [editIndex, setEditIndex] = useState(0);

  const updateValue = (newValue) => {
    setMarkers(newValue);
  };

  const updateMarkerIndex = (newIndex) => {
    setMarkerIndex(newIndex);
  };

  return (
    <MarkerStateContext.Provider
      value={{
        markers,
        updateValue,
        markerIndex,
        updateMarkerIndex,
        isModalOpen,
        setIsModalOpen,
        editButtonActive,
        setEditButtonActive,
        modalContent,
        setModalContent,
        editIndex,
        setEditIndex,
      }}
    >
      {children}
    </MarkerStateContext.Provider>
  );
};