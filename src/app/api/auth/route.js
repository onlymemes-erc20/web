import Auth from "./auth";
import { RemoveCookie, GetCookie } from "./cookies";

export async function POST(req, res) {
  const { action, ...data } = await req.json();
  try {
    let result;
    switch (action) {
      case "Logout":
        //remove auth cookie
        result = await RemoveCookie(data);
        break;

      case "Login":
        //check balance and set auth cookie
        result = await Auth(data);
        break;

      case "Page Load":
        //check for auth cookie
        result = await GetCookie(data);
        break;

      default:
        throw new Error("Invalid action");
    }

    return result;
  } catch (error) {
    return new Response(error.message, { status: 400 });
  }
}
