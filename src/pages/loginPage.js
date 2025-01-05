import { useSession, useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import { useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as React from 'react';
import utc from 'dayjs/plugin/utc';
import { useEffect } from 'react';

//import { useNavigate } from "react-router-dom";

function Login(){
    dayjs.extend(utc);  
 
    const [recurrenceEnd, setRecurrenceEnd]= useState(dayjs());


    const session = useSession();//tokens, when session exists we have user
    const supabase = useSupabaseClient();//talk to supabase
    const { isLoading} = useSessionContext();
    //const navigate = useNavigate();
    useEffect(() => {
        if (session) {
            const sessionStartTime = localStorage.getItem('sessionStartTime');
            const currentTime = Date.now();

            if (!sessionStartTime) {
                localStorage.setItem('sessionStartTime', currentTime);
            } else {
                const elapsedTime = currentTime - sessionStartTime;
                const oneHour = 300000;

                if (elapsedTime > oneHour) {
                    // Sesión ha expirado
                    supabase.auth.signOut();
                    localStorage.removeItem('sessionStartTime');
                    
                    // navigate('/');
                } else {
                    // Configurar timeout para cerrar sesión después de 1 hora
                    setTimeout(() => {
                        supabase.auth.signOut();
                        localStorage.removeItem('sessionStartTime');
                        
                        // navigate('/');
                    }, oneHour - elapsedTime);
                }
            }
        }
    }, [session, supabase]);
    if(isLoading){
        return <></>
    }


    async function googleSignIn() {


        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/calendar'
            }
        })

        if (error) {
            alert("Error al iniciar sesion con el proveedor de google en supabase");
            console.log(error);

        }
        
    }

    async function singOut() {
        await supabase.auth.signOut();
    }



async function CreateCalendarEvent(){
        console.log("creando evento");
      
    
    const events = [
        {
            summary: 'Reunión de Proyecto 1',
            description: 'Primera reunión del día.',
            start: '2024-12-30T10:00:00Z',
            end: '2024-12-30T11:00:00Z'
        },
        {
            summary: 'Reunión de Proyecto 2',
            description: 'Segunda reunión del día.',
            start: '2024-12-30T12:00:00Z',
            end: '2024-12-30T13:00:00Z'
        },
        {
            summary: 'Reunión de Proyecto 3',
            description: 'Tercera reunión del día.',
            start: '2024-12-30T14:00:00Z',
            end: '2024-12-30T15:00:00Z'
        }
    ];

    const formattedDate = dayjs(recurrenceEnd).utc().format('YYYYMMDDTHHmmss') + 'Z';

    for (const event of events) {
        const eventDetails = {
            'summary': event.summary,
            'description': event.description,
            'start': {
                'dateTime': event.start,
                'timeZone': 'UTC'
            },
            'end': {
                'dateTime': event.end,
                'timeZone': 'UTC'
            },
            'recurrence': [
                `RRULE:FREQ=WEEKLY;UNTIL=${formattedDate}`
            ]
        };

        await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + session.provider_token
            },
            body: JSON.stringify(eventDetails)
        }).then((data) => {
            return data.json();
        }).then((data) => {
            console.log(data);
        });
    }
    alert("Eventos creados, revisa tu Google Calendar");

}
   

    console.log(session || "No hay sesión activa");
    
 
    return(
        <div className="App">
           <div style={{width:"400px", margin:"30px auto"}}>
            {session ?

          
            <>
               <h2>Hola {session.user.email}</h2>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                
                    <p>Final de Recurrencia</p>
                    <DateTimePicker onChange={setRecurrenceEnd} value={recurrenceEnd}/>
                </LocalizationProvider>
                
                <button onClick={() =>CreateCalendarEvent()}>Crear evento</button>
                <p></p>
                <button onClick={() => singOut()}>Cerrar Sesion</button>
            </>
            :
            <>
                <button onClick={() => googleSignIn()}> Iniciar Sesion con Google </button>
            </>
            }
           </div>
        
        </div>
    );
}

export default Login;