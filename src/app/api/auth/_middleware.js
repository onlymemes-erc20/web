//this middleware function will be used to maintain auth/security throughout the application
//so that no data fetching endpoint is compromised

// import { NextRequest, NextResponse } from "next/server";
// import { RemoveCookie, Auth } from "./your-server-functions";

// export default async function apiMiddleware(req, res) {
//   // Ensure the request is a POST request
//   if (req.method !== "POST") {
//     return NextResponse.next();
//   }

//   const { action, ...data } = await req.json();
//   try {
//     let result;
//     switch (action) {
//       case "Logout":
//         // when we logout we remove the cookie and set a logout cookie
//         result = await RemoveCookie(data);
//         break;

//       case "Login":
//         // when we login we check for a cookie and set an auth cookie
//         result = await Auth(data);
//         break;

//       case "OnLoad":
//         result = await GetCookie(data);

//       default:
//         throw new Error("Invalid action");
//     }

//     return new NextResponse(result.body, {
//       status: result.status,
//       headers: result.headers,
//     });
//   } catch (error) {
//     return new NextResponse(error.message, { status: 400 });
//   }
// }
