//this includes all the server action for the user to login and logout
"use server";
import {signIn, signOut} from "@/auth";



export const login = async () => { 
    await signIn("github", {redirectTo: "/"});
}


export const logout = async () => { 
        await signOut({redirectTo: "/auth/signin"});

}

