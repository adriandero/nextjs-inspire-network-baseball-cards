import { signUpHandler } from "next-auth-sanity";
import { client } from "@/lib/sanity/client";

export const POST = signUpHandler(client);
