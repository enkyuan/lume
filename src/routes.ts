import { Router } from '@/lib/routes/router'

export const routes = new Router({
  /* Authentication */
  Login: '/login',
  Signup: '/signup',
  ResetPassword: '/reset-password',
  NewPassword: '/new-password',
  /* Timeline */
  Home: '/',
  Feeds: '/feeds',
  Post: '/feeds/:id',
  /* Notifications */
  Notifications: '/notifications',
  NotificationSettings: '/notifications/settings',
  /* Profile & Settings */
  Profile: '/:name',
  Settings: '/settings'
});
