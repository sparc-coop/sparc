// This file contains the JavaScript code that interacts with the PouchDB library, handling data storage and retrieval, as well as user interactions.

const localDb = new PouchDB("person");
const remoteDb = new PouchDB("https://localhost:7185/data/person");

let pending = [];

function addToList() {
    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const height = parseFloat(document.getElementById("height").value);

    if (!name || isNaN(age) || isNaN(height)) return;

    const id = crypto.randomUUID();
    pending.push({ _id: id, name, age, height });

    document.getElementById("person-form").reset();
    renderPending();
}

function renderPending() {
    const tbody = document.getElementById("pending-table");
    tbody.innerHTML = "";
    pending.forEach((person, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${person.name}</td>
      <td>${person.age}</td>
      <td>${person.height}</td>
      <td>
        <button onclick="removePending(${index})">Remover</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function removePending(index) {
    pending.splice(index, 1);
    renderPending();
}

async function saveAll() {
    if (pending.length === 0) return;

    // Debug: check for missing _id
    const missing = pending.filter(doc => !doc._id);
    if (missing.length > 0) {
        console.error("Some docs are missing _id:", missing);
        return;
    }

    console.log('saveAll pending', pending);
    await localDb.bulkDocs(pending);
    pending = [];
    renderPending();
    await loadLocal();
}

async function deletePerson(id, rev) {
    await localDb.remove(id, rev);
    await loadLocal();
}

async function loadLocal() {
    const result = await localDb.allDocs({ include_docs: true });
    const tbody = document.getElementById("local-table");
    tbody.innerHTML = "";
    result.rows.forEach(row => {
        const person = row.doc;
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${person.name}</td>
      <td>${person.age}</td>
      <td>${person.height}</td>
      <td>
        <button onclick='deletePerson("${person._id}", "${person._rev}")'>Excluir</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function syncNow() {
    localDb.sync(remoteDb, {
        live: false,
        retry: false
    }).on("complete", info => {
        console.log("Sync complete", info);
        loadLocal();
    }).on("error", err => {
        console.error("Sync error", err);
    });
}

loadLocal();