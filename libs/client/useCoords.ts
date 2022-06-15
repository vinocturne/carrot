import { useEffect, useState } from "react";

interface UseCoords {
    longitude: number | null;
    latitude: number | null;
}

export default function useCoords() {
    const [coords, setCoords] = useState<UseCoords>({
        latitude: null,
        longitude: null,
    });
    const onSuccess = ({
        coords: { latitude, longitude },
    }: GeolocationPosition) => {
        setCoords({ latitude, longitude });
    };
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(onSuccess);
    }, []);
    return coords;
}
