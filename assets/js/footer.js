export default function footer(config) {
    const Home = document.getElementById("home");
    const Discover = document.getElementById("discover");
    const el_copyright = document.getElementById("copyright");
    el_copyright.innerHTML = config.copyright;
    const currentDateISO = new Date().toISOString();
    

    Home.addEventListener("click", async () => {
        window.location.pathname = "/";
    });

    Discover.addEventListener("click", async () => {
        window.location.pathname = "/discover.html";
    });
}
