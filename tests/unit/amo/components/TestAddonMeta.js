import React from 'react';

import AddonMeta, { AddonMetaBase, Loading } from 'amo/components/AddonMeta';
import Link from 'amo/components/Link';
import { createInternalAddon } from 'core/reducers/addons';
import {
  dispatchClientMetadata,
  dispatchSignInActions,
  fakeAddon,
} from 'tests/unit/amo/helpers';
import { fakeI18n, shallowUntilTarget } from 'tests/unit/helpers';
import LoadingText from 'ui/components/LoadingText';
import Rating from 'ui/components/Rating';


describe(__filename, () => {
  function render({
    addon = createInternalAddon(fakeAddon),
    store = dispatchClientMetadata().store,
    ...props
  } = {}) {
    return shallowUntilTarget(
      <AddonMeta
        addon={addon}
        i18n={fakeI18n()}
        store={store}
        {...props}
      />,
      AddonMetaBase
    );
  }

  it('can render without an addon', () => {
    const root = render({ addon: null });
    expect(root.find('.AddonMeta-user-count').type()).toEqual(Loading);
    expect(root.find('.AddonMeta-review-count').type()).toEqual(Loading);
    expect(root.find('.AddonMeta-rating').type()).toEqual(Loading);
  });

  describe('average daily users', () => {
    function getUserCount(root) {
      return root.find('.AddonMeta-user-count').render().text();
    }

    it('renders the user count', () => {
      const root = render({
        addon: createInternalAddon({ ...fakeAddon, average_daily_users: 2 }),
      });

      expect(getUserCount(root)).toEqual('2 users');
    });

    it('renders one user', () => {
      const root = render({
        addon: createInternalAddon({ ...fakeAddon, average_daily_users: 1 }),
      });

      expect(getUserCount(root)).toEqual('1 user');
    });

    it('localizes the user count', () => {
      const i18n = fakeI18n({ lang: 'de' });
      const root = render({
        addon: createInternalAddon({
          ...fakeAddon,
          average_daily_users: 1000,
        }),
        i18n,
      });
      expect(getUserCount(root)).toMatch(/^1\.000/);
    });
  });

  describe('ratings', () => {
    function renderRatings(ratings = {}, otherProps = {}) {
      return render({
        addon: createInternalAddon({
          ...fakeAddon,
          ratings: {
            ...fakeAddon.ratings,
            ...ratings,
          },
        }),
        ...otherProps,
      });
    }

    function getReviewCount(root) {
      return root.find('.AddonMeta-review-count').render().text();
    }

    it('renders a count of multiple ratings', () => {
      const root = renderRatings({ count: 5 });
      expect(getReviewCount(root)).toEqual('5 reviews');
    });

    it('renders a count of one rating', () => {
      const root = renderRatings({ count: 1 });
      expect(getReviewCount(root)).toEqual('1 review');
    });

    it('localizes review count', () => {
      const i18n = fakeI18n({ lang: 'de' });
      const root = renderRatings({ count: 1000 }, { i18n });
      expect(getReviewCount(root)).toContain('1.000');
    });
  });
});
