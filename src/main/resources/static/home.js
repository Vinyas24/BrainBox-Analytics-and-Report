window.onload = function() {
    loadPapers();
    loadPopular();
}

function loadPopular() {
    fetch('http://localhost:8080/api/papers/popular')
        .then(response => response.json())
        .then(data => displayPopular(data))
        .catch(error => console.error('Error fetching popular papers:', error));
}

function displayPopular(papers) {
    const popularList = document.getElementById('popularList');
    popularList.innerHTML = '';

    papers.forEach(paper => {
        const li = document.createElement('li');
        li.textContent = `${paper.title} (${paper.viewCount} views)`;

        li.onclick = function() {
            document.getElementById('searchInput').value = paper.title;
            searchPapers();
        }
        popularList.appendChild(li);
    });
}


function escapeAttr(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'")
        .replace(/"/g, '&quot;')
        .replace(/`/g, "\\`")
        .replace(/\n/g, "\\n");
}

function loadPapers() {
    fetch('http://localhost:8080/api/papers')
        .then(response => response.json())
        .then(data => displayPapers(data))
        .catch(error => console.error('Error fetching papers:', error));
}

function displayPapers(papers) {
    const papersList = document.getElementById('papersList');
    papersList.innerHTML = '';

    papers.forEach(paper => {
        const paperItem = document.createElement('div');
        paperItem.className = 'paper-item';

        paperItem.innerHTML = `
            <h3>${paper.title}</h3>
            <p>Views: ${paper.viewCount} | Edits: ${paper.editCount} | Contributor: ${paper.contributor}</p>
            <button onclick="readPaper(${paper.id})">Read</button>
            <button onclick="openModal(${paper.id}, '${escapeAttr(paper.content)}', '${escapeAttr(paper.contributor)}')">Edit</button>
        `;

        papersList.appendChild(paperItem);
    });
}

function searchPapers() {
    const keyword = document.getElementById('searchInput').value.trim();

    if (keyword === "") {
        loadPapers();
        return;
    }

    fetch(`http://localhost:8080/api/papers/search?keyword=${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(data => displayPapers(data))
        .catch(error => console.error('Error searching papers:', error));
}

function openModal(id, content, contributor) {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('editPaperId').value = id;
    document.getElementById('editContent').value = content.replace(/\\n/g, '\n');
    document.getElementById('editContributor').value = contributor;
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function saveEdit() {
    const id = document.getElementById('editPaperId').value;
    const content = document.getElementById('editContent').value;
    const contributor = document.getElementById('editContributor').value;

    const updatedPaper = { content: content, contributor: contributor };

    fetch(`http://localhost:8080/api/papers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPaper)
    })
        .then(response => response.json())
        .then(data => {
            alert('Paper updated successfully!');
            closeModal();
            loadPapers();
        })
        .catch(error => console.error('Error updating paper:', error));
}

// ✅ Read Modal functions
function readPaper(id) {
    fetch(`http://localhost:8080/api/papers/read/${id}`)
        .then(response => response.json())
        .then(paper => {
            const createdDate = paper.created_at ? new Date(paper.created_at).toLocaleString() : 'N/A';
            const updatedDate = paper.updated_at ? new Date(paper.updated_at).toLocaleString() : 'N/A';

            document.getElementById('readModalContent').innerHTML = `
    <h2 style="text-align:center;">${paper.title}</h2>
    <p style="text-align:center;"><strong>Author:</strong> ${paper.contributor}</p>
    <p style="text-align:center;"><strong>Created At:</strong> ${createdDate}</p>
    <p style="text-align:center;"><strong>Last Updated:</strong> ${updatedDate}</p>
    <hr>
    <div style="
        margin: 0 auto;
        padding: 15px;
        max-width: 700px;
        background: #1e1e1e;
        border-radius: 10px;
        color: #f0f0f0;
        font-family: Georgia, 'Times New Roman', serif;
        white-space: pre-wrap;
        line-height: 1.8;
        font-size: 1.1em;
        text-align: justify;
    ">
        ${paper.content}
    </div>
    <hr>
    <p style="text-align:center;"><small>Views: ${paper.viewCount} | Edits: ${paper.editCount}</small></p>
`;

            document.getElementById('readModal').style.display = 'block';
            loadPapers(); // reload to update view count
        })
        .catch(error => console.error('Error reading paper:', error));
}



function closeReadModal() {
    document.getElementById('readModal').style.display = 'none';
}

window.onclick = function(event) {
    const editModal = document.getElementById('editModal');
    const readModal = document.getElementById('readModal');
    if (event.target === editModal) {
        closeModal();
    }
    if (event.target === readModal) {
        closeReadModal();
    }
}
