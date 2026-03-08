import { Component } from '@angular/core';
import { Book, BookReadState } from '../../../services/books-service/books-service';
import { BookCard } from '../book-card/book-card';

@Component({
  selector: 'app-reading',
  imports: [BookCard],
  templateUrl: './reading.html',
  styleUrl: './reading.scss',
})
export class Reading {
  protected readingBooks(): Book[] {
    return [
      {
        id: '1',
        title: 'the thousand autumns of jacob de zoet',
        author: 'david mitchell',
        description: 'a novel about a dutch merchant in 18th-century japan',
        coverImage: 'https://m.media-amazon.com/images/I/814QgHATIsL._AC_UF1000,1000_QL80_.jpg',
        state: BookReadState.CURRENTLY_READING,
        pageCount: 479,
        currentPage: 192,
        rating: 5,
        review: 'an engaging story with rich historical detail'
      }, 
      {
        id: '2',
        title: 'the troop',
        author: 'nick cutter',
        description: 'a visceral body-horror novel about scoutmaster tim riggs and five boy scouts on a remote canadian island. their camping trip turns into a fight for survival against a bioengineered, ravenously hungry, tapeworm-like parasite that causes grotesque physical transformations',
        coverImage: 'https://m.media-amazon.com/images/I/81PG4oLQDhL._UF1000,1000_QL80_.jpg',
        state: BookReadState.FINISHED_READING,
        pageCount: 479,
        currentPage: 192,
        rating: 5,
        review: 'an engaging story with rich historical detail'
      }
    ];
  }
}
