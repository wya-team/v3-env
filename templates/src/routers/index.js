export * from './hooks';
export * from './routes';
import CRoutesManager from './routes.dynamic';
import FNScrollBehavior from './scroll-behavior';

export const RoutesManager = CRoutesManager;
export const scrollBehavior = FNScrollBehavior;