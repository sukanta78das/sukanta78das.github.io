const newsletters = [
    {
        issue: "Vol. 3, Issue 1",
        date: "January 2026",
        description: "Research highlights, journal publications, and conference activities.",
        file: "newsletters/k.pdf"
    },
    {
        issue: "Vol. 2, Issue 4",
        date: "December 2025",
        description: "Special issue on Cellular Automata and Complex Systems.",
        file: "newsletters/k.pdf"
    }
];

const tableBody = document.querySelector("#newsletterTable tbody");
const pdfViewer = document.getElementById("pdfViewer");

newsletters.forEach(nl => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${nl.issue}</td>
        <td>${nl.date}</td>
        <td>${nl.description}</td>
        <td class="text-center">
            <button class="btn btn-view btn-sm me-2"
                data-bs-toggle="modal"
                data-bs-target="#newsletterModal"
                onclick="openPDF('${nl.file}')">
                View
            </button>
            <a href="${nl.file}" target="_blank" class="btn btn-pdf btn-sm">
                PDF
            </a>
        </td>
    `;

    tableBody.appendChild(row);
});

function openPDF(file) {
    pdfViewer.src = file;
}
