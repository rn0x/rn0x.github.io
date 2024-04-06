import getPosts from '../utils/getPosts.js';

export default async function posts(config, getElapsedTime, fetchData, content, loading, marked, hljs) {


    // جلب بيانات المقالات بشكل غير متزامن
    const postsData = await fetchData("./posts.json", "json").catch((error) => {
        console.log(error);
    });


    /**
     * يقوم بتحديث شريط التنقل
     */
    function updateNavigationBar(title) {

        const iconHome = document.querySelector('.fa-house');
        iconHome.classList.replace('fa-solid', 'fa-regular');

        const iconDiscover = document.querySelector('.fa-compass');
        iconDiscover.classList.replace('fa-regular', 'fa-solid');

        const HomeEl = document.getElementById("home");
        const DiscoverEl = document.getElementById("discover");

        HomeEl.style.backgroundColor = "";
        DiscoverEl.style.backgroundColor = "var(--bottombarHover)";

        const pageTitle = document.getElementById("pageTitle");
        const backButton = document.getElementById("backButton");
        backButton.style.visibility = "visible";
        pageTitle.innerText = title;

        backButton.addEventListener("click", () => {
            window.location.pathname = "/discover.html";
        });
    }

    /**
     * يستخرج نوع العرض من عنوان الصفحة
     * @param parameter
     * @returns {object}
     */
    function getFromUrl(parameter) {
        const query = window.location.search.toLowerCase().trim();
        const urlParams = new URLSearchParams(query);
        return {
            parameter: urlParams.get(parameter),
            query: query,
        }
    }

    const id = decodeURIComponent(getFromUrl("id").parameter);
    const title = decodeURIComponent(getFromUrl("title").parameter.replace(/_/g, ' '));
    const POST = getPosts(postsData, title, Number(id));
    const posts_content = document.getElementById("posts_content");

    if (POST) {

        updateNavigationBar(POST.title);
        document.title = `${POST.title} - ${config.website_name}`;
        document.querySelector('meta[property="og:title"]').setAttribute('content', `${POST.title} - ${config.website_name}`);
        document.querySelector('meta[property="og:site_name"]').setAttribute('content', config.website_name);
        document.querySelector('meta[name="keywords"]').setAttribute('content', POST.tags.join(", "));
        document.querySelector('meta[property="og:image"]').setAttribute('content', POST.preview);
        document.querySelector('meta[property="og:description"]').setAttribute('content', POST.description);
        document.querySelector('meta[name="description"]').setAttribute('content', POST.description);
        const canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = window.location.href;
        document.head.appendChild(canonicalLink);

        const getContent = await fetchData(`${POST.file}`, "text").catch((error) => {
            console.log(error);
        });
        posts_content.innerHTML = marked(getContent);

        // يتم فتح الروابط الخارجية في تاب جديد
        const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="https"]');
        externalLinks.forEach(link => {
            link.setAttribute('target', '_blank');
        });

        // تنسيق الاكواد
        hljs.highlightAll();
    } else {
        window.location.pathname = "/error.html";
    }
    console.log(POST);

}

