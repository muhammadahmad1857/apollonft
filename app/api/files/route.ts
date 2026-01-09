import { createClient } from "@/lib/config/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const walletId = searchParams.get("walletId");

  if (!walletId) {
    return NextResponse.json(
      { error: "walletId is required" },
      { status: 400 }
    );
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("files")
    .select("type, ipfsUrl")
    .eq("wallet_id", walletId);
  if (error) {
    console.error("Error fetching files from Supabase:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json([]);
  }

  const files = data.map((file) => ({
    name: file.type || "Unkown",
    ipfs_url: file.ipfsUrl,
  }));

  return NextResponse.json(files);
}
