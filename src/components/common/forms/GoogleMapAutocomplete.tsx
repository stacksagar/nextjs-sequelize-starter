import React, { useCallback, useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "@/config/googleMap";
import { FiSearch } from "react-icons/fi";

interface GoogleMapAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  label?: string;
  height?: string;
  width?: string;
}

const defaultCenter = {
  lat: 6.5244, // Lagos
  lng: 3.3792,
};

const GoogleMapAutocomplete: React.FC<GoogleMapAutocompleteProps> = ({
  value,
  onChange,
  label = "Location",
  height = "200px",
  width = "100%",
}) => {
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    defaultValue: value,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
    setActiveIndex(-1);
  };

  const handleSelect = async (description: string) => {
    setValue(description, false);
    onChange(description);
    setSelectedAddress(description);
    clearSuggestions();
    setActiveIndex(-1);
    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      setSelected({ lat, lng });
      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng });
      }
    } catch (error) {
      // handle error
    }
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Keyboard navigation for dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (status !== "OK" || !data.length) return;
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev < data.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : data.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      handleSelect(data[activeIndex].description);
    }
  };

  if (loadError || (!isLoaded && !ready)) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
        Google Maps failed to load. Please check your API key and network
        connection.
      </div>
    );
  }

  return (
    <div style={{ width, position: "relative" }}>
      {label && (
        <label
          className="block text-sm font-medium mb-1"
          htmlFor="google-map-autocomplete-input"
        >
          {label}
        </label>
      )}
      <div className="relative mb-2">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <FiSearch size={18} />
        </span>
        <input
          id="google-map-autocomplete-input"
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={!ready}
          placeholder="Lagos, Nigeria"
          className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-gray-900 shadow-sm transition-all outline-none"
          autoComplete="off"
          required={false}
        />
        {status === "OK" && (
          <ul
            className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto z-50"
            style={{ top: "100%" }}
          >
            {data.map(({ place_id, description }, idx) => (
              <li
                key={place_id}
                onClick={() => handleSelect(description)}
                className={`px-4 py-2 cursor-pointer text-sm hover:bg-blue-50 transition-colors ${
                  idx === activeIndex ? "bg-blue-100 text-blue-700" : ""
                }`}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(-1)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSelect(description);
                }}
              >
                {description}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div
        style={{ width, height }}
        className="rounded-xl overflow-hidden border border-gray-200 shadow-md mt-2"
      >
        <GoogleMap
          mapContainerStyle={{ width: "100%", height }}
          center={selected || defaultCenter}
          zoom={selected ? 15 : 11}
          onLoad={onMapLoad}
        >
          {selected && <Marker position={selected} />}
        </GoogleMap>
      </div>
      {selectedAddress && (
        <div className="text-xs text-gray-500 mt-1">
          Selected: {selectedAddress}
        </div>
      )}
    </div>
  );
};

export default GoogleMapAutocomplete;
