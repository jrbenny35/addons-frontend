/* @flow */
import classNames from 'classnames';
import React from 'react';
import { compose } from 'redux';

import translate from 'core/i18n/translate';
import { sanitizeHTML } from 'core/utils';
import type { AddonType } from 'core/types/addons';
import Card from 'ui/components/Card';
import LoadingText from 'ui/components/LoadingText';
import Rating from 'ui/components/Rating';
import type { I18nType } from 'core/types/i18n';

import './styles.scss';

type LoadingWrapperProps = {|
  children: any,
  className?: string,
  width?: number,
|};

export const DEFAULT_LOADING_WIDTH = 40;

export const LoadingWrapper = (props: LoadingWrapperProps) => {
  return (
    <div className={classNames('AddonMeta-loading-wrapper', props.className)}>
      <LoadingText
        className="AddonMeta-item-header"
        width={props.width || DEFAULT_LOADING_WIDTH}
      />
      <span className="AddonMeta-item-subheader">{props.children}</span>
    </div>
  );
};


type Props = {|
  addon: AddonType | null,
  i18n: I18nType,
|};

export class AddonMetaBase extends React.Component<Props> {
  render() {
    const { addon, i18n } = this.props;
    const averageRating = addon && addon.ratings ? addon.ratings.average : null;
    const addonRatingCount = addon && addon.ratings ?
      addon.ratings.count : null;

    let userCount;
    if (addon) {
      const averageDailyUsers = addon.average_daily_users;
      userCount = i18n.sprintf(
        i18n.ngettext(
          '%(startTag)s%(total)s%(endTag)s %(startSubTag)suser%(endSubTag)s',
          '%(startTag)s%(total)s%(endTag)s %(startSubTag)susers%(endSubTag)s',
          averageDailyUsers
        ), {
          endSubTag: '</span>',
          startSubTag: '<span class="AddonMeta-item-subheader">',
          endTag: '</span>',
          startTag: '<span class="AddonMeta-item-header">',
          total: i18n.formatNumber(averageDailyUsers),
        },
      );
    } else {
      userCount = null;
    }

    let reviewCount;
    if (!addon) {
      reviewCount = null;
    } else if (addonRatingCount) {
      reviewCount = i18n.sprintf(
        i18n.ngettext(
          '%(startTag)s%(total)s%(endTag)s %(startSubTag)sreview%(endSubTag)s',
          '%(startTag)s%(total)s%(endTag)s %(startSubTag)sreviews%(endSubTag)s',
          addonRatingCount
        ), {
          endSubTag: '</span>',
          startSubTag: '<span class="AddonMeta-item-subheader">',
          endTag: '</span>',
          startTag: '<span class="AddonMeta-item-header">',
          total: i18n.formatNumber(addonRatingCount),
        },
      );
    } else {
      reviewCount = i18n.gettext('No reviews');
    }

    /* eslint-disable react/no-danger */
    return (
      <Card className="AddonMeta">
        <div className="AddonMeta-item AddonMeta-users">
          <h3 className="visually-hidden">{i18n.gettext('Used by')}</h3>
          {userCount ? (
            <div
              className="AddonMeta-text AddonMeta-user-count"
              dangerouslySetInnerHTML={sanitizeHTML(userCount, ['span'])}
            />
          ) : (
            <LoadingWrapper className="AddonMeta-user-count">
              {i18n.gettext('users')}
            </LoadingWrapper>
          )}

          {reviewCount ? (
            <div
              className="AddonMeta-text AddonMeta-review-count"
              dangerouslySetInnerHTML={sanitizeHTML(reviewCount, ['span'])}
            />
          ) : (
            <LoadingWrapper className="AddonMeta-review-count">
              {i18n.gettext('reviews')}
            </LoadingWrapper>
          )}
          {averageRating ? (
            <div className="AddonMeta-text AddonMeta-rating">
              <Rating
                className="AddonMeta-item-header"
                rating={averageRating}
                readOnly
                styleName="small"
              />
              <span className="AddonMeta-item-subheader">
                {i18n.gettext('Average Rating')}
              </span>
            </div>
          ) : (
            <LoadingWrapper className="AddonMeta-rating" width={100}>
              {i18n.gettext('Average Rating')}
            </LoadingWrapper>
          )}
        </div>
      </Card>
    );
    /* eslint-enable react/no-danger */
  }
}

export default compose(
  translate(),
)(AddonMetaBase);
