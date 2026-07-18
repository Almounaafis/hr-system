import { MapPin, Navigation, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormInput from "@/shared/forms/FormInput";
import { SectionHeader } from "./SectionHeader";
import { ToggleRow } from "./ToggleRow";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useFormContext } from "react-hook-form";

// Fix default marker icon paths (Leaflet + bundlers issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function LocationSettingsTab() {
  const { register, watch, setValue } = useFormContext();
  const [isMapOpen, setIsMapOpen] = useState(false);

  const locationName = watch("locationSettings.locationName");
  const radius = watch("locationSettings.radius");
  const latitude = watch("locationSettings.latitude");
  const longitude = watch("locationSettings.longitude");
  const verificationEnabled = watch("locationSettings.verificationEnabled");
  const blockOutsideRadius = watch("locationSettings.blockOutsideRadius");

  const handleOpenMap = () => {
    setIsMapOpen(true);
  };

  const handleSelectLocation = (lat, lng) => {
    setValue("locationSettings.latitude", lat.toString());
    setValue("locationSettings.longitude", lng.toString());
    setIsMapOpen(false);
  };

  return (
    <Card className="border-gray-100 max-w-3xl mx-auto">
      <CardContent className="p-5">
        <SectionHeader
          icon={MapPin}
          tone="purple"
          title="إعدادات الموقع"
          description="حدد الموقع الذي يسمح للموظفين بالتسجيل منه"
        />
        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            label="الموقع الرئيسي"
            name="locationSettings.locationName"
            type="text"
            register={register}
            value={locationName}
            className="mb-4"
          />

          <div className="mb-4">
            <label className="text-sm font-medium mb-1 block">نطاق التسجيل</label>
            <div className="relative">
              <input
                type="number"
                {...register("locationSettings.radius", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background pl-12"
                max={1000}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground">متر</span>
            </div>
          </div>
        </div>
       
        <div className="divide-y divide-gray-100">
          <ToggleRow
            label="تفعيل التحقق من الموقع"
            checked={verificationEnabled}
            onCheckedChange={(v) => setValue("locationSettings.verificationEnabled", v)}
          />
          <ToggleRow
            label="منع التسجيل خارج النطاق المحدد"
            checked={blockOutsideRadius}
            onCheckedChange={(v) => setValue("locationSettings.blockOutsideRadius", v)}
          />
        </div>

        <Button
          variant="outline"
          className="w-full text-sm md:text-lg mt-4 h-10 md:h-16 flex items-center justify-center gap-2 text-primary border-dashed border-primary/30 hover:bg-primary/5"
          onClick={handleOpenMap}
        >
          <MapPin className="w-4 h-4" />
          تحديد الموقع على الخريطة
        </Button>

        <MapPickerDialog
          open={isMapOpen}
          onOpenChange={setIsMapOpen}
          onSelectLocation={handleSelectLocation}
          currentLat={latitude}
          currentLng={longitude}
        />
      </CardContent>
    </Card>
  );
}

// Component that listens to map clicks and moves the marker
function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Recenter the map whenever selectedLat/Lng change from outside (e.g. GPS button)
function RecenterOnChange({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

function MapPickerDialog({ open, onOpenChange, onSelectLocation, currentLat, currentLng }) {
  const [selectedLat, setSelectedLat] = useState(Number(currentLat) || 24.7136);
  const [selectedLng, setSelectedLng] = useState(Number(currentLng) || 46.6753);
  const [locating, setLocating] = useState(false);
  const markerRef = useRef(null);

  // Reset to current saved location every time the dialog opens
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (open) {
      setSelectedLat(Number(currentLat) || 24.7136);
      setSelectedLng(Number(currentLng) || 46.6753);
    }
  }, [open, currentLat, currentLng]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handlePick = (lat, lng) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelectedLat(pos.coords.latitude);
        setSelectedLng(pos.coords.longitude);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleConfirm = () => {
    onSelectLocation(selectedLat, selectedLng);
  };

  // Allow dragging the marker directly
  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const { lat, lng } = marker.getLatLng();
        setSelectedLat(lat);
        setSelectedLng(lng);
      }
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>تحديد الموقع على الخريطة</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden border border-border">
              {open && (
                <MapContainer
                  center={[selectedLat, selectedLng]}
                  zoom={15}
                  className="w-full h-full"
                  scrollWheelZoom
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker
                    position={[selectedLat, selectedLng]}
                    draggable
                    eventHandlers={eventHandlers}
                    ref={markerRef}
                  />
                  <ClickHandler onPick={handlePick} />
                  <RecenterOnChange lat={selectedLat} lng={selectedLng} />
                </MapContainer>
              )}
            </div>

            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="absolute bottom-3 left-3 z-[1000] shadow-md gap-1"
              onClick={handleUseMyLocation}
              disabled={locating}
            >
              {locating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              موقعي الحالي
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            اضغط على الخريطة لتحديد الموقع، أو اسحب العلامة لضبطها بدقة
          </p>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button onClick={handleConfirm}>
              تأكيد الموقع
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}