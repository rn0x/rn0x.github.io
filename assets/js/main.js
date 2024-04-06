import fetchData from '../utils/fetchData.js';
import { marked } from "../utils/marked.esm.js";
import hljs from '../utils//highlight.min.js';
import footer from './footer.js';
import getElapsedTime from '../utils/getElapsedTime.js';
import home from './home.js';
import discover from './discover.js';
import category from './category.js';
import posts from './posts.js';
import error from './error.js';


// ملف التكوينات 
const config = await fetchData("./config.json", "json");
footer(config, fetchData);

const isTheme = localStorage.getItem('theme');
const htmlElement = document.documentElement;
htmlElement.setAttribute('data-theme', isTheme ? isTheme : "light");

const themeToggle = document.getElementById('themeToggle');
const iconElement = document.querySelector('#themeToggle i');
iconElement.className = isTheme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-lightbulb';
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    iconElement.className = newTheme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-lightbulb';
});


const content = document.getElementById("content"); // عنصر محتوى الصفحة
const logo = document.getElementById("logo");
const copyright = document.getElementById("copyright");
const loading = document.getElementById("loading");
const date = document.getElementById("date");

setInterval(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    date.innerText = formattedDate;
}, 1000);

copyright.innerHTML = config.copyright;

logo.addEventListener("click", async () => {
    // window.open(config.telegram, "_blank");
    window.location.pathname = "/";
});


// الصفحة الرئيسية

switch (window.location.pathname) {
    case "/":
    case "/index.html":
        await home(config, getElapsedTime, fetchData, content, loading);
        break;
    case "/discover.html":
        await discover(config, fetchData, content);
        break;
    case "/category.html":
        await category(config, getElapsedTime, fetchData, content, loading);
        break;
    case "/posts.html":
        await posts(config, getElapsedTime, fetchData, content, loading, marked, hljs);
        break;
    case "/error.html":
        error(config, getElapsedTime, fetchData, content, loading, marked, hljs);
        break;
    default:
        break;
}



// خاص بتنسيق الاكواد البرمجية