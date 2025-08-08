import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";

const youtube = google.youtube("v3");

// Function to convert a Web API stream into a Node.js Readable stream
function webStreamToNodeStream(
  webStream: ReadableStream<Uint8Array>
): Readable {
  const nodeStream = new Readable({
    read() {},
  });

  const reader = webStream.getReader();

  function pump() {
    reader
      .read()
      .then(({ done, value }) => {
        if (done) {
          nodeStream.push(null);
          return;
        }
        nodeStream.push(Buffer.from(value));
        pump();
      })
      .catch((err) => {
        nodeStream.emit("error", err);
      });
  }

  pump();
  return nodeStream;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    // *** FIX: Changed "file" to "video" to match the frontend ***
    const file: File | null = data.get("video") as unknown as File;
    const title: string | null = data.get("title") as string;
    const description: string | null = data.get("description") as string;

    if (!file) {
      return NextResponse.json(
        { message: "No video file uploaded." },
        { status: 400 }
      );
    }

    // Authenticate with Google
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );

    auth.setCredentials({
      refresh_token:
        "1//04bg2eoqPr3j7CgYIARAAGAQSNwF-L9IrpTF87iMVReulSEujRBO4h8rvzSEG0Ii1vJPTw54_rrUn3r5cjo9K5rKUbPAIGqYuDAk",
    });

    // Create a readable stream for the YouTube API
    const videoStream = webStreamToNodeStream(file.stream());

    // Upload the video
    const response = await youtube.videos.insert({
      auth: auth,
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: title || "A Video From My App",
          description:
            description || "This video was uploaded via my custom app.",
          tags: ["test", "upload"],
        },
        status: {
          privacyStatus: "private", // Can be "private", "public", or "unlisted"
        },
      },
      media: {
        mimeType: file.type,
        body: videoStream,
      },
    });

    const videoId = response.data.id;
    if (!videoId) {
      throw new Error("YouTube API did not return a video ID.");
    }
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    return NextResponse.json({ success: true, videoUrl }, { status: 200 });
  } catch (error: any) {
    console.error("YouTube upload failed:", error);
    // Provide a more specific error message if possible
    const errorMessage = error.response?.data?.error?.message || error.message;
    return NextResponse.json(
      { message: "Upload failed", error: errorMessage },
      { status: 500 }
    );
  }
}
