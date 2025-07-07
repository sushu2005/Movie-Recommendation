import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# ✅ Absolute path to your dataset files
ratings = pd.read_csv('D:/Movie-Recommendation-System/backend/dataset/ml-100k/u.data', sep='\t', names=['user_id', 'movie_id', 'rating', 'timestamp'])
movies = pd.read_csv('D:/Movie-Recommendation-System/backend/dataset/ml-100k/u.item', sep='|', encoding='latin-1', header=None,
                     names=['movie_id', 'title'] + [f'col{i}' for i in range(22)])[['movie_id', 'title']]

# ✅ Create user-item matrix
user_movie_matrix = ratings.pivot_table(index='user_id', columns='movie_id', values='rating').fillna(0)

# ✅ Calculate similarity between users
similarity = cosine_similarity(user_movie_matrix)
similarity_df = pd.DataFrame(similarity, index=user_movie_matrix.index, columns=user_movie_matrix.index)

def recommend_movies(user_id, top_n=5):
    if user_id not in user_movie_matrix.index:
        return ["No data available for this user."]

    # ✅ Ratings of the user
    user_ratings = user_movie_matrix.loc[user_id]

    # ✅ Find similar users (exclude the current user)
    similar_users = similarity_df[user_id].sort_values(ascending=False)[1:11]  # Top 10 similar users

    # ✅ Weighted average of ratings from similar users
    weighted_ratings = user_movie_matrix.loc[similar_users.index].T.dot(similar_users)

    # ✅ Remove movies the user already rated
    already_rated = user_ratings[user_ratings > 0].index
    weighted_ratings = weighted_ratings.drop(index=already_rated, errors='ignore')

    # ✅ Top-N movie IDs
    top_movies = weighted_ratings.sort_values(ascending=False).head(top_n).index

    # ✅ Get titles
    recommended_titles = movies[movies['movie_id'].isin(top_movies)]['title'].tolist()

    return recommended_titles
