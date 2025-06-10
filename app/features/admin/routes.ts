import { route } from '@react-router/dev/routes';

export const adminRoutesConfig = {
  // All admin routes are protected
  protected: [
    route(
      'admin',
      'features/admin/layouts/AdminLayout.tsx',
      [route('dashboard', 'features/admin/containers/AdminDashboardPage.tsx')]
    )
  ],
  public: [],
}; 