import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PhotoService } from '../../../services/photo-service/photo-service';
import { PhotoMetadataDialog } from './photo-metadata-dialog';

describe('PhotoMetadataDialog', () => {
  let component: PhotoMetadataDialog;
  let fixture: ComponentFixture<PhotoMetadataDialog>;
  let photoService: jasmine.SpyObj<PhotoService>;

  beforeEach(async () => {
    photoService = jasmine.createSpyObj<PhotoService>('PhotoService', ['getPhoto']);

    await TestBed.configureTestingModule({
      imports: [PhotoMetadataDialog],
      providers: [{ provide: PhotoService, useValue: photoService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoMetadataDialog);
    component = fixture.componentInstance;
    component.image = {
      name: 'IMG_0001.jpg',
      url: 'https://example.com/img.jpg',
      caption: 'sunset',
      location: 'berkeley',
      takenDate: '2024-08-10',
    };
    fixture.detectChanges();
  });

  it('should prefill the form from the provided image metadata', () => {
    expect(component.caption).toBe('sunset');
    expect(component.location).toBe('berkeley');
    expect(component.takenDate).toBe('2024-08-10');
  });

  it('should fetch photo metadata from the database when an image id is present and metadata is missing', () => {
    photoService.getPhoto.and.returnValue(of({
      id: 'photo-123',
      caption: 'from db',
      location: 'oakland',
      takenDate: '2024-09-01',
      image: 'https://example.com/img.jpg',
    } as any));

    component.image = {
      name: 'IMG_0002.jpg',
      url: 'https://example.com/img.jpg',
      id: 'photo-123',
    };

    component.ngOnChanges();

    expect(photoService.getPhoto).toHaveBeenCalledWith('photo-123');
    expect(component.caption).toBe('from db');
    expect(component.location).toBe('oakland');
    expect(component.takenDate).toBe('2024-09-01');
  });
});
