/**
 * تقوم بتصفية المقالات بناءً على فئة محددة وإرجاع المقالات التي تنتمي إليها.
 * @param {Array} posts - مصفوفة من المقالات.
 * @param {string} category - اسم الفئة التي تريد البحث عنها.
 * @returns {Array} - المقالات التي تنتمي إلى الفئة المحددة.
 * @throws {Error} - إذا كان إدخال غير صالح (مثل مصفوفة المقالات غير موجودة أو اسم الفئة غير موجود).
 * @example
 * const category = "fffffff"; // اسم الفئة التي تريد البحث عنها
 * const PostsInCategory = getPostsByCategory(posts, category);
*/
export default function getPostsByCategory(posts, category) {
    try {
        if (!Array.isArray(posts) || typeof category !== 'string') {
            throw new Error('Invalid input. Please provide an array of postsd and a category name.');
        }

        // تصغير الحروف في اسم الفئة
        const lowercaseCategory = category.toLowerCase();

        const filteredPosts = posts.filter(post => {
            // تصغير الحروف في الفئات المتواجدة في المقالات
            const lowercaseCategories = post.category.map(cat => cat.toLowerCase());
            return lowercaseCategories.includes(lowercaseCategory);
        });
 
        return filteredPosts;
    } catch (error) {
        console.error('An error occurred:', error.message);
        return []; // إذا حدثت أي أخطاء، سيتم إرجاع مصفوفة فارغة
    }
}