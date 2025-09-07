import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Allow these routes to be accessed without authentication
const isPublicRoute = createRouteMatcher([
  '/api/courses(.*)',
  '/api/generate-course',
])

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    // Do not enforce authentication on public routes
    return
  }
  // Protect all other routes
  auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}