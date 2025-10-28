```
🌳 your-saas-project/
 ┣━━  app/
 ┃   ┣━━ (public_site)                             <-- (الموقع التعريفي العام: your-saas.com)
 ┃   ┃   ┣━━ page.tsx                              <-- (الصفحة الرئيسية: your-saas.com)
 ┃   ┃   ┣━━ pricing/page.tsx                      <-- (صفحة الأسعار: your-saas.com/pricing)
 ┃   ┃   ┗━━ layout.tsx                            <-- (Layout الموقع العام: يحتوي الهيدر والفوتر)
 ┃   ┃
 ┃   ┣━━ _guest/                                   <-- (مخفي: يعالج النطاقات الفرعية للضيوف [slug].your-saas.com)
 ┃   ┃   ┗━━ [hotel_slug]/                         <-- (يلتقط "hilton" من النطاق الفرعي)
 ┃   ┃       ┣━━ page.tsx                          <-- (لوحة تحكم الضيف: hilton.your-saas.com)
 ┃   ┃       ┣━━ check-in/page.tsx                 <-- (صفحة تسجيل الدخول: hilton.your-saas.com/check-in)
 ┃   ┃       ┣━━ room-service/page.tsx             <-- (صفحة خدمة الغرف: hilton.your-saas.com/room-service)
 ┃   ┃       ┣━━ feedback/page.tsx                 <-- (صفحة الشكاوى: hilton.your-saas.com/feedback)
 ┃   ┃       ┣━━ layout.tsx                        <-- (الأهم: يجلب بيانات الفندق (الألوان/الشعار) ويطبقها)
 ┃   ┃       ┗━━ not-found.tsx                     <-- (يُعرض إذا كان النطاق الفرعي للفندق غير موجود)
 ┃   ┃
 ┃   ┣━━ _staff/                                   <-- (مخفي: يعالج لوحة تحكم الموظفين والمدراء your-saas.com/admin)
 ┃   ┃   ┗━━ admin/
 ┃   ┃       ┣━━ login/page.tsx                    <-- (صفحة تسجيل دخول الموظفين: your-saas.com/admin/login)
 ┃   ┃       ┃
 ┃   ┃       ┣━━ (portal)                          <-- (مجموعة محمية: لا يمكن دخولها إلا بعد تسجيل الدخول)
 ┃   ┃       ┃   ┣━━ layout.tsx                    <-- (الأهم: "جدار الحماية". يتحقق من هوية الموظف وصلاحياته)
 ┃   ┃       ┃   ┃
 ┃   ┃       ┃   ┣━━ page.tsx                      <-- (المركز: your-saas.com/admin. هذا الموجه الذكي)
 ┃   ┃       ┃   ┃                                       (وظيفته: فحص دور الموظف)
 ┃   ┃       ┃   ┃                                       (- إذا كان SuperAdmin -> يوجه إلى /admin/superadmin)
 ┃   ┃       ┃   ┃                                       (- إذا كان HotelAdmin -> يوجه إلى /admin/[hotel_slug]/dashboard)
 ┃   ┃       ┃   ┃
 ┃   ┃       ┃   ┣━━ [hotel_slug]/                 <-- (صفحات الموظف العادي المرتبط بفندق)
 ┃   ┃       ┃   ┃   ┣━━ dashboard/page.tsx        <-- (لوحة تحكم الفندق: /admin/hilton/dashboard)
 ┃   ┃       ┃   ┃   ┣━━ reservations/page.tsx     <-- (إدارة الحجوزات: /admin/hilton/reservations)
 ┃   ┃       ┃   ┃   ┣━━ guests/page.tsx           <-- (إدارة الضيوف: /admin/hilton/guests)
 ┃   ┃       ┃   ┃   ┣━━ settings/page.tsx         <-- (إعدادات الفندق: /admin/hilton/settings)
 ┃   ┃       ┃   ┃   ┗━━ layout.tsx                <-- (Layout لوحة تحكم الفندق: يحتوي القائمة الجانبية الخاصة بالموظف)
 ┃   ┃       ┃   ┃
 ┃   ┃       ┃   ┗━━ superadmin/                   <-- (صفحات الـ SuperAdmin فقط)
 ┃   ┃       ┃       ┣━━ page.tsx                  <-- (لوحة التحكم المركزية: /admin/superadmin)
 ┃   ┃       ┃       ┣━━ hotels/page.tsx           <-- (إدارة كل الفنادق: /admin/superadmin/hotels)
 ┃   ┃       ┃       ┣━━ users/page.tsx            <-- (إدارة كل الموظفين: /admin/superadmin/users)
 ┃   ┃       ┃       ┗━━ layout.tsx                <-- (Layout خاص بالـ SuperAdmin)
 ┃   ┃       ┃
 ┃   ┃       ┗━━ (auth_layout)/                    <-- (Layout بسيط لصفحة تسجيل الدخول)
 ┃   ┃           ┗━━ layout.tsx
 ┃   ┃
 ┃   ┣━━ api/
 ┃   ┃   ┣━━ auth/                                 <-- (معالجات تسجيل الدخول/الخروج)
 ┃   ┃   ┣━━ webhooks/                             <-- (لاستقبال Webhooks من Supabase - مثلاً لتحليل الشكاوى)
 ┃   ┃   ┗━━ ai/
 ┃   ┃       ┗━━ recommend/route.ts                <-- (نقطة النهاية لاستدعاء نماذج Azure AI)
 ┃   ┃
 ┃   ┣━━ layout.tsx                                <-- (الـ Layout الجذري: يضيف الخطوط، Supabase Provider)
 ┃   ┗━━ global.css
 ┃
 ┣━━ components/
 ┃   ┣━━ ui/                                     <-- (المكونات الجاهزة: Button, Input, Card)
 ┃   ┣━━ guest/                                  <-- (مكونات مشتركة لواجهة الضيف)
 ┃   ┗━━ staff/                                  <-- (مكونات مشتركة للوحة تحكم الموظفين)
 ┃
 ┣━━ lib/
 ┃   ┣━━ supabase.ts                             <-- (إعداد عميل Supabase Client/Server)
 ┃   ┣━━ auth.ts                                 <-- (دوال مساعدة للمصادقة)
 ┃   ┗━━ ai.ts                                   <-- (دالة لاستدعاء Azure AI API)
 ┃
 ┣━━ public/
 ┃   ┣━━ images/
 ┃   ┗━━ favicon.ico
 ┃
 ┣━━ middleware.ts                                 <-- (الأهم: الموزع الذي يقرأ النطاق ويوجه الطلب)
 ┣━━ .env.local                                    <-- (يحتوي مفاتيح Supabase و Azure)
 ┣━━ package.json
 ┗━━ tailwind.config.ts
```