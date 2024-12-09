import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function checkIfSession() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/auth/signin");
  }
}
