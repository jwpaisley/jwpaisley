import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Button } from '../button/button';

export interface PeopleListPerson {
  firstName: string;
  lastName: string;
  profilePictureUrl?: string | null;
}

@Component({
  selector: 'jwpaisley-people-list',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './people-list.html',
  styleUrl: './people-list.scss',
})
export class PeopleList {
  @Input() people: PeopleListPerson[] = [];
  @Input() maxPeopleToShow = 5;

  showAll = false;

  get visiblePeople(): PeopleListPerson[] {
    if (this.showAll || this.people.length <= this.maxPeopleToShow) {
      return this.people;
    }

    return this.people.slice(0, this.maxPeopleToShow);
  }

  get hasMorePeople(): boolean {
    return this.people.length > this.maxPeopleToShow;
  }

  toggleShowMore(): void {
    this.showAll = !this.showAll;
  }

  getFullName(person: PeopleListPerson): string {
    const fullName = [person.firstName, person.lastName].filter(Boolean).join(' ').trim();
    return fullName || 'unknown user';
  }

  getInitials(person: PeopleListPerson): string {
    const firstInitial = person.firstName?.trim()?.charAt(0)?.toUpperCase() ?? '';
    const lastInitial = person.lastName?.trim()?.charAt(0)?.toUpperCase() ?? '';

    if (!firstInitial && !lastInitial) {
      return '?';
    }

    return `${firstInitial}${lastInitial}`;
  }
}
