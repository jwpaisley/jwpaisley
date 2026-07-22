import { Timeline } from './timeline';
import { Book, BookReadState } from '../../../services/books-service/books-service';

describe('Timeline', () => {
  it('should sort finished books by finish date newest first', () => {
    const component = new Timeline({} as any, {} as any, {} as any);
    const books: Book[] = [
      { id: '1', title: 'Oldest', author: 'A', coverImage: '', description: '', state: BookReadState.FINISHED_READING, finishDate: '2024-01-01' },
      { id: '2', title: 'Newest', author: 'A', coverImage: '', description: '', state: BookReadState.FINISHED_READING, finishDate: '2024-03-15' },
      { id: '3', title: 'Middle', author: 'A', coverImage: '', description: '', state: BookReadState.FINISHED_READING, finishDate: '2024-02-10' },
    ];

    const sortedBooks = component['sortFinishedBooksByFinishDate'](books);

    expect(sortedBooks.map((book) => book.title)).toEqual(['Newest', 'Middle', 'Oldest']);
  });

  it('should group finished books by month', () => {
    const component = new Timeline({} as any, {} as any, {} as any);
    const books: Book[] = [
      { id: '1', title: 'June Book', author: 'A', coverImage: '', description: '', state: BookReadState.FINISHED_READING, finishDate: '2024-06-10' },
      { id: '2', title: 'July Book', author: 'A', coverImage: '', description: '', state: BookReadState.FINISHED_READING, finishDate: '2024-07-03' },
      { id: '3', title: 'Another July Book', author: 'A', coverImage: '', description: '', state: BookReadState.FINISHED_READING, finishDate: '2024-07-12' },
    ];

    const groupedBooks = component['groupFinishedBooksByMonth'](books);

    expect(groupedBooks.map((group) => group.label)).toEqual(['july 2024', 'june 2024']);
    expect(groupedBooks[0].books.map((book) => book.title)).toEqual(['Another July Book', 'July Book']);
  });
});
