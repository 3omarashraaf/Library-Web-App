var navTabs = document.getElementsByClassName("nav-link")
var activeTabs = document.getElementsByClassName("active")
var homeActiveTabs = document.getElementsByClassName("text-white")

var url = window.location.href
const pieces = url.split(/[\s/]+/)
var dir = pieces[2]
switch (dir){
    case "books": dir = "Books";
                  break;
    case "movies": dir = "Movies";
                    break;  
    case "tvshows": dir = "Tv Shows";
                    break; 
    case "login": dir = "Login"
                  break;
    case "register": dir = "Register"
                  break;          
    case "" : dir = "Home";
             break;
    case "home" : dir = "Home";
              break;
    default: dir = "My Profile";
             break;                       
}
window.onload = ()=> {
    if(activeTabs[0]){
        activeTabs[0].classList.remove("active")
    }
    if(dir === "Home" || dir === "Login" || dir === "Register"){
        if(homeActiveTabs[0]){
            homeActiveTabs[0].classList.remove("text-white")
        }
    }
    for (let navTab of navTabs){
        if (navTab.textContent === dir){
            if(dir === "Login" || dir === "Register" || dir === "Home"){
                navTab.classList.add("text-white")
            }else{
                navTab.classList.add("active")
            }
        }
    }
}

