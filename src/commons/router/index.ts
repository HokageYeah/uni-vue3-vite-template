import type { Router } from 'uni-mini-router';
import { createRouter } from 'uni-mini-router';

export const setupRouter = (app: { use: (arg0: Router) => void }) => {
  const router = createRouter({
    routes: [...ROUTES] // 路由表信息
  });
  app.use(router);
};
