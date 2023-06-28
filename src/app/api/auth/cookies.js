import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { serialize } from "cookie";

export async function GetCookie({ cookiename }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(cookiename);
    if (token?.value) {
      // const decoded = verify(token.value, process.env.JWT_SECRET); //@todo cant verify this if its firebase. so we just send back cookie
      return new Response(token, { status: 200 });
    } else {
      return new Response("No Cookie", { status: 401 });
    }
  } catch (error) {
    console.error("Error getting cookie:", error);
    return new Response("Error getting cookie", { status: 500 });
  }
}

export async function SetCookie(cookie, cookiename) {
  try {
    const cookie_set = serialize(cookiename, cookie, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    console.log(cookie_set);
    return new Response("Cookie Set", {
      status: 200,
      headers: { "Set-Cookie": cookie_set },
    });
  } catch (error) {
    console.error("Error setting cookie:", error);
    return new Response("Error setting cookie", { status: 500 });
  }
}

export async function RemoveCookie({ cookiename }) {
  try {
    const cookieStore = cookies();
    console.log(cookiename);
    const cookie = cookieStore.get(cookiename);
    if (cookie?.value) {
      const delete_cookie = serialize(cookiename, "", {
        maxAge: -1,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      return new Response("Cleared", {
        status: 200,
        headers: { "Set-Cookie": delete_cookie },
      });
    } else {
      return new Response("No Cookie", { status: 401 });
    }
  } catch (error) {
    console.error("Error removing cookie:", error);
    return new Response("Error removing cookie", { status: 500 });
  }
}
