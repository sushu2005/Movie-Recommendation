from flask import Flask, jsonify
from recommendation import recommend_movies
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/recommend/<int:user_id>")
def recommend(user_id):
    movies = recommend_movies(user_id)
    return jsonify({"recommendations": movies})

if __name__ == "__main__":
    app.run(debug=True)
