import os
import urllib.request
import urllib.error
from dotenv import load_dotenv
from groq import Groq
from youtube_transcript_api import YouTubeTranscriptApi

# Load the API key and optional proxy from .env
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
proxy_url = os.getenv("PROXY_URL") 

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
    """Fetch the transcript (tries standard API first, then falls back to public API)"""
    proxies = None
    if proxy_url:
        proxies = {
            "http": proxy_url,
            "https": proxy_url
        }

    # -- METHOD 1: Try standard API (with optional proxy) --
    try:
        fetched_transcript = YouTubeTranscriptApi.get_transcript(
            video_id, 
            languages=['en', 'hi', 'en-US'], 
            proxies=proxies
        )
        return " ".join([snippet.text for snippet in fetched_transcript])
    except Exception as e:
        print(f"Standard fetch failed: {e}. Trying fallback methods...")

    # -- METHOD 2: Try listing and picking first transcript --
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id, proxies=proxies)
        first_available = next(iter(transcript_list))
        fetched_transcript = first_available.fetch()
        return " ".join([snippet.text for snippet in fetched_transcript])
    except Exception as e:
        print(f"List transcripts fallback failed: {e}. Trying public API fallback...")

    # -- METHOD 3: Free Public API Fallboard (Works on Vercel without proxy!) --
    try:
        fallback_url = f"https://youtube-transcript.ai/transcript/{video_id}.txt"
        req = urllib.request.Request(
            fallback_url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        # 10 second timeout
        with urllib.request.urlopen(req, timeout=10) as response:
            html_content = response.read().decode('utf-8')
            # If we got a valid response (not blank)
            if html_content and len(html_content.strip()) > 50:
                return html_content.strip()
    except Exception as api_err:
        print(f"Public API fallback failed: {api_err}")

    # -- METHOD 4: Read local cookies.txt if available --
    if os.path.exists("cookies.txt"):
        try:
            fetched_transcript = YouTubeTranscriptApi.get_transcript(
                video_id, 
                languages=['en', 'hi', 'en-US'], 
                cookies="cookies.txt"
            )
            return " ".join([snippet.text for snippet in fetched_transcript])
        except Exception as cookie_err:
            print(f"Cookie fetch failed: {cookie_err}")

    # If all methods fail
    raise RuntimeError(
        "YouTube is blocking the cloud server's IP address. "
        "To fix this, please upload a 'cookies.txt' file, add a 'PROXY_URL' to Vercel, "
        "or run the application locally on your computer."
    )

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