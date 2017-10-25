import { shallow } from 'enzyme';
import React from 'react';

import MetadataCard from 'ui/components/MetadataCard';
import LoadingText from 'ui/components/LoadingText';


describe(__filename, () => {
  function renderShallow({ metadata = [], ...props } = {}) {
    return shallow(<MetadataCard metadata={metadata} {...props} />);
  }

  it('renders a MetadataCard', () => {
    const item = renderShallow();

    expect(item).toHaveClassName('MetadataCard');
  });

  it('renders metadata', () => {
    const item = renderShallow({
      metadata: [
        {
          content: 'Hello I am content',
          title: 'I am title',
        },
      ],
    });

    expect(item.find('dd')).toHaveText('Hello I am content');
    expect(item.find('dt')).toHaveText('I am title');
  });

  it('renders null content as LoadingText', () => {
    const item = renderShallow({
      metadata: [
        {
          content: null,
          title: 'I am title',
        },
      ],
    });

    expect(item.find('dd').find(LoadingText)).toHaveLength(1);
    expect(item.find('dt')).toHaveText('I am title');
  });

  it('allows an empty string to render empty content', () => {
    const item = renderShallow({
      metadata: [
        {
          content: '',
          title: 'I am title',
        },
      ],
    });

    expect(item.find('dd')).toHaveText('');
    expect(item.find('dt')).toHaveText('I am title');
  });

  it('throws an error if metadata is missing', () => {
    expect(() => {
      renderShallow({ metadata: null });
    }).toThrow('The metadata property is required');
  });
});
