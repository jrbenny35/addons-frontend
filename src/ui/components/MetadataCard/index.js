/* @flow */
import React from 'react';

import LoadingText from 'ui/components/LoadingText';

import './styles.scss';


type Props = {|
  metadata: Array<Object>,
|};

const MetadataCard = (props: Props) => {
  if (!props.metadata) {
    throw new Error('The metadata property is required');
  }

  return (
    <div className="MetadataCard">
      {props.metadata.map(({ content, title } = {}) => {
        return (
          <dl className="MetadataCard-list" key={title}>
            <dd className="MetadataCard-content">
              {content || content === '' ? content : <LoadingText />}
            </dd>
            <dt className="MetadataCard-title">{title}</dt>
          </dl>
        );
      })}
    </div>
  );
};

export default MetadataCard;
