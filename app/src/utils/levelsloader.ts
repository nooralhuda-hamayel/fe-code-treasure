// src/utils/levelsLoader.ts

export const levelsLoader = async () => {
  const response = await fetch('/api/levels');
  if (!response.ok) {
    throw new Error('Failed to load levels'); // رمي الخطأ إذا فشل التحميل
  }
  return response.json(); // إرجاع البيانات المستلمة من الخادم
};
