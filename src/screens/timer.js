import { useState, useRef, useEffect } from "react";

//BURADA 15 SANIYE GERI SAYMA ISLEMINI BIR FONKSIYON HALINE GETIRIP YONETIMI BURADAN SAGLANDI
//DURDURMA RESETLEME BASLATMA GIBI BILGILERI BURADA YAPIP GAME EKRANINDA KULLANIYORUZ
export const useStopwatch = () => {
    const [started, setStarted] = useState(false);
    const [sn, setSn] = useState(15);

    const intervalRef = useRef();

    useEffect(() => {
        if(sn===0){
            setSn(0);
            setStarted(false);
        }
        if (started) {
            const id = setInterval(() => {
                setSn(time=>time-1);
            }, 1000);
            intervalRef.current = id;
        }
        return () => clearInterval(intervalRef.current);
    });
    return {
        sn,
        running: started,
        start: () => setStarted(true),
        pause: () => setStarted(false),
        stop: () => {
            setSn(15);
            setStarted(false);
        }
    };
};