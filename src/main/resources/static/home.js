window.onload = loadPapers;

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
      <p>Views: ${paper.view_count} | Edits: ${paper.edit_count} | Contributor: ${paper.contributor}</p>
      <button onclick="openModal(${paper.id}, \`${paper.content.replace(/`/g, "\\`")}\`, \`${paper.contributor.replace(/`/g, "\\`")}\`)">Edit</button>
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

// Modal functions
function openModal(id, content, contributor) {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('editPaperId').value = id;
    document.getElementById('editContent').value = content;
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

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
}
