import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";


export const {auth, handlers, signIn, signOut} = NextAuth({
    session: {
        // Remember who's logged in using a cookie in their browser,
        // so we don't have to check the database every time.
        strategy: "jwt",
    },
    providers: [GitHub],
    adapter: PrismaAdapter(prisma),
    callbacks: {

// When someone logs in, save their id and name onto their login pass
// so we can remember who they are on later visits.
        async jwt({token, user}) {
            if(user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },

// Take the id and name we saved and make them available to the rest
// of the app, so pages know who the logged-in user is.
        async session({session, token}) {
            if(session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    }

})
