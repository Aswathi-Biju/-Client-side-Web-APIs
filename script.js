const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";

async function searchWord() {
    let word = document.getElementById("word-input").value.trim();
    if (!word) return alert("Please enter a word!");

    try {
        let response = await fetch(apiUrl + word);
        let data = await response.json();
        if (data.title) {
            document.getElementById("result").innerHTML = `<p>No results found for "<b>${word}</b>".</p>`;
            return;
        }

        let meaning = data[0].meanings[0].definitions[0].definition;
        let phonetics = data[0].phonetics[0]?.text || "N/A";
        let audio = data[0].phonetics[0]?.audio || "";
        let synonyms = data[0].meanings[0].synonyms?.slice(0, 5).join(", ") || "N/A";
        let antonyms = data[0].meanings[0].antonyms?.slice(0, 5).join(", ") || "N/A";

        let audioElement = audio ? `<audio controls><source src="${audio}" type="audio/mpeg">Your browser does not support audio.</audio>` : "";

        document.getElementById("result").innerHTML = `
            <h2>${word} <span>(${phonetics})</span></h2>
            ${audioElement}
            <p><b>Meaning:</b> ${meaning}</p>
            <p><b>Synonyms:</b> ${synonyms}</p>
            <p><b>Antonyms:</b> ${antonyms}</p>
        `;

        saveToHistory(word);
    } catch (error) {
        console.log(error);
        alert("Error fetching data. Try again.");
    }
}

function saveToHistory(word) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!history.includes(word)) {
        history.push(word);
        localStorage.setItem("searchHistory", JSON.stringify(history));
    }
    displayHistory();
}

function displayHistory() {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    let historyList = document.getElementById("history-list");
    historyList.innerHTML = "";
    history.forEach(word => {
        let li = document.createElement("li");
        li.innerText = word;
        li.onclick = () => {
            document.getElementById("word-input").value = word;
            searchWord();
        };
        historyList.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", displayHistory);

function clearHistory() {
    localStorage.removeItem("searchHistory");
    displayHistory();
}

function displayHistory() {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    let historyList = document.getElementById("history-list");
    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.innerHTML = "<p>No history available.</p>";
        return;
    }

    history.forEach(word => {
        let li = document.createElement("li");
        li.innerText = word;
        li.onclick = () => {
            document.getElementById("word-input").value = word;
            searchWord();
        };
        historyList.appendChild(li);
    });
}
