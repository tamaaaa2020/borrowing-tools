import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const KEY = new TextEncoder().encode(process.env.JWT_SECRET || "secret123");

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(KEY);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, KEY, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function login(payload: any) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt(payload);

  (await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    path: "/",
  });
}

export async function logout() {
  (await cookies()).delete("session");
  redirect("/auth/login");
}
