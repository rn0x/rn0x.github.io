import getPostsByCategory from '../utils/getPostsByCategory.js';

export default async function discover(config, fetchData, content) {

    document.title = `اكتشف - ${config.website_name}`;
    document.querySelector('meta[property="og:title"]').setAttribute('content', `اكتشف - ${config.website_name}`);
    document.querySelector('meta[property="og:site_name"]').setAttribute('content', config.website_name);
    document.querySelector('meta[name="keywords"]').setAttribute('content', [].join(", "));
    document.querySelector('meta[property="og:image"]').setAttribute('content', "config.preview");
    document.querySelector('meta[property="og:description"]').setAttribute('content', "صفحة 'اكتشف' لاستكشاف مجموعة متنوعة من المقالات المثيرة والمفيدة في مدونتي.");
    document.querySelector('meta[name="description"]').setAttribute('content', "صفحة 'اكتشف' لاستكشاف مجموعة متنوعة من المقالات المثيرة والمفيدة في مدونتي.");
    history.pushState(null, '', window.location.pathname);
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.href;
    document.head.appendChild(canonicalLink);

    // يقوم بتحديث شريط التنقل
    updateNavigationBar();

    // جلب بيانات المقالات والفئات بشكل غير متزامن
    const postsData = await fetchData("./posts.json", "json").catch(handleError);
    const categoriesData = await fetchData("./categories.json", "json").catch(handleError);

    // إذا كانت هناك بيانات للفئات، يقوم بعرضها
    if (categoriesData && categoriesData.length !== 0) {
        renderCategories(categoriesData, postsData);
    } else {
        content.innerText = "لاتوجد تصنيفات :(";
    }

    /**
     * يقوم بتحديث شريط التنقل
     */
    function updateNavigationBar() {
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
        backButton.style.visibility = "hidden";
        pageTitle.innerText = "اكتشف";
    }

    /**
     * يقوم بمعالجة الخطأ وطباعته في وحدة التحكم
     * 
     * @param {Error} error - الخطأ الذي تم التقاطه
     */
    function handleError(error) {
        console.log(error);
    }

    function renderCategories(categoriesData, postsData) {
        const content = document.getElementById("content");
        const categoriesTitle = createCategoriesTitle();
        const ulElement = createCategoriesList(categoriesData, postsData);

        content.appendChild(categoriesTitle);
        content.appendChild(ulElement);
    }


    function createCategoriesTitle() {
        const categoriesTitle = document.createElement("h2");
        categoriesTitle.id = "categoriesTitle";
        categoriesTitle.innerText = "التصنيفات";
        return categoriesTitle;
    }

    function createCategoriesList(categoriesData, postsData) {
        const ulElement = document.createElement("ul");
        ulElement.id = "categories";

        for (const category of categoriesData) {
            const liElement = createCategoryElement(category, postsData);
            ulElement.appendChild(liElement);
        }

        return ulElement;
    }

    function createCategoryElement(category, postsData) {
        const liElement = document.createElement("li");
        liElement.className = "category_item";

        const linkElement = document.createElement("a");
        linkElement.className = "category_item_link";
        linkElement.href = `/category.html?name=${category.name.replace(/ /g, '_')}`;

        // إنشاء عنصر فقرة لعنوان التصنيف
        const pElement = document.createElement("p");
        pElement.textContent = category.name;

        // الحصول على المقالات في التصنيف
        const postsInCategory = getPostsByCategory(postsData, category.name);

        // إنشاء عنصر span لعرض عدد المقالات في التصنيف
        const spanElement = document.createElement("span");
        spanElement.className = "posts_count";
        spanElement.textContent = postsInCategory.length || 0;

        // إضافة العناصر إلى عنصر القائمة
        liElement.appendChild(linkElement);
        linkElement.appendChild(pElement);
        linkElement.appendChild(spanElement);

        // إضافة استماع النقر للتصنيف للتبديل إلى عرض مقالات التصنيف
        linkElement.addEventListener("click", () => {
            // window.location.href = `/category.html?name=${category.name.replace(/ /g, '_')}`
        });

        return liElement;
    }
}
