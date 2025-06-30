// lib/shorten.ts

import axios from "axios";

const BITLY_API_TOKEN ="ff908a88e927bdf8c2ffe47229549c826aa6df90";

export const shortenWithBitly = async (longUrl: string): Promise<string | null> => {

  try {
    const response = await axios.post(
      "https://api-ssl.bitly.com/v4/shorten",
      {
        long_url: longUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${BITLY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.link;
  } catch (error) {
    console.error("Bitly shortening failed:", error);
    return null;
  }
};




export const shortenWithTinyURL = async (longUrl: string): Promise<string | null> => {
    try {
        const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        return response.data;
    } catch (err) {
        console.error("TinyURL error:", err);
        return null;
    }
};

