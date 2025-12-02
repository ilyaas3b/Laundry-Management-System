function saveJob() {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let service = document.getElementById("service").value;
    let price = document.getElementById("price").value;

    // Save to localStorage
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    jobs.push({
        name,
        phone,
        service,
        price
    });

    localStorage.setItem("jobs", JSON.stringify(jobs));

    alert("Xogta waa la keydiyey!");

    showJobs();
}

function showJobs() {
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    let output = document.getElementById("output");

    output.innerHTML = "";

    jobs.forEach((job, index) => {
        output.innerHTML += `
            <p>${index+1}. ${job.name} - ${job.phone} - ${job.service} - ${job.price}</p>
        `;
    });
}

window.onload = showJobs;
