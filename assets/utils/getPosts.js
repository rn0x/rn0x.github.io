/**
 * احصل على مقالة بالاسم والمعرف
 * @param {Array} postsArray - مصفوفة المقالات
 * @param {string} title - عنوان المقال
 * @param {number} id - المعرف للمقال
 * @returns {Object|string} - المقالة المطابقة إذا وجدت، ورسالة خطأ إذا لم تُوجد
 */
export default function getPosts(postsArray, title, id) {
    try {
        if (!Array.isArray(postsArray) || typeof title !== 'string' || typeof id !== 'number') {
            console.log('يجب تمرير مصفوفة المقالات واسم المقال والمعرّف كمدخلات صحيحة');
            return false
        }

        const foundArticle = postsArray.find(article => article.title === title && article.id === id);

        if (!foundArticle) {
            console.log('المقالة غير موجودة');
            return false
        }

        return foundArticle;
    } catch (error) {
        console.log(error.message);
        return false
    }
}