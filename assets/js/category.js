import getPostsByCategory from '../utils/getPostsByCategory.js';

export default async function category(config, getElapsedTime, fetchData, content, loading) {

    // history.pushState(null, '', window.location.pathname);

    // جلب بيانات المقالات والفئات بشكل غير متزامن
    const postsData = await fetchData("./posts.json", "json").catch(handleError);
    const categoriesData = await fetchData("./categories.json", "json").catch(handleError);

    /**
     * يقوم بمعالجة الخطأ وطباعته في وحدة التحكم
     * 
     * @param {Error} error - الخطأ الذي تم التقاطه
     */
    function handleError(error) {
        console.log(error);
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


    const query = getFromUrl("name");
    const decodedString = decodeURIComponent(query.parameter);
    const postsInCategory = getPostsByCategory(postsData, decodedString.replace(/_/g, ' '));
    const foundCategory = categoriesData.find(category => category.name === decodedString.replace(/_/g, ' '));

    console.log(foundCategory);
    document.querySelector('meta[property="og:site_name"]').setAttribute('content', config.website_name);

    if (postsInCategory && postsInCategory?.length !== 0) {
        updateNavigationBar(`${decodedString.replace(/_/g, ' ')}`);
        document.title = `اكتشف - ${decodedString.replace(/_/g, ' ')}`;
        document.querySelector('meta[property="og:title"]').setAttribute('content', `اكتشف - ${decodedString.replace(/_/g, ' ')}`);
        document.querySelector('meta[name="keywords"]').setAttribute('content', foundCategory.keywords.join(", "));
        document.querySelector('meta[property="og:description"]').setAttribute('content', foundCategory.description);
        document.querySelector('meta[name="description"]').setAttribute('content', foundCategory.description);
        document.querySelector('meta[property="og:image"]').setAttribute('content', "config.preview");
        renderPosts(postsInCategory);
    } else {

        const isCategoryExist = categoriesData.some(category => category.name === decodedString.replace(/_/g, ' '));
        if (isCategoryExist) {
            updateNavigationBar(`${decodedString.replace(/_/g, ' ')}`);
            content.innerText = "لاتوجد مقالات =(";
            document.title = `اكتشف - ${decodedString.replace(/_/g, ' ')}`;
            document.querySelector('meta[property="og:title"]').setAttribute('content', `اكتشف - ${decodedString.replace(/_/g, ' ')}`);
            document.querySelector('meta[name="keywords"]').setAttribute('content', foundCategory.keywords.join(", "));
            document.querySelector('meta[property="og:description"]').setAttribute('content', foundCategory.description);
            document.querySelector('meta[name="description"]').setAttribute('content', foundCategory.description);
            document.querySelector('meta[property="og:image"]').setAttribute('content', "config.preview");
        } else {
            window.location.pathname = "/error.html";
        }

    }

    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.href;
    document.head.appendChild(canonicalLink);


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
     * يقوم بعرض المقالات
     * 
     * @param {Array} postsData - بيانات المقالات
     */
    async function renderPosts(postsData) {
        let displayedPosts = 0; // عدد المقالات التي تم عرضها بالفعل

        // إظهار رمز التحميل
        loading.style.display = "block";

        // ترتيب المقالات بحسب التاريخ
        const posts = postsData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // عرض أول 10 مقالات
        displayPosts(0, 10);
        displayedPosts = 10;

        // إخفاء رمز التحميل بعد الانتهاء
        loading.style.display = "none";

        /**
         * يقوم بعرض المقالات
         * 
         * @param {number} startIndex - مؤشر بداية العرض
         * @param {number} endIndex - مؤشر نهاية العرض
         */
        function displayPosts(startIndex, endIndex) {
            const lastPosts = document.createElement("ul");
            const more = document.createElement("button");
            lastPosts.id = "lastPosts";
            more.id = "more";
            more.innerText = "المزيد";

            for (let i = startIndex; i < endIndex && i < posts.length; i++) {
                const item = posts[i];
                const li = createPostElement(item);
                lastPosts.appendChild(li);
            }

            content.appendChild(lastPosts);
            content.appendChild(more);

            more.addEventListener("click", () => {
                // عرض 10 مقالات إضافية عند الضغط على زر المزيد
                const remainingPosts = posts.length - displayedPosts;
                if (remainingPosts > 0) {
                    loading.style.display = "block";
                    const nextBatch = Math.min(10, remainingPosts);
                    displayPosts(displayedPosts, displayedPosts + nextBatch);
                    displayedPosts += nextBatch;
                    loading.style.display = "none";
                } else {
                    // إذا لم يتبق مقالات لعرضها
                    loading.style.display = "block";
                    more.innerText = "لا توجد مقالات أخرى";
                    loading.style.display = "none";
                    setTimeout(() => {
                        more.style.display = "none";
                    }, 5000);
                }
            });
        }

        /**
         * يقوم بإنشاء عنصر لعرض المقالة
         * 
         * @param {Object} item - بيانات المقالة
         * @returns {HTMLElement} - عنصر HTML li يمثل المقالة
         */
        function createPostElement(item) {
            const li = document.createElement("li");
            const link = document.createElement("a");
            const preview = document.createElement("img");
            const post_info = document.createElement("div");
            const title = document.createElement("h2");
            const date = document.createElement("p");

            const qid = encodeURIComponent(item.id);
            const qtitle = encodeURIComponent(item.title.replace(/ /g, '_'));
            const pathname = `/posts.html?id=${qid}&title=${qtitle}`;
            link.className = "linkposts";
            link.href = pathname;

            preview.className = "preview";
            preview.src = item.preview;
            preview.alt = item.title;

            post_info.className = "post_info";

            title.innerText = item.title;
            title.className = "title";

            date.innerText = getElapsedTime(item.date);
            date.className = "date";

            li.appendChild(link);
            link.appendChild(preview);
            link.appendChild(post_info);
            post_info.appendChild(title);
            post_info.appendChild(date);

            return li;
        }
    }


}
