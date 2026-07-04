from youtube_transcript_api import YouTubeTranscriptApi

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
    # Try English first, then Hindi, then just grab whatever is available
    try:
        fetched_transcript = ytt_api.fetch(video_id, languages=['en', 'hi'])
    except Exception:
        # If neither en nor hi works, list what's available and grab the first one
        transcript_list = ytt_api.list(video_id)
        first_available = next(iter(transcript_list))
        fetched_transcript = first_available.fetch()

    full_text = " ".join([snippet.text for snippet in fetched_transcript])
    return full_text

# ---- Main part ----
if __name__ == "__main__":
    url = input("Paste a YouTube video URL: ")
    video_id = get_video_id(url)
    print(f"\nVideo ID found: {video_id}\n")

    transcript = get_transcript(video_id)
    print("----- TRANSCRIPT -----\n")
    print(transcript)