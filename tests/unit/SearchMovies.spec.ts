import { mount } from '@vue/test-utils'
import SearchMovies from '@/components/SearchMovies.vue'

declare const global: {
  fetch: jest.Mock;
}

describe('SearchMovies.vue', () => {
  it('renders the search input', () => {
    const wrapper = mount(SearchMovies)
    const input = wrapper.find('input[type="text"]')
    expect(input.exists()).toBe(true)
  })

  it('renders movie results when search query is present', async () => {
    const mockMovies = [
      {
        Title: 'Inception',
        Year: '2010',
        imdbID: 'tt1375666',
        Type: 'movie',
        Poster: 'https://example.com/inception.jpg'
      },
      {
        Title: 'The Matrix',
        Year: '1999',
        imdbID: 'tt0133093',
        Type: 'movie',
        Poster: 'https://example.com/matrix.jpg'
      }
    ]

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ Search: mockMovies })
      })
    ) as jest.Mock

    const wrapper = mount(SearchMovies)
    const input = wrapper.find('input[type="text"]')
    await input.setValue('matrix')
    await input.trigger('input')

    await wrapper.vm.$nextTick()

    const movieTitles = wrapper.findAll('.movie h2')
    expect(movieTitles).toHaveLength(mockMovies.length)
    expect(movieTitles[0].text()).toBe(mockMovies[0].Title)
    expect(movieTitles[1].text()).toBe(mockMovies[1].Title)
  })

  it('displays no results found message', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ Search: [] })
      })
    ) as jest.Mock

    const wrapper = mount(SearchMovies)
    const input = wrapper.find('input[type="text"]')
    await input.setValue('nonexistent')
    await input.trigger('input')

    await wrapper.vm.$nextTick()

    const noResults = wrapper.find('.no-results')
    expect(noResults.exists()).toBe(true)
  })

  it('displays please enter at least 2 characters message', async () => {
    const wrapper = mount(SearchMovies)
    const input = wrapper.find('input[type="text"]')
    await input.setValue('a')
    await input.trigger('input')

    await wrapper.vm.$nextTick()

    const noQuery = wrapper.find('.no-query')
    expect(noQuery.exists()).toBe(true)
  });
})
