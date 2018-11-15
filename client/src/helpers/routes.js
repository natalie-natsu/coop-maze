import some from 'lodash/some';
import { t } from 'i18next';
import { matchPath } from 'react-router-dom';

export const routes = {
  game: '/game/:id',
  home: '/',
  notAllowed: '/notAllowed',
};

export const routeKeys = {
  [routes.game]: 'game',
  [routes.home]: 'home',
  [routes.notAllowed]: 'notAllowed',
};

export const getRouteI18nKey = (pathname) => {
  let routeKey = false;

  some(routeKeys, (i18nKey, path) => {
    if (matchPath(pathname, { path, exact: true })) {
      routeKey = i18nKey;
    }
    return routeKey;
  });

  return routeKey;
};

export function getRouteName(pathname) {
  const key = getRouteI18nKey(pathname);
  return key && t(`route:${key}.name`) !== '' && `route:${key}.name`;
}

export function getRouteDesc(pathname) {
  const key = getRouteI18nKey(pathname);
  return key && t(`route:${key}.description`) !== '' && `route:${key}.description`;
}
