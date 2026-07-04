from flask import Flask, render_template, request
from summarizer import get_video_id, get_transcript, summarize_text

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():
    summary = None
    error = None
    selected_category = "general"

    if request.method == "POST":
        url = request.form.get("youtube_url")
        selected_category = request.form.get("category", "general")
        try:
            video_id = get_video_id(url)
            transcript = get_transcript(video_id)
            summary = summarize_text(transcript, category=selected_category)
        except Exception as e:
            error = str(e)

    return render_template("index.html", summary=summary, error=error, selected_category=selected_category)

if __name__ == "__main__":
    app.run(debug=True)