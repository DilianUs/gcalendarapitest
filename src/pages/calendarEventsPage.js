import { useSupabaseClient} from "@supabase/auth-helpers-react";

function EventForm(){
    const supabase = useSupabaseClient();
    async function singOut() {
        await supabase.auth.signOut();
    }
    return(
        <div className="App">
            <header className="App-header">
                <h1>Form</h1>
                <button onClick={() => singOut()}>Cerrar Sesion</button>
            </header>

        </div>
    );
}

export default EventForm;