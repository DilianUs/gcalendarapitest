import { useSession, useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import { useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as React from 'react';
//import { useNavigate } from "react-router-dom";

function Login(){
    
    const [ start,setStart]= useState(dayjs());
    const [ end,setEnd]= useState(dayjs());
    const [ eventName,setEventName]= useState();
    const [ eventDescription,setEventDescription]= useState();


    const session = useSession();//tokens, when session exists we have user
    const supabase = useSupabaseClient();//talk to supabase
    const { isLoading} = useSessionContext();
    //const navigate = useNavigate();
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

     // Redirige al usuario cuando existe una sesión
    // if (session) {
      //  navigate('/events_form'); // Redirecciona al formulario
   // }

    async function CreateCalendarEvent(){
        console.log("creando evento");

        const event ={
            'summary': eventName,
            'description': eventDescription,
            'start':{
                'dateTime': start.toISOString(),
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            'end':{
                'dateTime': end.toISOString(),
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        }

        await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + session.provider_token
            },
            body: JSON.stringify(event)
        }).then((data )=>{
            return data.json();
        }).then((data)=>{
            console.log(data);
            alert("Evento creado, revisa tu GoogleCalendar");
        })

    }

    console.log(session || "No hay sesión activa");
    console.log(start);
    console.log(eventName);
    console.log(eventDescription);
    return(
        <div className="App">
           <div style={{width:"400px", margin:"30px auto"}}>
            {session ?

          
            <>
                <h2>Hola {session.user.email}</h2>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <p>Inicio de tu evento</p>
                    <DateTimePicker onChange={setStart} value={start}/>
                    <p>Final de tu evento</p>
                    <DateTimePicker onChange={setEnd} value={end}/>
                </LocalizationProvider>
                <p>Nombre del Evento</p>
                <input type="text" onChange={(e) => setEventName(e.target.value)} />
                <p>Descripcion</p>
                <input type="text" onChange={(e) => setEventDescription(e.target.value)} />
                <p></p>
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