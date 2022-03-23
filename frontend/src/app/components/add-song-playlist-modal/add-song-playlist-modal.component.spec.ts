import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSongPlaylistModalComponent } from './add-song-playlist-modal.component';

describe('AddSongPlaylistModalComponent', () => {
  let component: AddSongPlaylistModalComponent;
  let fixture: ComponentFixture<AddSongPlaylistModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSongPlaylistModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSongPlaylistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
