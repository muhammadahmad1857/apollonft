import { NextResponse } from "next/server";

const PINATA_JWT = process.env.PINATA_JWT;
const keyRestrictions = {
  keyName: "Signed Upload JWT",
  maxUses: 1,
  permissions: {
    endpoints: {
      data: {
        pinList: false,
        userPinnedDataTotal: false,
      },
      pinning: {
        pinFileToIPFS: true,
        pinJSONToIPFS: true,
        pinJobs: false,
        unpin: false,
        userPinPolicy: false,
      },
    },
  },
};

export async function POST() {
  try {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify(keyRestrictions),
    };

    const jwtResponse = await fetch(
      "https://api.pinata.cloud/users/generateApiKey",
      options
    );
    console.log("jwtResponse", jwtResponse);

    if (!jwtResponse.ok) {
      const error = await jwtResponse.text();
      console.log("Pinata JWT generation error:", error);
      return NextResponse.json(
        { error: "Failed to generate signed JWT" },
        { status: 500 }
      );
    }

    const json = await jwtResponse.json();
    console.log("json", json);
    const { JWT } = json;

    return NextResponse.json({ JWT });
  } catch (e) {
    console.log("Error generating JWT:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
