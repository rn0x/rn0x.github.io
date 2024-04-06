export default function error(config) {

    document.title = `لم يتم العثور على الصفحة - ${config.website_name}`;
    document.querySelector('meta[property="og:title"]').setAttribute('content', `لم يتم العثور على الصفحة 404 - ${config.website_name}`);
    document.querySelector('meta[property="og:site_name"]').setAttribute('content', config.website_name);
    document.querySelector('meta[name="keywords"]').setAttribute('content', ["صفحة غير موجودة", "خطأ 404", "لم يتم العثور على الصفحة", "صفحة غير موجودة", "الصفحة المطلوبة غير موجودة", "العثور على خطأ", "صفحة الخطأ", "404 خطأ", "صفحة غير موجودة", "الصفحة المطلوبة غير متاحة", "لم يتم العثور على المحتوى", "صفحة الخطأ 404", "خطأ في العثور على الصفحة", "صفحة الخطأ - 404", "الصفحة المطلوبة غير موجودة", "الصفحة المطلوبة غير متوفرة", "صفحة غير موجودة", "الصفحة المفقودة", "خطأ في العثور على الصفحة", "الصفحة المفقودة"
    ].join(", "));
    document.querySelector('meta[property="og:image"]').setAttribute('content', "/assets/icons/preview.jpg");
    document.querySelector('meta[property="og:description"]').setAttribute('content', "تهدف صفحة الخطأ 404 إلى توجيه المستخدم بشكل صحيح، حيث يمكن أن تحتوي على رسالة تفسر سبب الخطأ مثل 'الصفحة التي تبحث عنها غير موجودة' أو 'الصفحة المطلوبة غير قابلة للعرض'. يمكن أيضًا أن تضم روابط للعودة إلى الصفحة الرئيسية للموقع أو للبحث عن محتوى آخر.");
    document.querySelector('meta[name="description"]').setAttribute('content', "تهدف صفحة الخطأ 404 إلى توجيه المستخدم بشكل صحيح، حيث يمكن أن تحتوي على رسالة تفسر سبب الخطأ مثل 'الصفحة التي تبحث عنها غير موجودة' أو 'الصفحة المطلوبة غير قابلة للعرض'. يمكن أيضًا أن تضم روابط للعودة إلى الصفحة الرئيسية للموقع أو للبحث عن محتوى آخر.");
    history.pushState(null, '', window.location.pathname);

    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.href;
    document.head.appendChild(canonicalLink);

    const pageTitle = document.getElementById("pageTitle");
    pageTitle.innerText = "لم يتم العثور على الصفحة"


    const gotohome = document.getElementById("pageTitle");
    gotohome.addEventListener("click", () => {
        window.location.pathname = "/";
    });

    const backButton = document.getElementById("backButton");
    backButton.style.visibility = "visible";
    backButton.addEventListener("click", () => {
        window.location.pathname = "/";
    });

}