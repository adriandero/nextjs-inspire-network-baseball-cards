import { User } from "next-auth";

export type SignUpPayload = {
  email: string;
  password: string;
  name?: string;
  image?: string;
} & Record<string, unknown>;

export const signUp = async (payload: SignUpPayload): Promise<User> => {
  const res = await fetch(process.env.BASE_URL + "/api/auth/signUp", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  if (!res.ok) {
    const isJson = res.headers
      .get("Content-Type")
      ?.includes("application/json");

    const data = isJson ? await res.json() : await res.text();

    throw new Error(typeof data === "object" ? JSON.stringify(data) : data);
  }

  const user = await res.json();

  return user;
};
