import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

export async function POST(request) {
  const requestBody = await request.text();
  const bodyJSON = JSON.parse(requestBody);
  const { name, userId, email, oldPassword, newPassword } = bodyJSON;

  try {
    let authToken;

    // Only attempt to verify the old password if a newPassword is provided
    if (newPassword) {
      const loginUrl = `${apiUrl}auth/local`;

      const loginResponse = await axios.post(loginUrl, {
        identifier: email,
        password: oldPassword,
      });

      // If the login is successful, proceed with updating the user details
      if (loginResponse.data.jwt) {
        authToken = loginResponse.data.jwt; // Use the new JWT for authorization
      } else {
        return new Response(
          JSON.stringify({ message: "The old password is incorrect" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    // Construct the URL for updating user details
    const updateUrl = `${apiUrl}users/${userId}`;
    const userData = {
      email,
      name: name, // Depending on your Strapi setup, this might be `username` or another field
    };

    // Include new password in the update if provided
    if (newPassword) {
      userData.password = newPassword;
    }

    // Authorization header is required only if changing the password
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    };
    if (authToken) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    // Make the request to update user details
    const updateResponse = await axios.put(updateUrl, userData, { headers });

    return new Response(
      JSON.stringify({
        message: "Success: User details updated",
        user: updateResponse.data,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
      }
    );
  } catch (error) {
    // Log the error
    console.error(
      "An error occurred:",
      error.response ? error.response : error.message
    );

    // Return a response indicating failure
    return new Response(
      JSON.stringify({
        message: "Failed to update user details",
        error: error.response ? error.response.data : error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
