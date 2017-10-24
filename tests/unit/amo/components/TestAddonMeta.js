import { shallow } from 'enzyme';
import React from 'react';

import AddonMeta, {
  DEFAULT_LOADING_WIDTH,
  AddonMetaBase,
  LoadingWrapper,
} from 'amo/components/AddonMeta';
import { createInternalAddon } from 'core/reducers/addons';
import {
  dispatchClientMetadata,
  fakeAddon,
} from 'tests/unit/amo/helpers';
import { fakeI18n, shallowUntilTarget } from 'tests/unit/helpers';
import LoadingText from 'ui/components/LoadingText';


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
    expect(root.find('.AddonMeta-user-count').type()).toEqual(LoadingWrapper);
    expect(root.find('.AddonMeta-review-count').type()).toEqual(LoadingWrapper);
    expect(root.find('.AddonMeta-rating').type()).toEqual(LoadingWrapper);
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

  describe('LoadingText Wrapper Component', () => {
    function renderLoading({
      i18n = fakeI18n(),
      ...props
    } = {}) {
      return shallow(
        <LoadingWrapper i18n={i18n} {...props} />
      );
    }

    it('renders LoadingText', () => {
      const root = renderLoading();

      expect(root.find('.AddonMeta-loading-wrapper')).toHaveLength(1);
      expect(root.find(LoadingText)).toHaveLength(1);
    });

    it('uses a width if supplied', () => {
      const root = renderLoading({ width: 50 });

      expect(root.find(LoadingText)).toHaveProp('width', 50);
    });

    it('uses a default width if no width is supplied', () => {
      const root = renderLoading();

      expect(root.find(LoadingText)).toHaveProp('width', DEFAULT_LOADING_WIDTH);
    });

    it('outputs a className', () => {
      const root = renderLoading({ className: 'TestClass' });

      expect(root).toHaveClassName('TestClass');
    });
  });
});
