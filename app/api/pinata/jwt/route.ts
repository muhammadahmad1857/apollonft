import { NextResponse } from "next/server";

const PINATA_JWT = process.env.PINATA_JWT || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZjYzNTg1Yy0yMTI3LTRlMjctOTI3NC1kOTE5MDUxMDgxNmEiLCJlbWFpbCI6ImFobWVkamF3YWQxODU3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5YjY5MmQyOWZhMjNkZmIxMGU4NyIsInNjb3BlZEtleVNlY3JldCI6IjlmNjFhODljOTMyYTAxN2Y0NzYwM2FjYWUwNDZlM2U0Mjc1NGMwMDdhZDIwMDYyOWI5MWRiZjBhYjgzMjc4OGYiLCJleHAiOjE3OTk1MDc1OTV9.gF3_YFbN9vGShSY4ca60UJeaK_O8CNmr2baJ4_VRS_c";

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

    if (!jwtResponse.ok) {
      const error = await jwtResponse.text();
      console.error("Pinata JWT generation error:", error);
      return NextResponse.json(
        { error: "Failed to generate signed JWT" },
        { status: 500 }
      );
    }

    const json = await jwtResponse.json();
    const { JWT } = json;

    return NextResponse.json({ JWT });
  } catch (e) {
    console.error("Error generating JWT:", e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

