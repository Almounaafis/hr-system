export { default } from "next-auth/middleware";

export const config = {
  // كل الصفحات محمية ماعدا login والـ API
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};