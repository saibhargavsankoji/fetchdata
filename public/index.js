const selectedItems = document.querySelectorAll(".select");
const backDrop = document.querySelector(".backDrop");
const subClass = document.querySelector(".subClass");
const inputId = document.getElementById("inputId");

let deleteId ;
let deleteJobTitle ;

selectedItems.forEach(item => {
    item.onclick = function (event) {
        const id = this.querySelector("template").content.querySelector("p").textContent;
        const skillName = this.querySelector(".skill p").textContent;
        this.classList.add("selected-item");
        backDrop.classList.add("backDrop-block");
        document.body.classList.add("stopScrolling");
        const template = this.querySelector(".usedTemplate").content;
        const tDiv = template.getElementById("usedByData");
        const appendedDiv = document.importNode(tDiv, true);
        subClass.insertAdjacentElement("beforeend", appendedDiv);
        const deleteBtn = document.getElementById("delete-button");
        if (this.classList.contains("selected-item")) {
            setInterval(() => {
                if (!document.body.classList.contains("stopScrolling")) {
                    this.classList.remove("selected-item");
                }
            }, 0.5);
        }
        const updateH2 = document.getElementById("updateH2");
        updateH2.textContent = skillName;
        const updateCName = document.getElementById("updateCName").textContent = `Change/Update Category of ${skillName} `;
        const updateSCName = document.getElementById("updateSCName").textContent =  `Change/Update Sub Category of ${skillName}`;
        inputId.setAttribute("value", id);

        deleteBtn.addEventListener("click", function (event) {
            deleteJobTitle  = this.closest("ul").children[0].textContent;
            document.getElementById("deletingJobTitle").setAttribute("value", deleteJobTitle);  
        });

    }
});


backDrop.addEventListener("click", function (event) {
    if (event.target.classList.contains("backDrop")) {
        backDrop.classList.remove("backDrop-block");
        document.body.classList.remove("stopScrolling");
        subClass.lastElementChild.innerHTML = ""
    }
})


