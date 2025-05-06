import '../css/MovieCard.css'

function MovieCard({movie}) {
    function onLike() {
        alert("clicked");
    }

    return (
        <div className="movie-card">
            <div className="movie-poster">
                <img src={movie.url} alt={movie.title}/>
                <div>
                    <button className="favorite-btn" onClick={onLike}>
                        ♥
                    </button>
                </div>
                <div>
                    <h3>{movie.title}</h3>
                    <p>{movie.release_date}</p>
                </div>
            </div>
        </div>
    )
}

export default MovieCard