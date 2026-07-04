import os
from dotenv import load_dotenv
from groq import Groq
from youtube_transcript_api import YouTubeTranscriptApi

# Load the API key from .env
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

def get_video_id(url):
    """Extract the video ID from a YouTube URL"""
    if "v=" in url:
        return url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    else:
        raise ValueError("Could not find video ID in this URL")

def get_transcript(video_id):
    """Fetch the transcript for a given video ID"""
    ytt_api = YouTubeTranscriptApi()
    try:
        fetched_transcript = ytt_api.fetch(video_id, languages=['en', 'hi'])
    except Exception:
        transcript_list = ytt_api.list(video_id)
        first_available = next(iter(transcript_list))
        fetched_transcript = first_available.fetch()

    full_text = " ".join([snippet.text for snippet in fetched_transcript])
    return full_text

def summarize_text(transcript, category="general"):
    """Send transcript to Groq and get back a summary, tailored to the content type"""

    category_instructions = {
        "study": (
            "This is an educational/study video. Create detailed study notes:\n"
            "- Start with a 2-3 sentence overview of the topic\n"
            "- List key concepts as bullet points with brief explanations\n"
            "- Include any definitions, formulas, or important facts mentioned\n"
            "- End with a short 'Key Takeaways' section"
        ),
        "music": (
            "This is a music video. Instead of a literal summary:\n"
            "- Describe the overall mood/vibe of the song based on the lyrics\n"
            "- Mention any clear themes (love, heartbreak, motivation, etc.)\n"
            "- Note any repeated hooks or standout lines (without copying full lyrics)\n"
            "- Keep it short and vibe-focused, not a bullet-point breakdown"
        ),
        "general": (
            "Summarize this video in a clear, well-organized way:\n"
            "- Start with a 2-3 sentence overview\n"
            "- Then list the key points as bullet points\n"
            "- Keep it concise but informative"
        )
    }

    instructions = category_instructions.get(category, category_instructions["general"])

    prompt = (
        "You are a helpful assistant that summarizes YouTube video transcripts.\n\n"
        + instructions +
        "\n\nTranscript:\n" + transcript
    )

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# ---- Main part (only runs if you execute summarizer.py directly, not when imported) ----
if __name__ == "__main__":
    url = input("Paste a YouTube video URL: ")
    video_id = get_video_id(url)
    print(f"\nVideo ID found: {video_id}")

    print("Fetching transcript...")
    transcript = get_transcript(video_id)
    print("Transcript fetched! Sending to Groq for summary...\n")

    summary = summarize_text(transcript)
    print("----- SUMMARY -----\n")
    print(summary)