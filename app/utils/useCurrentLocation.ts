'use client';

import { useEffect, useState } from "react";

interface Coordinates {
    latitude: number;
    longitude: number;
}

export const useCurrentLocation = () => {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        if (!navigator.geolocation) {
            console.warn("Geolocation not supported.");
            setError("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("Got position:", position);
                if (isMounted) {
                    setCoordinates({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                if (isMounted) {
                    setError(err.message);
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );

        return () => {
            isMounted = false;
        };
    }, []);

    return { coordinates, error };
};
