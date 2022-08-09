var tabButtons = document.getElementsByClassName("tabButton")
var tabPanels = document.getElementsByClassName("tabPanel")

const showPanel =  panelIndex => {
    for(var button of tabButtons){
        button.classList.replace("btn-dark","btn-outline-dark")
    }
    tabButtons[panelIndex].classList.replace("btn-outline-dark","btn-dark")
    for(let panel of tabPanels){
        panel.style.display = "none";
    }
    tabPanels[panelIndex].style.backgroundColor = "";
    tabPanels[panelIndex].style.display = "block";
}