/********************************************************************************* 
 * WEB422 – Assignment 2 
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source 
 * (including web sites) or distributed to other students. 
 * 
 * Name: Your Name Student ID: Your ID Date:   
 ********************************************************************************/

let page = 1;
const perPage = 10;

function loadMovieData(title = null) {
    let url = `/api/movies?page=${page}&perPage=${perPage}`;
    if (title) {
        url += `&title=${title}`;
        page = 1;
        document.querySelector(".pagination").classList.add("d-none");
    } else {
        document.querySelector(".pagination").classList.remove("d-none");
    }

    fetch(url)
        .then(response => response.json())
        .then(movies => {
            const tableBody = document.querySelector("#moviesTable tbody");
            tableBody.innerHTML = movies.map(movie => `
                <tr data-id="${movie._id}">
                    <td>${movie.year}</td>
                    <td>${movie.title}</td>
                    <td>${movie.plot || "N/A"}</td>
                    <td>${movie.rated || "N/A"}</td>
                    <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
                </tr>
            `).join("");

            document.querySelector("#current-page").textContent = page;

            document.querySelectorAll("#moviesTable tbody tr").forEach(row => {
                row.addEventListener("click", () => {
                    const movieId = row.getAttribute("data-id");
                    fetch(`/api/movies/${movieId}`)
                        .then(response => response.json())
                        .then(movie => {
                            document.querySelector("#detailsModalLabel").textContent = movie.title;
                            document.querySelector("#detailsModal .modal-body").innerHTML = `
                                <img class="img-fluid w-100" src="${movie.poster || ''}"><br><br>
                                <strong>Directed By:</strong> ${movie.directors.join(", ")}<br><br>
                                <p>${movie.fullplot}</p>
                                <strong>Cast:</strong> ${movie.cast ? movie.cast.join(", ") : "N/A"}<br><br>
                                <strong>Awards:</strong> ${movie.awards.text}<br>
                                <strong>IMDB Rating:</strong> ${movie.imdb.rating} (${movie.imdb.votes} votes)
                            `;
                            new bootstrap.Modal(document.querySelector("#detailsModal")).show();
                        });
                });
            });
        });
}

document.addEventListener("DOMContentLoaded", () => {
    loadMovieData();

    document.querySelector("#previous-page").addEventListener("click", () => {
        if (page > 1) {
            page--;
            loadMovieData();
        }
    });

    document.querySelector("#next-page").addEventListener("click", () => {
        page++;
        loadMovieData();
    });

    document.querySelector("#searchForm").addEventListener("submit", event => {
        event.preventDefault();
        const title = document.querySelector("#title").value.trim();
        loadMovieData(title);
    });

    document.querySelector("#clearForm").addEventListener("click", () => {
        document.querySelector("#title").value = "";
        loadMovieData();
    });
});