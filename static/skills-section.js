async function fetchSkills() {
    try {
        const response = await fetch('http://localhost:3000/api/skills');
        const skillsData = await response.json();
        console.log("Fetched skills data:", skillsData);
        renderList(skillsData.skills, "skills-list");
        renderList(skillsData.learning, "learning-list");
    } catch (error) {
        console.error("Error fetching skills:", error);
    }
}

const renderList = (items, elementId) => {
    const list = document.getElementById(elementId);
    items.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("skill-item");
        const img = document.createElement("img");
        img.classList.add("skill-icon");
        img.src = item.icon;
        img.alt = item.name;
        li.appendChild(img);
        list.appendChild(li);
    });
};

fetchSkills();
