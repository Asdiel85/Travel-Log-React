import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import CreatePost from './CreatePost';
import * as postService from '../../service/postService';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { ErrorContext } from '../../contexts/ErrorContext.jsx';

describe('Testing create post component', () => {
  const setErrorMessage = vi.fn();
  const errorMessage = null;
  it('should render properly', () => {
    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <ErrorContext.Provider value={[errorMessage, setErrorMessage]}>
          <CreatePost />
        </ErrorContext.Provider>
      </BrowserRouter>
    );
    expect(getByText('Create Post')).toBeTruthy();
    expect(getByTestId('country')).toBeTruthy();
    expect(getByTestId('city')).toBeTruthy();
    expect(getByTestId('imageUrl')).toBeTruthy();
    expect(getByTestId('cost')).toBeTruthy();
    expect(getByTestId('description')).toBeTruthy();
    expect(getByTestId('create')).toBeTruthy();
  });

  it('should show error paragraph if data is filled incorectly', async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <ErrorContext.Provider value={[errorMessage, setErrorMessage]}>
          <CreatePost />
        </ErrorContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(getByTestId('country'), {
      target: { value: '' },
    });
    fireEvent.change(getByTestId('city'), {
      target: { value: '' },
    });
    fireEvent.change(getByTestId('imageUrl'), {
      target: { value: '' },
    });
    fireEvent.change(getByTestId('cost'), { target: { value: '0' } });
    fireEvent.change(getByTestId('description'), {
      target: { value: '' },
    });

    fireEvent.click(getByTestId('create'));

    expect(getByTestId('error-country')).toBeTruthy();
    expect(getByTestId('error-city')).toBeTruthy();
    expect(getByTestId('error-imageUrl')).toBeTruthy();
    expect(getByTestId('error-cost')).toBeTruthy();
    expect(getByTestId('error-description')).toBeTruthy();
  });
  it('should make api call when data filled correctly', async () => {
    const spy = vi.spyOn(postService, 'createPost');

    const { getByTestId } = render(
      <BrowserRouter>
        <ErrorContext.Provider value={[errorMessage, setErrorMessage]}>
          <CreatePost />
        </ErrorContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(getByTestId('country'), {
      target: { value: 'Usa' },
    });
    fireEvent.change(getByTestId('city'), {
      target: { value: 'Portland' },
    });
    fireEvent.change(getByTestId('imageUrl'), {
      target: {
        value: 'https://media.timeout.com/images/105937857/750/562/image.jpg',
        cost: '6983',
      },
    });
    fireEvent.change(getByTestId('cost'), { target: { value: '6983' } });
    fireEvent.change(getByTestId('description'), {
      target: { value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    });

    fireEvent.click(getByTestId('create'));
    await expect(spy).toHaveBeenCalledWith({
      country: 'Usa',
      city: 'Portland',
      imageUrl: 'https://media.timeout.com/images/105937857/750/562/image.jpg',
      cost: '6983',
      description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    });
  });
});
