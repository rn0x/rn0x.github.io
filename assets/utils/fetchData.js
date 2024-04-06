/**
 * تقوم هذه الدالة بجلب البيانات من خلال Fetch API
 * @param {string} url رابط URL لجلب البيانات منه
 * @param {string} dataType نوع البيانات المتوقعة (مثل 'json', 'text', 'buffer')
 * @returns {Promise<any>} بيانات مرجعة بالنوع المحدد
 */
export default async function fetchData(url, dataType) {
    try {
        const response = await fetch(url); // جلب البيانات من الرابط المعطى
        if (!response.ok) {
            throw new Error('حدث خطأ في جلب البيانات'); // إذا كانت الاستجابة غير ناجحة
        }

        let data;
        switch (dataType) {
            case 'json':
                data = await response.json(); // تحويل البيانات إلى JSON
                break;
            case 'text':
                data = await response.text(); // الحصول على البيانات كنص
                break;
            case 'buffer':
                data = await response.arrayBuffer(); // الحصول على البيانات كـ Buffer
                break;
            default:
                throw new Error('نوع البيانات المعطى غير مدعوم');
        }

        return data; // إرجاع البيانات
    } catch (error) {
        console.error('حدث خطأ: ', error.message); // معالجة الأخطاء وطباعة الرسالة في حال حدوث خطأ
        throw error; // إعادة رمي الخطأ للتعامل معه في الكود الخارجي
    }
}
